import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for Service Worker notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'NOTIFICATION') {
          addNotification(event.data.notification);
        }
      });
    }

    // Listen for push notifications
    if ('Notification' in window) {
      // Mock some notifications for demo
      setTimeout(() => {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'Background sync active',
          message: 'Your city data is being updated in real-time.',
          timestamp: new Date()
        });
      }, 5000);
    }
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now(),
      timestamp: notification.timestamp || new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10
    
    // Auto-remove after 5 seconds for non-important notifications
    if (notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'error':
        return <AlertTriangle size={16} className="text-red-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      >
        <Bell size={20} className="text-gray-300 hover:text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};