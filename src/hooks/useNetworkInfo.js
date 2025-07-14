import { useState, useEffect } from 'react';

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    type: 'unknown',
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
    isOnline: navigator.onLine,
    isSupported: false
  });

  const [adaptiveSettings, setAdaptiveSettings] = useState({
    refreshInterval: 5000,
    imageQuality: 'high',
    dataMode: 'full',
    animationsEnabled: true
  });

  useEffect(() => {
    // Check if Network Information API is supported
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;

    if (!connection) {
      console.log('⚠️ Network Information API not supported');
      setNetworkInfo(prev => ({ ...prev, isSupported: false }));
      return;
    }

    console.log('🌐 Network Information API supported');

    const updateNetworkInfo = () => {
      const newNetworkInfo = {
        type: connection.type || 'unknown',
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false,
        isOnline: navigator.onLine,
        isSupported: true
      };

      setNetworkInfo(newNetworkInfo);

      // Calculate adaptive settings based on network
      const settings = calculateAdaptiveSettings(newNetworkInfo);
      setAdaptiveSettings(settings);

      console.log('📶 Network updated:', {
        type: newNetworkInfo.effectiveType,
        speed: `${newNetworkInfo.downlink}Mbps`,
        latency: `${newNetworkInfo.rtt}ms`,
        saveData: newNetworkInfo.saveData
      });
    };

    // Initial update
    updateNetworkInfo();

    // Listen for network changes
    connection.addEventListener('change', updateNetworkInfo);

    // Listen for online/offline events
    const handleOnline = () => {
      setNetworkInfo(prev => ({ ...prev, isOnline: true }));
      updateNetworkInfo();
    };

    const handleOffline = () => {
      setNetworkInfo(prev => ({ ...prev, isOnline: false }));
      setAdaptiveSettings(calculateOfflineSettings());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const calculateAdaptiveSettings = (network) => {
    const { effectiveType, downlink, rtt, saveData } = network;

    // Base settings for different connection types
    const connectionSettings = {
      'slow-2g': {
        refreshInterval: 30000,
        imageQuality: 'low',
        dataMode: 'minimal',
        animationsEnabled: false
      },
      '2g': {
        refreshInterval: 20000,
        imageQuality: 'low',
        dataMode: 'reduced',
        animationsEnabled: false
      },
      '3g': {
        refreshInterval: 10000,
        imageQuality: 'medium',
        dataMode: 'reduced',
        animationsEnabled: true
      },
      '4g': {
        refreshInterval: 5000,
        imageQuality: 'high',
        dataMode: 'full',
        animationsEnabled: true
      }
    };

    let settings = connectionSettings[effectiveType] || connectionSettings['4g'];

    // Adjust based on specific metrics
    if (downlink < 1.5) {
      settings.imageQuality = 'low';
      settings.refreshInterval = Math.max(settings.refreshInterval, 15000);
    } else if (downlink > 10) {
      settings.imageQuality = 'high';
      settings.refreshInterval = Math.min(settings.refreshInterval, 3000);
    }

    if (rtt > 300) {
      settings.refreshInterval += 5000;
      settings.animationsEnabled = false;
    }

    // Respect user's data saver preference
    if (saveData) {
      settings = {
        refreshInterval: 60000,
        imageQuality: 'low',
        dataMode: 'minimal',
        animationsEnabled: false
      };
    }

    return settings;
  };

  const calculateOfflineSettings = () => ({
    refreshInterval: 0,
    imageQuality: 'cached',
    dataMode: 'offline',
    animationsEnabled: false
  });

  const getConnectionQuality = () => {
    if (!networkInfo.isOnline) return 'offline';
    if (!networkInfo.isSupported) return 'unknown';

    const { effectiveType, downlink, rtt } = networkInfo;

    if (effectiveType === 'slow-2g' || downlink < 0.5) return 'poor';
    if (effectiveType === '2g' || downlink < 1.5) return 'slow';
    if (effectiveType === '3g' || downlink < 5) return 'good';
    return 'excellent';
  };

  const getConnectionIcon = () => {
    const quality = getConnectionQuality();
    const icons = {
      offline: '📵',
      poor: '📶',
      slow: '📶📶',
      good: '📶📶📶',
      excellent: '📶📶📶📶',
      unknown: '❓'
    };
    return icons[quality];
  };

  return {
    networkInfo,
    adaptiveSettings,
    connectionQuality: getConnectionQuality(),
    connectionIcon: getConnectionIcon(),
    isSupported: networkInfo.isSupported
  };
};