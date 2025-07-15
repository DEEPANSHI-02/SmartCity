import React, { useEffect, useState } from 'react';
import { RefreshCw, Wifi, WifiOff, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { useBackgroundTasks } from '../../hooks/useBackgroundTasks';

export const BackgroundSync = () => {
  const {
    isSupported,
    isRegistered,
    backgroundData,
    syncStatus,
    triggerSync,
    syncNow,
    requestNotificationPermission,
    setupAutoSync
  } = useBackgroundTasks();

  const [autoSyncInterval, setAutoSyncInterval] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Setup auto-sync
    if (isSupported && isRegistered) {
      const interval = setupAutoSync(300000); // 5 minutes
      setAutoSyncInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isSupported, isRegistered]);

  useEffect(() => {
    if (syncStatus === 'success') {
      setLastSyncTime(new Date());
    }
  }, [syncStatus]);

  const handleManualSync = () => {
    syncNow();
  };

  const handleNotificationRequest = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="animate-spin text-blue-400" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={16} />;
      default:
        return <RefreshCw className="text-gray-400" size={16} />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Up to date';
      case 'error':
        return 'Sync failed';
      default:
        return 'Ready';
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center space-x-2 text-gray-400">
          <WifiOff size={16} />
          <span className="text-sm">Background sync not supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center space-x-2">
          <Wifi size={18} />
          <span>Background Sync</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          {getSyncStatusIcon()}
          <span className="text-sm text-gray-300">{getSyncStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Sync Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Status:</span>
          <span className={`font-medium ${
            isRegistered ? 'text-green-400' : 'text-red-400'
          }`}>
            {isRegistered ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Last Sync */}
        {lastSyncTime && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Last sync:</span>
            <span className="text-gray-300">
              {lastSyncTime.toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Background Data Info */}
        {backgroundData && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Data age:</span>
            <span className="text-gray-300">
              {backgroundData.lastUpdate ? 
                Math.round((Date.now() - new Date(backgroundData.lastUpdate)) / 1000 / 60) + 'm' :
                'Unknown'
              }
            </span>
          </div>
        )}

        {/* Manual Sync Button */}
        <button
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className="w-full bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-gray-700/20 disabled:cursor-not-allowed border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-blue-400 disabled:text-gray-500 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
          <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
        </button>

        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={handleNotificationRequest}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-yellow-400 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Bell size={14} />
            <span>Enable Notifications</span>
          </button>
        )}
      </div>

      {/* Live Data Preview */}
      {backgroundData && (
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <h4 className="text-xs text-gray-400 mb-2">Live Data:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {backgroundData.weatherData && (
              <div className="bg-gray-700/30 rounded p-2">
                <div className="text-gray-400">Weather</div>
                <div className="text-white font-medium">
                  {backgroundData.weatherData.temperature}°C
                </div>
              </div>
            )}
            {backgroundData.trafficData && (
              <div className="bg-gray-700/30 rounded p-2">
                <div className="text-gray-400">Traffic</div>
                <div className="text-white font-medium">
                  {backgroundData.trafficData.congestionLevel}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};