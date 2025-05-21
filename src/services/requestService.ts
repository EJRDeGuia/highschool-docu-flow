
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

// Mock data for document requests
const mockRequests: DocumentRequest[] = [
  {
    id: 'REQ-2023-001',
    userId: '1', // Student user
    documentType: 'transcript',
    documentTypeName: 'Transcript of Records',
    purpose: 'College Application',
    additionalDetails: 'Needed for scholarship application',
    copies: 2,
    status: 'Processing',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:20:00Z',
    fee: 200,
    hasPaid: true,
    hasUploadedReceipt: true,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'completed',
        date: '2023-05-15 10:30 AM',
        note: 'Document request submitted successfully.'
      },
      {
        id: '2',
        step: 'Payment Completed',
        status: 'completed',
        date: '2023-05-15 11:45 AM',
        note: 'Payment receipt uploaded and verified.'
      },
      {
        id: '3',
        step: 'Processing Request',
        status: 'current',
        date: '2023-05-16 14:20 PM',
        note: 'Your request is being processed by the registrar.'
      },
      {
        id: '4',
        step: 'Document Ready',
        status: 'pending'
      },
      {
        id: '5',
        step: 'Completed',
        status: 'pending'
      }
    ]
  },
  {
    id: 'REQ-2023-002',
    userId: '1', // Student user
    documentType: 'certificate',
    documentTypeName: 'Certificate of Enrollment',
    purpose: 'Employment',
    copies: 1,
    status: 'Completed',
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-04-22T16:30:00Z',
    fee: 50,
    hasPaid: true,
    hasUploadedReceipt: true,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'completed',
        date: '2023-04-20 09:15 AM'
      },
      {
        id: '2',
        step: 'Payment Completed',
        status: 'completed',
        date: '2023-04-20 10:20 AM'
      },
      {
        id: '3',
        step: 'Processing Request',
        status: 'completed',
        date: '2023-04-21 11:30 AM'
      },
      {
        id: '4',
        step: 'Document Ready',
        status: 'completed',
        date: '2023-04-22 14:45 PM'
      },
      {
        id: '5',
        step: 'Completed',
        status: 'completed',
        date: '2023-04-22 16:30 PM',
        note: 'Document has been released and marked as completed.'
      }
    ]
  },
  {
    id: 'REQ-2023-003',
    userId: '1', // Student user
    documentType: 'goodMoral',
    documentTypeName: 'Certificate of Good Moral Character',
    purpose: 'Scholarship Application',
    copies: 3,
    status: 'Pending',
    createdAt: '2023-05-18T08:45:00Z',
    updatedAt: '2023-05-18T08:45:00Z',
    fee: 150,
    hasPaid: false,
    hasUploadedReceipt: false,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'completed',
        date: '2023-05-18 08:45 AM'
      },
      {
        id: '2',
        step: 'Payment Completed',
        status: 'pending'
      },
      {
        id: '3',
        step: 'Processing Request',
        status: 'pending'
      },
      {
        id: '4',
        step: 'Document Ready',
        status: 'pending'
      },
      {
        id: '5',
        step: 'Completed',
        status: 'pending'
      }
    ]
  },
  {
    id: 'REQ-2023-004',
    userId: '2', // Registrar user for testing
    documentType: 'diploma',
    documentTypeName: 'Diploma',
    purpose: 'Personal Records',
    copies: 1,
    status: 'Approved',
    createdAt: '2023-05-10T13:20:00Z',
    updatedAt: '2023-05-17T09:30:00Z',
    fee: 200,
    hasPaid: true,
    hasUploadedReceipt: true,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'completed',
        date: '2023-05-10 13:20 PM'
      },
      {
        id: '2',
        step: 'Payment Completed',
        status: 'completed',
        date: '2023-05-10 14:30 PM'
      },
      {
        id: '3',
        step: 'Processing Request',
        status: 'completed',
        date: '2023-05-15 10:15 AM'
      },
      {
        id: '4',
        step: 'Document Ready',
        status: 'completed',
        date: '2023-05-17 09:30 AM',
        note: 'Your document is ready for pickup at the registrar\'s office.'
      },
      {
        id: '5',
        step: 'Completed',
        status: 'pending'
      }
    ]
  }
];

// Service functions

// Get all requests (for admin/registrar)
export const getAllRequests = async (): Promise<DocumentRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockRequests];
};

// Get requests for a specific user
export const getUserRequests = async (userId: string): Promise<DocumentRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRequests.filter(request => request.userId === userId);
};

// Get a specific request by ID
export const getRequestById = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRequests.find(request => request.id === requestId);
};

// Update request status
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<DocumentRequest | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = mockRequests.findIndex(request => request.id === requestId);
  
  if (requestIndex === -1) {
    return undefined;
  }
  
  // Clone the request
  const updatedRequest = { ...mockRequests[requestIndex] };
  
  // Update status
  updatedRequest.status = status;
  updatedRequest.updatedAt = new Date().toISOString();
  
  // Update timeline based on status
  let timelineStep = '';
  let timelineIndex = -1;
  
  switch (status) {
    case 'Processing':
      timelineStep = 'Processing Request';
      timelineIndex = 2;
      break;
    case 'Approved':
      timelineStep = 'Document Ready';
      timelineIndex = 3;
      break;
    case 'Completed':
      timelineStep = 'Completed';
      timelineIndex = 4;
      break;
    case 'Rejected':
      timelineStep = 'Request Rejected';
      if (!updatedRequest.timeline.find(t => t.step === 'Request Rejected')) {
        updatedRequest.timeline.push({
          id: `${updatedRequest.timeline.length + 1}`,
          step: 'Request Rejected',
          status: 'current',
          date: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          note: note || 'Your request has been rejected.'
        });
      }
      break;
    default:
      break;
  }
  
  if (timelineIndex >= 0) {
    updatedRequest.timeline = updatedRequest.timeline.map((item, index) => {
      if (index < timelineIndex) {
        return { ...item, status: 'completed' as const };
      } else if (index === timelineIndex) {
        return {
          ...item,
          status: 'current' as const,
          date: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          note: note || undefined
        };
      } else {
        return { ...item, status: 'pending' as const };
      }
    });
  }
  
  // Update the request in the mock database
  mockRequests[requestIndex] = updatedRequest;
  
  return updatedRequest;
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRequest: DocumentRequest = {
    id: `REQ-${new Date().getFullYear()}-${String(mockRequests.length + 1).padStart(3, '0')}`,
    userId,
    documentType,
    documentTypeName,
    purpose,
    additionalDetails,
    copies,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fee: fee || 50 * copies, // Default fee
    hasPaid: false,
    hasUploadedReceipt: false,
    timeline: [
      {
        id: '1',
        step: 'Request Submitted',
        status: 'completed',
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        note: 'Document request submitted successfully.'
      },
      {
        id: '2',
        step: 'Payment Completed',
        status: 'pending'
      },
      {
        id: '3',
        step: 'Processing Request',
        status: 'pending'
      },
      {
        id: '4',
        step: 'Document Ready',
        status: 'pending'
      },
      {
        id: '5',
        step: 'Completed',
        status: 'pending'
      }
    ]
  };
  
  mockRequests.push(newRequest);
  return newRequest;
};

// Mark request as paid
export const markRequestAsPaid = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = mockRequests.findIndex(request => request.id === requestId);
  
  if (requestIndex === -1) {
    return undefined;
  }
  
  // Clone the request
  const updatedRequest = { ...mockRequests[requestIndex] };
  
  // Update paid status
  updatedRequest.hasPaid = true;
  updatedRequest.updatedAt = new Date().toISOString();
  
  // Update timeline
  const paymentTimelineIndex = updatedRequest.timeline.findIndex(item => item.step === 'Payment Completed');
  
  if (paymentTimelineIndex !== -1) {
    updatedRequest.timeline[paymentTimelineIndex] = {
      ...updatedRequest.timeline[paymentTimelineIndex],
      status: 'completed',
      date: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      note: 'Payment verified successfully.'
    };
  }
  
  // Update the request in the mock database
  mockRequests[requestIndex] = updatedRequest;
  
  return updatedRequest;
};

// Mark receipt as uploaded
export const markReceiptUploaded = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requestIndex = mockRequests.findIndex(request => request.id === requestId);
  
  if (requestIndex === -1) {
    return undefined;
  }
  
  // Clone the request
  const updatedRequest = { ...mockRequests[requestIndex] };
  
  // Update receipt status
  updatedRequest.hasUploadedReceipt = true;
  updatedRequest.updatedAt = new Date().toISOString();
  
  // Update the request in the mock database
  mockRequests[requestIndex] = updatedRequest;
  
  return updatedRequest;
};

// Search requests
export const searchRequests = async (query: string): Promise<DocumentRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Convert query to lowercase for case-insensitive search
  const lowerQuery = query.toLowerCase();
  
  // Search in various fields
  return mockRequests.filter(request => 
    request.id.toLowerCase().includes(lowerQuery) ||
    request.documentTypeName.toLowerCase().includes(lowerQuery) ||
    request.purpose.toLowerCase().includes(lowerQuery) ||
    (request.additionalDetails && request.additionalDetails.toLowerCase().includes(lowerQuery)) ||
    request.status.toLowerCase().includes(lowerQuery)
  );
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'Pending').length,
    processing: mockRequests.filter(r => r.status === 'Processing').length,
    approved: mockRequests.filter(r => r.status === 'Approved').length,
    completed: mockRequests.filter(r => r.status === 'Completed').length,
    rejected: mockRequests.filter(r => r.status === 'Rejected').length,
  };
};
