
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

// Predefined notification templates for common scenarios
export const NotificationTemplates = {
  requestSubmitted: (studentName: string, documentType: string) => ({
    title: 'New Request Submitted',
    message: `${studentName} has submitted a request for ${documentType}`,
    targetRoles: ['registrar', 'admin'] as UserRole[],
    type: 'info' as const,
  }),
  
  requestApproved: (documentType: string) => ({
    title: 'Request Approved',
    message: `Your request for ${documentType} has been approved`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),
  
  requestRejected: (documentType: string, reason?: string) => ({
    title: 'Request Rejected',
    message: `Your request for ${documentType} has been rejected${reason ? `: ${reason}` : ''}`,
    targetRoles: ['student'] as UserRole[],
    type: 'error' as const,
  }),
  
  paymentVerified: (documentType: string) => ({
    title: 'Payment Verified',
    message: `Payment for ${documentType} has been verified. Your document is being processed.`,
    targetRoles: ['student'] as UserRole[],
    type: 'success' as const,
  }),
  
  receiptUploaded: (studentName: string, documentType: string) => ({
    title: 'Receipt Uploaded',
    message: `${studentName} has uploaded a payment receipt for ${documentType}`,
    targetRoles: ['registrar', 'admin'] as UserRole[],
    type: 'info' as const,
  }),
};
