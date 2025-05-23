
import { User } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

// Get all requests (for admin/registrar)
export const getAllRequests = async (): Promise<DocumentRequest[]> => {
  const { data: requestsData, error: requestsError } = await supabase
    .from('document_requests')
    .select(`
      id,
      user_id,
      document_type_id,
      purpose,
      additional_details,
      copies,
      status,
      created_at,
      updated_at,
      fee,
      has_paid,
      has_uploaded_receipt
    `)
    .order('created_at', { ascending: false });

  if (requestsError) {
    console.error('Error fetching requests:', requestsError);
    return [];
  }

  // Fetch document types for each request
  const { data: documentTypes, error: documentTypesError } = await supabase
    .from('document_types')
    .select('*');

  if (documentTypesError) {
    console.error('Error fetching document types:', documentTypesError);
    return [];
  }

  // Create a map of document type IDs to document type objects
  const documentTypeMap = (documentTypes || []).reduce((acc, docType) => {
    acc[docType.id] = docType;
    return acc;
  }, {} as Record<string, any>);

  // Fetch timeline items for all requests
  const { data: timelineItems, error: timelineError } = await supabase
    .from('request_timeline')
    .select('*')
    .order('date', { ascending: true });

  if (timelineError) {
    console.error('Error fetching timeline items:', timelineError);
    return [];
  }

  // Create a map of request IDs to timeline items
  const timelineMap = (timelineItems || []).reduce((acc, item) => {
    if (!acc[item.request_id]) {
      acc[item.request_id] = [];
    }
    acc[item.request_id].push({
      id: item.id,
      step: item.step,
      status: item.status,
      date: item.date,
      note: item.note
    });
    return acc;
  }, {} as Record<string, RequestTimelineItem[]>);

  // Transform database results to DocumentRequest objects
  return (requestsData || []).map(req => {
    const docType = documentTypeMap[req.document_type_id] || {};
    
    return {
      id: req.id,
      userId: req.user_id,
      documentType: req.document_type_id,
      documentTypeName: docType.name || 'Unknown Document Type',
      purpose: req.purpose,
      additionalDetails: req.additional_details,
      copies: req.copies,
      status: req.status as RequestStatus,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      fee: req.fee,
      hasPaid: req.has_paid,
      hasUploadedReceipt: req.has_uploaded_receipt,
      timeline: timelineMap[req.id] || []
    };
  });
};

// Get requests for a specific user
export const getUserRequests = async (userId: string): Promise<DocumentRequest[]> => {
  const { data: requestsData, error: requestsError } = await supabase
    .from('document_requests')
    .select(`
      id,
      user_id,
      document_type_id,
      purpose,
      additional_details,
      copies,
      status,
      created_at,
      updated_at,
      fee,
      has_paid,
      has_uploaded_receipt
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (requestsError) {
    console.error('Error fetching user requests:', requestsError);
    return [];
  }

  // Fetch document types for each request
  const { data: documentTypes, error: documentTypesError } = await supabase
    .from('document_types')
    .select('*');

  if (documentTypesError) {
    console.error('Error fetching document types:', documentTypesError);
    return [];
  }

  // Create a map of document type IDs to document type objects
  const documentTypeMap = (documentTypes || []).reduce((acc, docType) => {
    acc[docType.id] = docType;
    return acc;
  }, {} as Record<string, any>);

  // Fetch timeline items for these requests
  const requestIds = (requestsData || []).map(req => req.id);
  const { data: timelineItems, error: timelineError } = await supabase
    .from('request_timeline')
    .select('*')
    .in('request_id', requestIds)
    .order('date', { ascending: true });

  if (timelineError && requestIds.length > 0) {
    console.error('Error fetching timeline items:', timelineError);
  }

  // Create a map of request IDs to timeline items
  const timelineMap = (timelineItems || []).reduce((acc, item) => {
    if (!acc[item.request_id]) {
      acc[item.request_id] = [];
    }
    acc[item.request_id].push({
      id: item.id,
      step: item.step,
      status: item.status,
      date: item.date,
      note: item.note
    });
    return acc;
  }, {} as Record<string, RequestTimelineItem[]>);

  // Transform database results to DocumentRequest objects
  return (requestsData || []).map(req => {
    const docType = documentTypeMap[req.document_type_id] || {};
    
    return {
      id: req.id,
      userId: req.user_id,
      documentType: req.document_type_id,
      documentTypeName: docType.name || 'Unknown Document Type',
      purpose: req.purpose,
      additionalDetails: req.additional_details,
      copies: req.copies,
      status: req.status as RequestStatus,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      fee: req.fee,
      hasPaid: req.has_paid,
      hasUploadedReceipt: req.has_uploaded_receipt,
      timeline: timelineMap[req.id] || []
    };
  });
};

// Get a specific request by ID
export const getRequestById = async (requestId: string): Promise<DocumentRequest | undefined> => {
  const { data: request, error: requestError } = await supabase
    .from('document_requests')
    .select(`
      id,
      user_id,
      document_type_id,
      purpose,
      additional_details,
      copies,
      status,
      created_at,
      updated_at,
      fee,
      has_paid,
      has_uploaded_receipt
    `)
    .eq('id', requestId)
    .single();

  if (requestError) {
    console.error('Error fetching request:', requestError);
    return undefined;
  }

  // Fetch document type
  const { data: docType, error: docTypeError } = await supabase
    .from('document_types')
    .select('*')
    .eq('id', request.document_type_id)
    .single();

  if (docTypeError) {
    console.error('Error fetching document type:', docTypeError);
  }

  // Fetch timeline items
  const { data: timeline, error: timelineError } = await supabase
    .from('request_timeline')
    .select('*')
    .eq('request_id', requestId)
    .order('date', { ascending: true });

  if (timelineError) {
    console.error('Error fetching timeline items:', timelineError);
  }

  // Transform to DocumentRequest
  return {
    id: request.id,
    userId: request.user_id,
    documentType: request.document_type_id,
    documentTypeName: docType?.name || 'Unknown Document Type',
    purpose: request.purpose,
    additionalDetails: request.additional_details,
    copies: request.copies,
    status: request.status as RequestStatus,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
    fee: request.fee,
    hasPaid: request.has_paid,
    hasUploadedReceipt: request.has_uploaded_receipt,
    timeline: (timeline || []).map(item => ({
      id: item.id,
      step: item.step,
      status: item.status,
      date: item.date,
      note: item.note
    }))
  };
};

// Update request status
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<DocumentRequest | undefined> => {
  // Update request status
  const { data: updatedRequest, error: updateError } = await supabase
    .from('document_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating request status:', updateError);
    return undefined;
  }

  // Add timeline item
  const { error: timelineError } = await supabase
    .from('request_timeline')
    .insert({
      request_id: requestId,
      step: `Status changed to ${status}`,
      status: 'completed',
      note: note
    });

  if (timelineError) {
    console.error('Error adding timeline item:', timelineError);
  }

  // Fetch the updated request with timeline
  return await getRequestById(requestId);
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
  // Calculate fee if not provided
  let calculatedFee = fee;
  if (!calculatedFee) {
    const { data: docType } = await supabase
      .from('document_types')
      .select('base_fee')
      .eq('id', documentType)
      .single();
    
    calculatedFee = (docType?.base_fee || 50) * copies;
  }

  // Insert new request
  const { data: newRequest, error: requestError } = await supabase
    .from('document_requests')
    .insert({
      user_id: userId,
      document_type_id: documentType,
      purpose,
      additional_details: additionalDetails,
      copies,
      fee: calculatedFee,
      has_paid: false,
      has_uploaded_receipt: false
    })
    .select()
    .single();

  if (requestError) {
    console.error('Error creating request:', requestError);
    throw new Error('Failed to create request');
  }

  // Add initial timeline item
  const { error: timelineError } = await supabase
    .from('request_timeline')
    .insert({
      request_id: newRequest.id,
      step: 'Request Submitted',
      status: 'completed'
    });

  if (timelineError) {
    console.error('Error adding timeline item:', timelineError);
  }

  return {
    id: newRequest.id,
    userId: newRequest.user_id,
    documentType: newRequest.document_type_id,
    documentTypeName,
    purpose: newRequest.purpose,
    additionalDetails: newRequest.additional_details,
    copies: newRequest.copies,
    status: newRequest.status as RequestStatus,
    createdAt: newRequest.created_at,
    updatedAt: newRequest.updated_at,
    fee: newRequest.fee,
    hasPaid: newRequest.has_paid,
    hasUploadedReceipt: newRequest.has_uploaded_receipt,
    timeline: [{
      id: timelineError ? '1' : 'pending',
      step: 'Request Submitted',
      status: 'current',
      date: new Date().toISOString()
    }]
  };
};

// Mark request as paid
export const markRequestAsPaid = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // Update request
  const { data: updatedRequest, error: updateError } = await supabase
    .from('document_requests')
    .update({ has_paid: true })
    .eq('id', requestId)
    .select()
    .single();

  if (updateError) {
    console.error('Error marking request as paid:', updateError);
    return undefined;
  }

  // Add timeline item
  const { error: timelineError } = await supabase
    .from('request_timeline')
    .insert({
      request_id: requestId,
      step: 'Payment Received',
      status: 'completed'
    });

  if (timelineError) {
    console.error('Error adding timeline item:', timelineError);
  }

  // Fetch the updated request with timeline
  return await getRequestById(requestId);
};

// Mark receipt as uploaded
export const markReceiptUploaded = async (requestId: string): Promise<DocumentRequest | undefined> => {
  // Update request
  const { data: updatedRequest, error: updateError } = await supabase
    .from('document_requests')
    .update({ has_uploaded_receipt: true })
    .eq('id', requestId)
    .select()
    .single();

  if (updateError) {
    console.error('Error marking receipt as uploaded:', updateError);
    return undefined;
  }

  // Add timeline item
  const { error: timelineError } = await supabase
    .from('request_timeline')
    .insert({
      request_id: requestId,
      step: 'Receipt Uploaded',
      status: 'completed'
    });

  if (timelineError) {
    console.error('Error adding timeline item:', timelineError);
  }

  // Fetch the updated request with timeline
  return await getRequestById(requestId);
};

// Upload receipt file
export const uploadReceipt = async (requestId: string, file: File): Promise<boolean> => {
  // Note: Actual file upload functionality would go here
  // For this demo, we're just simulating the upload success
  const success = await markReceiptUploaded(requestId);
  return success !== undefined;
};

// Search requests
export const searchRequests = async (query: string): Promise<DocumentRequest[]> => {
  // This is a simplified search that looks at purpose field only
  // In a real implementation, you might want to search multiple fields
  const { data: requestsData, error: requestsError } = await supabase
    .from('document_requests')
    .select(`
      id,
      user_id,
      document_type_id,
      purpose,
      additional_details,
      copies,
      status,
      created_at,
      updated_at,
      fee,
      has_paid,
      has_uploaded_receipt
    `)
    .ilike('purpose', `%${query}%`)
    .order('created_at', { ascending: false });

  if (requestsError) {
    console.error('Error searching requests:', requestsError);
    return [];
  }

  // Follow the same pattern as getAllRequests to get document types and timeline items
  // (simplified for brevity - full implementation would mirror getAllRequests)

  return (requestsData || []).map(req => ({
    id: req.id,
    userId: req.user_id,
    documentType: req.document_type_id,
    documentTypeName: 'Unknown Document Type', // Would fetch in full implementation
    purpose: req.purpose,
    additionalDetails: req.additional_details,
    copies: req.copies,
    status: req.status as RequestStatus,
    createdAt: req.created_at,
    updatedAt: req.updated_at,
    fee: req.fee,
    hasPaid: req.has_paid,
    hasUploadedReceipt: req.has_uploaded_receipt,
    timeline: [] // Would fetch in full implementation
  }));
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
  // Get counts by status
  const { data, error } = await supabase
    .from('document_requests')
    .select('status', { count: 'exact' });

  if (error) {
    console.error('Error fetching request statistics:', error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
    };
  }

  // Count requests by status
  const stats = {
    total: data.length,
    pending: data.filter(r => r.status === 'Pending').length,
    processing: data.filter(r => r.status === 'Processing').length,
    approved: data.filter(r => r.status === 'Approved').length,
    completed: data.filter(r => r.status === 'Completed').length,
    rejected: data.filter(r => r.status === 'Rejected').length,
  };

  return stats;
};
