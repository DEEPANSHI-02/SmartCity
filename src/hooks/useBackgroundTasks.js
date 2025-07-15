import { useState, useEffect, useRef } from 'react';

export const useBackgroundTasks = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [backgroundData, setBackgroundData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [notifications, setNotifications] = useState([]);
  
  const swRegistration = useRef(null);
  const messageChannel = useRef(null);

  // Initialize Service Worker and Background Sync
  useEffect(() => {
    initializeServiceWorker();
  }, []);

  const initializeServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service Worker not supported');
      return;
    }

    try {
      // Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      swRegistration.current = registration;
      setIsRegistered(true);
      
      console.log('✅ Service Worker registered:', registration);

      // Check for Background Sync support
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        setIsSupported(true);
        console.log('✅ Background Sync supported');
        
        // Register periodic sync if supported
        if ('periodicSync' in window.ServiceWorkerRegistration.prototype) {
          try {
            await registration.periodicSync.register('city-data-update', {
              minInterval: 60000 // 1 minute minimum
            });
            console.log('✅ Periodic Background Sync registered');
          } catch (error) {
            console.log('⚠️ Periodic sync registration failed:', error);
          }
        }
      }

      // Set up message communication
      setupMessageChannel();
      
      // Listen for messages from Service Worker
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      // Request initial background data
      requestBackgroundData();
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  const setupMessageChannel = () => {
    messageChannel.current = new MessageChannel();
    
    messageChannel.current.port1.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'BACKGROUND_DATA':
          setBackgroundData(data);
          break;
        case 'SYNC_STATUS':
          setSyncStatus(data.status);
          break;
      }
    };
  };

  const handleServiceWorkerMessage = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'DATA_UPDATED':
        setBackgroundData(data);
        setSyncStatus('success');
        console.log('📊 Background data updated:', data);
        break;
        
      case 'PERIODIC_UPDATE':
        setBackgroundData(prevData => ({ ...prevData, ...data }));
        console.log('⏰ Periodic update received:', data);
        break;
        
      case 'SYNC_COMPLETE':
        setSyncStatus('success');
        break;
        
      case 'SYNC_ERROR':
        setSyncStatus('error');
        console.error('❌ Background sync error:', data);
        break;
    }
  };

  // Request background data from Service Worker
  const requestBackgroundData = () => {
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'GET_BACKGROUND_DATA'
      }, [messageChannel.current.port2]);
    }
  };

  // Trigger background sync
  const triggerSync = async (tag = 'city-data-sync') => {
    if (!isSupported || !swRegistration.current) {
      console.log('⚠️ Background sync not available');
      return false;
    }

    try {
      setSyncStatus('syncing');
      await swRegistration.current.sync.register(tag);
      console.log(`🔄 Background sync registered: ${tag}`);
      return true;
    } catch (error) {
      console.error('❌ Background sync registration failed:', error);
      setSyncStatus('error');
      return false;
    }
  };

  // Update background data
  const updateBackgroundData = (data) => {
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'UPDATE_BACKGROUND_DATA',
        data
      });
    }
  };

  // Send notification to Service Worker
  const scheduleNotification = (notification) => {
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'REGISTER_NOTIFICATION',
        data: {
          title: notification.title,
          body: notification.body,
          tag: notification.tag || `notification-${Date.now()}`,
          data: notification.data || {}
        }
      });
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    console.log('🔔 Notification permission:', permission);
    return permission === 'granted';
  };

  // Manual sync trigger
  const syncNow = () => {
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'SYNC_NOW'
      });
    }
  };

  // Auto-sync setup
  const setupAutoSync = (interval = 300000) => { // 5 minutes default
    return setInterval(() => {
      triggerSync('city-data-sync');
    }, interval);
  };

  return {
    isSupported,
    isRegistered,
    backgroundData,
    syncStatus,
    notifications,
    triggerSync,
    updateBackgroundData,
    scheduleNotification,
    requestNotificationPermission,
    syncNow,
    setupAutoSync,
    swRegistration: swRegistration.current
  };
};