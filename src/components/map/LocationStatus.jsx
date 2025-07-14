import React from 'react';
import { Navigation, Target } from 'lucide-react';

export const LocationStatus = ({ location, error, loading, refreshLocation }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-yellow-400">
        <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
        <span className="text-sm">Getting location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400">
        <Target size={16} />
        <span className="text-sm">Location error</span>
        <button 
          onClick={refreshLocation}
          className="text-xs bg-red-500/20 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-400">
      <Navigation size={16} />
      <span className="text-sm">Location active</span>
      {location?.accuracy && (
        <span className="text-xs text-gray-400">
          ±{Math.round(location.accuracy)}m
        </span>
      )}
    </div>
  );
};