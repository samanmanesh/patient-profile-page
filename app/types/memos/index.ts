import { ID, DateTime, Status } from '../common';

export type MemoType = 'CLINICAL_NOTE' | 'ADMINISTRATIVE' | 'LAB_RESULT' | 'IMAGING_RESULT' | 'PRESCRIPTION';
export type MemoPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Original application Memo type
export interface AppMemo {
  id: ID;
  type: MemoType;
  title: string;
  content: string;
  priority: MemoPriority;
  status: Status;
  patientId: ID;
  authorId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
  tags?: string[];
  attachments?: MemoAttachment[];
}

// API Memo type that matches the JSON structure
export interface Memo {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  note: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdDate: string;
  updatedDate: string;
}

export interface MemoAttachment {
  id: ID;
  memoId: ID;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: DateTime;
}

export interface MemoComment {
  id: ID;
  memoId: ID;
  content: string;
  authorId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
} 