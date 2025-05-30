
import { supabase } from "@/integrations/supabase/client";
import { DocumentRequest, RequestStatus } from "./requestTypes";
import { 
  fetchDocumentTypes, 
  fetchTimelineItems, 
  transformToDocumentRequest,
  addTimelineItem 
} from "./requestHelpers";

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

  const documentTypes = await fetchDocumentTypes();
  const documentTypeMap = documentTypes.reduce((acc, docType) => {
    acc[docType.id] = docType;
    return acc;
  }, {} as Record<string, any>);

  const requestIds = (requestsData || []).map(req => req.id);
  const timelineMap = await fetchTimelineItems(requestIds);

  return (requestsData || []).map(req => {
    const docType = documentTypeMap[req.document_type_id] || {};
    return transformToDocumentRequest(
      req,
      docType.name || 'Unknown Document Type',
      timelineMap[req.id] || []
    );
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

  const documentTypes = await fetchDocumentTypes();
  const documentTypeMap = documentTypes.reduce((acc, docType) => {
    acc[docType.id] = docType;
    return acc;
  }, {} as Record<string, any>);

  const requestIds = (requestsData || []).map(req => req.id);
  const timelineMap = await fetchTimelineItems(requestIds);

  return (requestsData || []).map(req => {
    const docType = documentTypeMap[req.document_type_id] || {};
    return transformToDocumentRequest(
      req,
      docType.name || 'Unknown Document Type',
      timelineMap[req.id] || []
    );
  });
};

// Get a specific request by ID
export const getRequestById = async (requestId: string): Promise<DocumentRequest | undefined> => {
  if (!requestId) {
    console.error('Invalid request ID provided:', requestId);
    return undefined;
  }

  try {
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
      .maybeSingle();

    if (requestError || !request) {
      console.error('Error fetching request:', requestError);
      return undefined;
    }

    const documentTypes = await fetchDocumentTypes();
    const docType = documentTypes.find(dt => dt.id === request.document_type_id);

    const timelineMap = await fetchTimelineItems([requestId]);

    return transformToDocumentRequest(
      request,
      docType?.name || 'Unknown Document Type',
      timelineMap[requestId] || []
    );
  } catch (error) {
    console.error('Unexpected error fetching request:', error);
    return undefined;
  }
};

// Update request status
export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<DocumentRequest | undefined> => {
  const { error: updateError } = await supabase
    .from('document_requests')
    .update({ status })
    .eq('id', requestId);

  if (updateError) {
    console.error('Error updating request status:', updateError);
    return undefined;
  }

  await addTimelineItem(requestId, `Status changed to ${status}`, 'completed', note);
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
  let calculatedFee = fee;
  if (!calculatedFee) {
    const { data: docType } = await supabase
      .from('document_types')
      .select('base_fee')
      .eq('id', documentType)
      .single();
    
    calculatedFee = (docType?.base_fee || 50) * copies;
  }

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

  await addTimelineItem(newRequest.id, 'Request Submitted', 'completed');

  return transformToDocumentRequest(
    newRequest,
    documentTypeName,
    [{
      id: 'initial',
      step: 'Request Submitted',
      status: 'current',
      date: new Date().toISOString()
    }]
  );
};

// Mark request as paid
export const markRequestAsPaid = async (requestId: string): Promise<DocumentRequest | undefined> => {
  const { error: updateError } = await supabase
    .from('document_requests')
    .update({ has_paid: true })
    .eq('id', requestId);

  if (updateError) {
    console.error('Error marking request as paid:', updateError);
    return undefined;
  }

  await addTimelineItem(requestId, 'Payment Received', 'completed');
  return await getRequestById(requestId);
};

// Mark receipt as uploaded
export const markReceiptUploaded = async (requestId: string): Promise<DocumentRequest | undefined> => {
  const { error: updateError } = await supabase
    .from('document_requests')
    .update({ has_uploaded_receipt: true })
    .eq('id', requestId);

  if (updateError) {
    console.error('Error marking receipt as uploaded:', updateError);
    return undefined;
  }

  await addTimelineItem(requestId, 'Receipt Uploaded', 'completed');
  return await getRequestById(requestId);
};

// Cancel request
export const cancelRequest = async (requestId: string): Promise<DocumentRequest | undefined> => {
  const request = await getRequestById(requestId);
  if (!request) {
    throw new Error("Request not found");
  }
  
  if (request.hasUploadedReceipt || request.hasPaid) {
    throw new Error("Cannot cancel request after receipt has been uploaded or payment has been made");
  }
  
  if (request.status !== 'Pending') {
    throw new Error("Can only cancel requests that are pending");
  }

  const { error: updateError } = await supabase
    .from('document_requests')
    .update({ status: 'Cancelled' })
    .eq('id', requestId);

  if (updateError) {
    console.error('Error cancelling request:', updateError);
    throw new Error('Failed to cancel request');
  }

  await addTimelineItem(requestId, 'Request Cancelled', 'completed', 'Request cancelled by student');
  return await getRequestById(requestId);
};

// Export types for backward compatibility
export type { DocumentRequest, RequestStatus, RequestTimelineItem } from './requestTypes';
