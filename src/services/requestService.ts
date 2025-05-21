
import { User } from "../contexts/AuthContext";

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

// These endpoint URLs should be replaced with your actual API endpoints
const API_BASE_URL = '/api';

// Get all requests (for admin/registrar)
export const getAllRequests = async (): Promise<DocumentRequest[]> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests`);
  // if (!response.ok) throw new Error('Failed to fetch requests');
  // return await response.json();
  
  // Temporary: Return empty array until API is implemented
  return [];
};

// Get requests for a specific user
export const getUserRequests = async (userId: string): Promise<DocumentRequest[]> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/user/${userId}`);
  // if (!response.ok) throw new Error('Failed to fetch user requests');
  // return await response.json();
  
  // Temporary: Return empty array until API is implemented
  return [];
};

// Get a specific request by ID
export const getRequestById = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/${requestId}`);
  // if (!response.ok) {
  //   if (response.status === 404) return undefined;
  //   throw new Error('Failed to fetch request');
  // }
  // return await response.json();
  
  // Temporary: Return undefined until API is implemented
  return undefined;
};

// Update request status
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<DocumentRequest | undefined> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ status, note }),
  // });
  // if (!response.ok) {
  //   if (response.status === 404) return undefined;
  //   throw new Error('Failed to update request status');
  // }
  // return await response.json();
  
  // Temporary: Return undefined until API is implemented
  return undefined;
};

// Create new request
export const createRequest = async (
  userId: string,
  documentType: string,
  documentTypeName: string,
  purpose: string,
  copies: number,
  additionalDetails?: string,
  fee?: number
): Promise<DocumentRequest> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     userId,
  //     documentType,
  //     documentTypeName,
  //     purpose,
  //     copies,
  //     additionalDetails,
  //     fee,
  //   }),
  // });
  // if (!response.ok) throw new Error('Failed to create request');
  // return await response.json();
  
  // Temporary: Return a placeholder request with minimal data until API is implemented
  const placeholderRequest: DocumentRequest = {
    id: 'pending',
    userId,
    documentType,
    documentTypeName,
    purpose,
    additionalDetails,
    copies,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fee: fee || copies * 50,
    hasPaid: false,
    hasUploadedReceipt: false,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'current',
        date: new Date().toLocaleString(),
      }
    ]
  };
  
  return placeholderRequest;
};

// Mark request as paid
export const markRequestAsPaid = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/${requestId}/payment`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ hasPaid: true }),
  // });
  // if (!response.ok) {
  //   if (response.status === 404) return undefined;
  //   throw new Error('Failed to mark request as paid');
  // }
  // return await response.json();
  
  // Temporary: Return undefined until API is implemented
  return undefined;
};

// Mark receipt as uploaded
export const markReceiptUploaded = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/${requestId}/receipt`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ hasUploadedReceipt: true }),
  // });
  // if (!response.ok) {
  //   if (response.status === 404) return undefined;
  //   throw new Error('Failed to mark receipt as uploaded');
  // }
  // return await response.json();
  
  // Temporary: Return undefined until API is implemented
  return undefined;
};

// Upload receipt file
export const uploadReceipt = async (requestId: string, file: File): Promise<boolean> => {
  // In a real implementation, this would upload the file to your API
  // For example:
  // const formData = new FormData();
  // formData.append('receipt', file);
  //
  // const response = await fetch(`${API_BASE_URL}/requests/${requestId}/receipt-upload`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // if (!response.ok) throw new Error('Failed to upload receipt');
  // return true;
  
  // Temporary: Return success until API is implemented
  return true;
};

// Search requests
export const searchRequests = async (query: string): Promise<DocumentRequest[]> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/search?q=${encodeURIComponent(query)}`);
  // if (!response.ok) throw new Error('Failed to search requests');
  // return await response.json();
  
  // Temporary: Return empty array until API is implemented
  return [];
};

// Get statistics for dashboard
export const getRequestStatistics = async (): Promise<{
  total: number;
  pending: number;
  processing: number;
  approved: number;
  completed: number;
  rejected: number;
}> => {
  // In a real implementation, this would call your API
  // For example:
  // const response = await fetch(`${API_BASE_URL}/requests/statistics`);
  // if (!response.ok) throw new Error('Failed to fetch statistics');
  // return await response.json();
  
  // Temporary: Return placeholder statistics until API is implemented
  return {
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  };
};
