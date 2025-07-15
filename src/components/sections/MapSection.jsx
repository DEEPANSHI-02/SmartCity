import React from 'react';
import { InteractiveMap } from '../map/InteractiveMap';
import { LazyWrapper } from '../common/LazyWrapper';

export const MapSection = ({ location }) => {
  return (
    <LazyWrapper 
      threshold={0.2}
      rootMargin="100px"
      fallback={
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 animate-pulse">
          <div className="h-96 bg-gray-700/30 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gray-600/50 rounded-full mx-auto animate-pulse" />
              <div className="w-32 h-4 bg-gray-600/50 rounded mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <InteractiveMap location={location} />
    </LazyWrapper>
  );
};