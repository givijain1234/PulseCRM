import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile, Role } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        const preferredRole = sessionStorage.getItem('preferred_role') as Role;

        if (docSnap.exists()) {
          const existingData = docSnap.data() as UserProfile;
          // If we have a preferred role from the login form, use it, otherwise use existing
          const finalRole = preferredRole || existingData.role;
          const updatedProfile = { ...existingData, role: finalRole };
          
          if (preferredRole && preferredRole !== existingData.role) {
            await setDoc(docRef, { role: preferredRole, updatedAt: serverTimestamp() }, { merge: true });
          }
          
          setProfile(updatedProfile);
          if (preferredRole) sessionStorage.removeItem('preferred_role');
        } else {
          // Check for demo users
          const demoEmails: Record<string, Role> = {
            'admin@pulsecrm.com': 'admin',
            'riya@pulsecrm.com': 'employee',
            'kunal@gmail.com': 'client',
            'vikram@pulsecrm.com': 'employee',
            'sara@example.com': 'client'
          };

          const isFirstAdmin = currentUser.email === 'givijain16@gmail.com' || currentUser.email === 'admin@pulsecrm.com';
          const assignedRole: Role = demoEmails[currentUser.email || ''] || preferredRole || (isFirstAdmin ? 'admin' : 'client');
          
          if (preferredRole) sessionStorage.removeItem('preferred_role');

          const newProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            name: currentUser.displayName || 'Anonymous User',
            role: assignedRole,
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, { ...newProfile, updatedAt: serverTimestamp() });
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (selectedRole: Role) => {
    const provider = new GoogleAuthProvider();
    sessionStorage.setItem('preferred_role', selectedRole);
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        const profile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || 'Anonymous User',
          role: selectedRole,
          createdAt: docSnap.exists() ? (docSnap.data() as UserProfile).createdAt : new Date().toISOString(),
        };
        
        await setDoc(docRef, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
        setProfile(profile);
        sessionStorage.removeItem('preferred_role');
      }
    } catch (error) {
      sessionStorage.removeItem('preferred_role');
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    logout,
    isAdmin: profile?.role === 'admin',
    isEmployee: profile?.role === 'employee',
    isClient: profile?.role === 'client',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
