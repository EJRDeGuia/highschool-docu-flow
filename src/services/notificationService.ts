
import { UserRole } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';

export const createRoleSpecificNotification = (
  addNotification: ReturnType<typeof useNotifications>['addNotification'],
  title: string,
  message: string,
  targetRoles: UserRole[],
  type?: 'success' | 'info' | 'warning' | 'error',
  userId?: string
) => {
  addNotification({
    title,
    message,
    type: type || 'info',
    targetRoles,
    userId,
  });
};

export const createUserSpecificNotification = (
  addNotification: ReturnType<typeof useNotifications>['addNotification'],
  title: string,
  message: string,
  userId: string,
  type?: 'success' | 'info' | 'warning' | 'error'
) => {
  addNotification({
    title,
    message,
    type: type || 'info',
    userId,
  });
};

// Updated notification templates for better role-specific messaging
export const NotificationTemplates = {
  // For students when they submit a request
  requestSubmittedStudent: (documentType: string) => ({
    title: 'Request Submitted Successfully',
    message: `Your request for ${documentType} has been submitted and is pending approval.`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),

  // For staff when a student submits a request
  requestSubmittedStaff: (studentName: string, documentType: string, copies: number) => ({
    title: 'New Document Request',
    message: `${studentName} has submitted a request for ${documentType} (${copies} ${copies === 1 ? 'copy' : 'copies'}).`,
    targetRoles: ['registrar', 'admin'] as UserRole[],
    type: 'info' as const,
  }),
  
  requestApproved: (documentType: string) => ({
    title: 'Request Approved',
    message: `Your request for ${documentType} has been approved and is being processed.`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),
  
  requestRejected: (documentType: string, reason?: string) => ({
    title: 'Request Rejected',
    message: `Your request for ${documentType} has been rejected${reason ? `: ${reason}` : ''}.`,
    targetRoles: ['student'] as UserRole[],
    type: 'error' as const,
  }),

  requestCancelled: (studentName: string, documentType: string) => ({
    title: 'Request Cancelled',
    message: `${studentName} has cancelled their request for ${documentType}.`,
    targetRoles: ['registrar', 'admin'] as UserRole[],
    type: 'warning' as const,
  }),
  
  paymentVerified: (documentType: string) => ({
    title: 'Payment Verified',
    message: `Payment for ${documentType} has been verified. Your document is being processed.`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),
  
  receiptUploaded: (studentName: string, documentType: string) => ({
    title: 'Payment Receipt Uploaded',
    message: `${studentName} has uploaded a payment receipt for ${documentType}.`,
    targetRoles: ['registrar', 'admin'] as UserRole[],
    type: 'info' as const,
  }),

  documentReady: (documentType: string) => ({
    title: 'Document Ready for Pickup',
    message: `Your ${documentType} is ready for pickup at the registrar's office.`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),
};
