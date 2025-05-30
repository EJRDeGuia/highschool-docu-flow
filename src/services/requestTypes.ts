
export interface DocumentRequest {
  id: string;
  userId: string;
  documentType: string;
  documentTypeName: string;
  purpose: string;
  additionalDetails?: string;
  copies: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  fee: number;
  hasPaid: boolean;
  hasUploadedReceipt: boolean;
  timeline: RequestTimelineItem[];
}

export type RequestStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Approved' 
  | 'Rejected' 
  | 'Completed' 
  | 'Cancelled';

export interface RequestTimelineItem {
  id: string;
  step: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  note?: string;
}

export interface RequestStatistics {
  total: number;
  pending: number;
  processing: number;
  approved: number;
  completed: number;
  rejected: number;
}
