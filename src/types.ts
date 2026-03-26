export type Role = 'admin' | 'employee' | 'client';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  assignedEmployeeId: string;
  notes: string;
  createdAt: any;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Receipt {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: any;
  description: string;
  items: ReceiptItem[];
  pdfUrl?: string;
  createdAt: any;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedToName: string;
  assignedToId: string;
  tags: string[];
  dueDate: any;
  createdAt: any;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: any;
  details: string;
  type?: 'security' | 'system' | 'user' | 'data' | 'ai' | 'warning';
}

export type Log = ActivityLog;

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  likesCount: number;
  commentsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  date: any;
  location: string;
  type: 'webinar' | 'workshop' | 'meeting';
  capacity: number;
  attendeesCount: number;
  createdAt: any;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
