
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
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Filter notifications based on user role and user ID
  const notifications = allNotifications.filter(notification => {
    // If notification has targetRoles, check if user's role is included
    if (notification.targetRoles && notification.targetRoles.length > 0) {
      if (!user || !notification.targetRoles.includes(user.role)) {
        return false;
      }
    }
    
    // If notification has userId, check if it matches current user
    if (notification.userId && user && notification.userId !== user.id) {
      return false;
    }
    
    // If no specific targeting, show to all users
    return true;
  });

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        setAllNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error parsing notifications from localStorage', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
  }, [allNotifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: Date.now(),
      read: false,
      type: notification.type || 'info',
    };

    setAllNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Limit to 50 notifications
  };

  const markAsRead = (id: string) => {
    setAllNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setAllNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setAllNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const clearAll = () => {
    setAllNotifications([]);
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
