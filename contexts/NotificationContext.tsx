
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NotificationData {
  title: string;
  message: string;
  icon?: string;
}

interface NotificationContextType {
  activeNotification: NotificationData | null;
  showNotification: (data: NotificationData) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState<NotificationData | null>(null);

  const showNotification = useCallback((data: NotificationData) => {
    setActiveNotification(data);
    // Auto hide after 5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  }, []);

  const hideNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ activeNotification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
