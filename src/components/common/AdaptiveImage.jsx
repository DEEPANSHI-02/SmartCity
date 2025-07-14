import React, { useState } from 'react';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';

export const AdaptiveImage = ({ 
  src, 
  alt, 
  className = "", 
  lowQualitySrc = null,
  mediumQualitySrc = null,
  ...props 
}) => {
  const { adaptiveSettings, networkInfo } = useNetworkInfo();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (!networkInfo.isOnline) return lowQualitySrc || src;
    
    switch (adaptiveSettings.imageQuality) {
      case 'low':
        return lowQualitySrc || src;
      case 'medium':
        return mediumQualitySrc || src;
      case 'high':
      default:
        return src;
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-700/50 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image unavailable</div>
        </div>
      )}
      
      <img
        src={getImageSrc()}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      
      {/* Quality indicator */}
      {imageLoaded && (
        <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1 text-xs text-white">
          {adaptiveSettings.imageQuality}
        </div>
      )}
    </div>
  );
};