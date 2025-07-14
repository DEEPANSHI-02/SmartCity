import React from 'react';
import { Wifi, WifiOff, Zap, Clock, Database } from 'lucide-react';

export const NetworkStatus = ({ networkInfo, adaptiveSettings, connectionQuality }) => {
  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'slow': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    if (!networkInfo.isOnline) return <WifiOff size={16} />;
    return <Wifi size={16} />;
  };

  if (!networkInfo.isSupported) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Wifi size={16} />
        <span className="text-sm">Network API unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium capitalize">{connectionQuality}</span>
      </div>
      
      {networkInfo.isOnline && (
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Zap size={12} />
            <span>{networkInfo.downlink?.toFixed(1)}Mbps</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{networkInfo.rtt}ms</span>
          </div>
          {networkInfo.saveData && (
            <div className="flex items-center space-x-1 text-orange-400">
              <Database size={12} />
              <span>Data Saver</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};