import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { OperationType, FirestoreErrorInfo } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  async getDocument<T>(path: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, path, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as T) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
      return null;
    }
  },

  async getCollection<T>(path: string, constraints: any[] = []): Promise<T[]> {
    try {
      const colRef = collection(db, path);
      const queryConstraints = constraints.map(c => {
        if (c.field && c.operator && c.value !== undefined) {
          return where(c.field, c.operator, c.value);
        }
        return c;
      });
      const q = query(colRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeCollection<T>(path: string, constraints: any[], callback: (data: T[]) => void, errorCallback?: (error: any) => void) {
    const colRef = collection(db, path);
    const queryConstraints = constraints.map(c => {
      if (c.field && c.operator && c.value !== undefined) {
        return where(c.field, c.operator, c.value);
      }
      return c;
    });
    const q = query(colRef, ...queryConstraints);
    return onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        callback(data);
      },
      (error) => {
        if (errorCallback) errorCallback(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async logActivity(action: string, details: string, type: 'security' | 'system' | 'user' | 'data' | 'ai' | 'warning' = 'user') {
    try {
      const colRef = collection(db, 'logs');
      await addDoc(colRef, {
        userId: auth.currentUser?.uid || 'system',
        userName: auth.currentUser?.displayName || auth.currentUser?.email || 'System',
        action,
        details,
        type,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  async setDocument(path: string, id: string, data: any) {
    try {
      const docRef = doc(db, path, id);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      if (path !== 'logs') {
        this.logActivity(`Set ${path}`, `Document ${id} in ${path} was set/merged.`, 'data');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    }
  },

  async addDocument(path: string, data: any) {
    try {
      const colRef = collection(db, path);
      const docRef = await addDoc(colRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      if (path !== 'logs') {
        this.logActivity(`Create ${path}`, `New document added to ${path}.`, 'data');
      }
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateDocument(path: string, id: string, data: any) {
    try {
      const docRef = doc(db, path, id);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
      if (path !== 'logs') {
        this.logActivity(`Update ${path}`, `Document ${id} in ${path} was updated.`, 'data');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  },

  async runBatch(operations: (batch: any) => void) {
    const { writeBatch } = await import('firebase/firestore');
    const batch = writeBatch(db);
    try {
      operations(batch);
      await batch.commit();
      this.logActivity('Batch Operation', 'Multiple documents were modified in a single transaction.', 'system');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch');
    }
  },

  async deleteDocument(path: string, id: string) {
    try {
      const docRef = doc(db, path, id);
      await deleteDoc(docRef);
      if (path !== 'logs') {
        this.logActivity(`Delete ${path}`, `Document ${id} was removed from ${path}.`, 'warning');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    }
  }
};
