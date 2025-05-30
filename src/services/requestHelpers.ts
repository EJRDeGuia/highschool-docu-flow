
import { supabase } from "@/integrations/supabase/client";
import { DocumentRequest, RequestTimelineItem } from "./requestTypes";

export const fetchDocumentTypes = async () => {
  const { data: documentTypes, error } = await supabase
    .from('document_types')
    .select('*');

  if (error) {
    console.error('Error fetching document types:', error);
    return [];
  }

  return documentTypes || [];
};

export const fetchTimelineItems = async (requestIds: string[]) => {
  if (requestIds.length === 0) return {};

  const { data: timelineItems, error } = await supabase
    .from('request_timeline')
    .select('*')
    .in('request_id', requestIds)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching timeline items:', error);
    return {};
  }

  return (timelineItems || []).reduce((acc, item) => {
    if (!acc[item.request_id]) {
      acc[item.request_id] = [];
    }
    acc[item.request_id].push({
      id: item.id,
      step: item.step,
      status: item.status as 'completed' | 'current' | 'pending',
      date: item.date,
      note: item.note
    });
    return acc;
  }, {} as Record<string, RequestTimelineItem[]>);
};

export const transformToDocumentRequest = (
  requestData: any,
  documentTypeName: string,
  timeline: RequestTimelineItem[]
): DocumentRequest => {
  return {
    id: requestData.id,
    userId: requestData.user_id,
    documentType: requestData.document_type_id,
    documentTypeName,
    purpose: requestData.purpose,
    additionalDetails: requestData.additional_details,
    copies: requestData.copies,
    status: requestData.status,
    createdAt: requestData.created_at,
    updatedAt: requestData.updated_at,
    fee: requestData.fee,
    hasPaid: requestData.has_paid,
    hasUploadedReceipt: requestData.has_uploaded_receipt,
    timeline
  };
};

export const addTimelineItem = async (
  requestId: string,
  step: string,
  status: 'completed' | 'current' | 'pending' = 'completed',
  note?: string
) => {
  const { error } = await supabase
    .from('request_timeline')
    .insert({
      request_id: requestId,
      step,
      status,
      note
    });

  if (error) {
    console.error('Error adding timeline item:', error);
  }
};
