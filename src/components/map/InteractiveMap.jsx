import React, { useRef, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';

export const InteractiveMap = ({ location }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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

    // Draw base map
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#374151');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    
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

    // Draw user location
    if (location) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Pulse animation
      const pulseRadius = 15 + Math.sin(Date.now() / 300) * 5;
      
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

      // Coordinates
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`, 
                   centerX, centerY + 35);
    }

    // Compass
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', canvas.width - 30, 30);
    
    // Scale
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 40);
    ctx.lineTo(70, canvas.height - 40);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('1km', 20, canvas.height - 25);

  }, [location]);

  useEffect(() => {
    drawMap();
    const interval = setInterval(drawMap, 100);
    return () => clearInterval(interval);
  }, [drawMap]);

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-400" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Live City Map</h3>
            <p className="text-gray-400 text-sm">
              {location ? 
                `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 
                'Waiting for location...'
              }
            </p>
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
      </div>

      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            {location?.accuracy && (
              <div className="text-sm text-gray-400">
                Accuracy: ±{Math.round(location.accuracy)}m
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-400">
            Real-time tracking active
          </div>
        </div>
      </div>
    </div>
  );
};