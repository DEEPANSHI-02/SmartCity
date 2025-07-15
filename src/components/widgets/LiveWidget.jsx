import React, { useEffect, useState } from 'react';
import { useBackgroundTasks } from '../../hooks/useBackgroundTasks';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export const LiveWidget = ({ title, dataKey, icon: Icon, color, unit = '' }) => {
  const { backgroundData, syncStatus } = useBackgroundTasks();
  const [currentValue, setCurrentValue] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [trend, setTrend] = useState('stable');

  useEffect(() => {
    if (backgroundData && backgroundData[dataKey]) {
      const newValue = getValueFromData(backgroundData[dataKey]);
      
      if (currentValue !== null) {
        setPreviousValue(currentValue);
        
        // Calculate trend
        if (newValue > currentValue) {
          setTrend('up');
        } else if (newValue < currentValue) {
          setTrend('down');
        } else {
          setTrend('stable');
        }
      }
      
      setCurrentValue(newValue);
    }
  }, [backgroundData, dataKey, currentValue]);

  const getValueFromData = (data) => {
    if (!data) return null;
    
    // Extract relevant value based on data type
    switch (dataKey) {
      case 'weatherData':
        return data.temperature;
      case 'trafficData':
        return data.congestionLevel;
      case 'airQuality':
        return data.aqi;
      case 'publicTransport':
        return data.onTimePercentage;
      default:
        return data.value || 0;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getTrendText = () => {
    if (previousValue === null || currentValue === null) return '';
    
    const change = Math.abs(currentValue - previousValue);
    return `${trend === 'up' ? '+' : trend === 'down' ? '-' : ''}${change.toFixed(1)}${unit}`;
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 relative overflow-hidden group">
      {/* Live indicator */}
      <div className="absolute top-3 right-3">
        <div className={`w-2 h-2 rounded-full ${
          syncStatus === 'success' ? 'bg-green-400' : 
          syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' : 
          'bg-gray-500'
        }`} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {currentValue !== null ? `${currentValue}${unit}` : '--'}
          </p>
          <div className="flex items-center space-x-1 text-sm">
            {getTrendIcon()}
            <span className="text-gray-400">{getTrendText()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <span className="text-xs text-gray-500">LIVE</span>
      </div>

      {/* Background update animation */}
      {syncStatus === 'syncing' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full animate-pulse" />
      )}
    </div>
  );
};