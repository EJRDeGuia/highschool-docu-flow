
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth, UserRole } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  targetRoles?: UserRole[]; // New field to specify which roles can see this notification
  userId?: string; // For user-specific notifications
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [roleNotifications, setRoleNotifications] = useState<Record<UserRole, Notification[]>>({
    student: [],
    registrar: [],
    admin: []
  });
  const { user } = useAuth();

  // Get notifications for the current user's role
  const notifications = user ? roleNotifications[user.role] || [] : [];

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('roleNotifications');
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        setRoleNotifications(prev => ({
          student: [],
          registrar: [],
          admin: [],
          ...prev,
          ...parsed
        }));
      } catch (error) {
        console.error('Error parsing notifications from localStorage', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('roleNotifications', JSON.stringify(roleNotifications));
  }, [roleNotifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
      read: false,
      type: notification.type || 'info',
    };

    // Determine which roles should receive this notification
    let targetRoles: UserRole[] = [];
    
    if (notification.targetRoles && notification.targetRoles.length > 0) {
      targetRoles = notification.targetRoles;
    } else if (notification.userId && user && notification.userId === user.id) {
      // User-specific notification goes to current user's role
      targetRoles = [user.role];
    } else {
      // Default to all roles if no specific targeting
      targetRoles = ['student', 'registrar', 'admin'];
    }

    // Add notification to each target role's notification list
    setRoleNotifications(prev => {
      const updated = { ...prev };
      
      targetRoles.forEach(role => {
        updated[role] = [newNotification, ...updated[role]].slice(0, 50); // Limit to 50 notifications per role
      });
      
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    if (!user) return;
    
    setRoleNotifications(prev => ({
      ...prev,
      [user.role]: prev[user.role].map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }));
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    setRoleNotifications(prev => ({
      ...prev,
      [user.role]: prev[user.role].map(notification => ({ ...notification, read: true }))
    }));
  };

  const removeNotification = (id: string) => {
    if (!user) return;
    
    setRoleNotifications(prev => ({
      ...prev,
      [user.role]: prev[user.role].filter(notification => notification.id !== id)
    }));
  };

  const clearAll = () => {
    if (!user) return;
    
    setRoleNotifications(prev => ({
      ...prev,
      [user.role]: []
    }));
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
