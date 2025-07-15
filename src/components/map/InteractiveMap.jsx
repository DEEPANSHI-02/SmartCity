import React, { useRef, useEffect, useCallback, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';

export const InteractiveMap = ({ location }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { adaptiveSettings, networkInfo } = useNetworkInfo();
  const [mapSettings, setMapSettings] = useState({
    showDetails: true,
    renderQuality: 'high'
  });

  // Handle both user location and selected city coordinates
  const mapLocation = location ? {
    latitude: location.latitude || location.lat || 0,
    longitude: location.longitude || location.lng || 0,
    accuracy: location.accuracy || 100
  } : null;

  // Adjust map settings based on network
  useEffect(() => {
    if (adaptiveSettings) {
      const quality = adaptiveSettings.dataMode === 'minimal' ? 'low' : 
                     adaptiveSettings.dataMode === 'reduced' ? 'medium' : 'high';
      
      setMapSettings({
        showDetails: adaptiveSettings.dataMode !== 'minimal',
        renderQuality: quality
      });
    }
  }, [adaptiveSettings]);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base map with adaptive quality
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#374151');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid with quality adjustment
    const gridSize = mapSettings.renderQuality === 'low' ? 100 : 
                    mapSettings.renderQuality === 'medium' ? 75 : 50;
    
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 0.5;
    
    if (mapSettings.showDetails) {
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // Draw location marker
    if (mapLocation) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Animate pulse only if animations are enabled
      const pulseRadius = (adaptiveSettings?.animationsEnabled !== false) ? 
        15 + Math.sin(Date.now() / 300) * 5 : 15;
      
      // Pulse effect
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Location dot
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Show coordinates only in detailed mode
      if (mapSettings.showDetails && mapLocation.latitude && mapLocation.longitude) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${mapLocation.latitude.toFixed(4)}, ${mapLocation.longitude.toFixed(4)}`, 
          centerX, centerY + 35
        );
      }
    } else {
      // Show "No location" message
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No location data available', canvas.width / 2, canvas.height / 2);
    }

    // Network quality indicator
    if (mapSettings.showDetails && networkInfo) {
      ctx.fillStyle = networkInfo.isOnline ? '#22c55e' : '#ef4444';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Network: ${networkInfo.isOnline ? 'Online' : 'Offline'}`, 20, 30);
      
      if (networkInfo.isOnline) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`Quality: ${mapSettings.renderQuality}`, 20, 45);
      }
    }

  }, [mapLocation, mapSettings, adaptiveSettings, networkInfo]);

  useEffect(() => {
    drawMap();
    
    // Adaptive refresh rate based on network
    const refreshRate = (adaptiveSettings?.animationsEnabled !== false) ? 100 : 1000;
    const interval = setInterval(drawMap, refreshRate);
    
    return () => clearInterval(interval);
  }, [drawMap]);

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="text-blue-400" size={24} />
            <div>
              <h3 className="text-xl font-bold text-white">Interactive City Map</h3>
              <p className="text-gray-400 text-sm">
                {mapLocation ? 
                  `${mapLocation.latitude.toFixed(6)}, ${mapLocation.longitude.toFixed(6)}` : 
                  'No location available'
                }
              </p>
            </div>
          </div>
          
          {/* Quality indicator */}
          <div className="text-xs bg-gray-700/50 px-2 py-1 rounded text-gray-300">
            {mapSettings.renderQuality} quality
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-96 cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 space-y-2">
          <button className="block w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">
            +
          </button>
          <button className="block w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">
            -
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Location Marker</span>
            </div>
            {mapLocation?.accuracy && (
              <div className="text-sm text-gray-400">
                Accuracy: ±{Math.round(mapLocation.accuracy)}m
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-400">
            Interactive city map
          </div>
        </div>
      </div>
    </div>
  );
};