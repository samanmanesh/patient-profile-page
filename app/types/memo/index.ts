import { ID, DateTime, Status } from '../common';

export type MemoType = 'CLINICAL_NOTE' | 'ADMINISTRATIVE' | 'LAB_RESULT' | 'IMAGING_RESULT' | 'PRESCRIPTION';
export type MemoPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Memo {
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