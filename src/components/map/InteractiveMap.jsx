import React, { useRef, useEffect, useCallback, useState } from 'react';
import { MapPin, Car, Cloud, Layers } from 'lucide-react';
import { useNetworkInfo } from '../../hooks/useNetworkInfo';

export const InteractiveMap = ({ location }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { adaptiveSettings, networkInfo } = useNetworkInfo();
  const [mapData, setMapData] = useState({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    showTraffic: true,
    showWeather: true,
    showZones: true,
    selectedZone: null,
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  // Mock city zones with interactive data
  const cityZones = [
    { 
      id: 1, 
      name: 'Downtown', 
      x: 200, 
      y: 150, 
      radius: 30, 
      traffic: 'heavy', 
      weather: 'sunny', 
      color: '#ef4444',
      population: '2.1M',
      alerts: 2
    },
    { 
      id: 2, 
      name: 'Residential', 
      x: 350, 
      y: 200, 
     radius: 40, 
     traffic: 'light', 
     weather: 'cloudy', 
     color: '#22c55e',
     population: '1.8M',
     alerts: 0
   },
   { 
     id: 3, 
     name: 'Industrial', 
     x: 150, 
     y: 300, 
     radius: 35, 
     traffic: 'moderate', 
     weather: 'rainy', 
     color: '#f59e0b',
     population: '0.5M',
     alerts: 1
   },
   { 
     id: 4, 
     name: 'Commercial', 
     x: 400, 
     y: 120, 
     radius: 25, 
     traffic: 'heavy', 
     weather: 'sunny', 
     color: '#ef4444',
     population: '0.8M',
     alerts: 3
   },
   { 
     id: 5, 
     name: 'Airport', 
     x: 500, 
     y: 280, 
     radius: 20, 
     traffic: 'light', 
     weather: 'clear', 
     color: '#22c55e',
     population: '0.1M',
     alerts: 0
   },
   { 
     id: 6, 
     name: 'Tech Hub', 
     x: 300, 
     y: 250, 
     radius: 28, 
     traffic: 'moderate', 
     weather: 'partly cloudy', 
     color: '#8b5cf6',
     population: '0.9M',
     alerts: 1
   }
 ];

 const trafficRoutes = [
   { start: { x: 100, y: 100 }, end: { x: 300, y: 150 }, intensity: 'heavy', name: 'Highway 1' },
   { start: { x: 200, y: 200 }, end: { x: 450, y: 250 }, intensity: 'moderate', name: 'Main Street' },
   { start: { x: 150, y: 300 }, end: { x: 400, y: 200 }, intensity: 'light', name: 'Ring Road' },
   { start: { x: 300, y: 100 }, end: { x: 500, y: 300 }, intensity: 'heavy', name: 'Express Way' },
   { start: { x: 50, y: 250 }, end: { x: 550, y: 180 }, intensity: 'moderate', name: 'Metro Line' }
 ];

 // Handle both user location and selected city coordinates
 const mapLocation = location ? {
   latitude: location.latitude || location.lat || 0,
   longitude: location.longitude || location.lng || 0,
   accuracy: location.accuracy || 100
 } : null;

 // Zoom functions
 const zoomIn = () => {
   setMapData(prev => ({
     ...prev,
     zoom: Math.min(prev.zoom * 1.2, 3) // Max zoom 3x
   }));
 };

 const zoomOut = () => {
   setMapData(prev => ({
     ...prev,
     zoom: Math.max(prev.zoom / 1.2, 0.5) // Min zoom 0.5x
   }));
 };

 const resetView = () => {
   setMapData(prev => ({
     ...prev,
     zoom: 1,
     offsetX: 0,
     offsetY: 0
   }));
 };

 // Mouse wheel zoom
 const handleWheel = (event) => {
   event.preventDefault();
   const delta = event.deltaY > 0 ? -1 : 1;
   
   if (delta > 0) {
     zoomIn();
   } else {
     zoomOut();
   }
 };

 // Pan functionality
 const handleMouseDown = (event) => {
   const canvas = canvasRef.current;
   const rect = canvas.getBoundingClientRect();
   const x = event.clientX - rect.left;
   const y = event.clientY - rect.top;
   
   setMapData(prev => ({
     ...prev,
     isDragging: true,
     dragStart: { x, y }
   }));
 };

 const handleMouseMove = (event) => {
   if (!mapData.isDragging) return;
   
   const canvas = canvasRef.current;
   const rect = canvas.getBoundingClientRect();
   const x = event.clientX - rect.left;
   const y = event.clientY - rect.top;
   
   const deltaX = x - mapData.dragStart.x;
   const deltaY = y - mapData.dragStart.y;
   
   setMapData(prev => ({
     ...prev,
     offsetX: prev.offsetX + deltaX,
     offsetY: prev.offsetY + deltaY,
     dragStart: { x, y }
   }));
 };

 const handleMouseUp = () => {
   setMapData(prev => ({
     ...prev,
     isDragging: false
   }));
 };

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

   // Save context for transformations
   ctx.save();

   // Apply zoom and pan transformations
   ctx.translate(canvas.width / 2 + mapData.offsetX, canvas.height / 2 + mapData.offsetY);
   ctx.scale(mapData.zoom, mapData.zoom);
   ctx.translate(-canvas.width / 2, -canvas.height / 2);

   // Draw city background with gradient
   const gradient = ctx.createRadialGradient(
     canvas.width / 2, canvas.height / 2, 0,
     canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
   );
   gradient.addColorStop(0, '#1f2937');
   gradient.addColorStop(0.7, '#374151');
   gradient.addColorStop(1, '#111827');
   ctx.fillStyle = gradient;
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   // Draw grid pattern
   ctx.strokeStyle = '#4b5563';
   ctx.lineWidth = 0.5 / mapData.zoom; // Adjust line width for zoom
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

   // Draw traffic routes
   if (mapData.showTraffic) {
     trafficRoutes.forEach(route => {
       const colors = {
         heavy: '#ef4444',
         moderate: '#f59e0b',
         light: '#22c55e'
       };
       
       ctx.strokeStyle = colors[route.intensity];
       ctx.lineWidth = (route.intensity === 'heavy' ? 8 : route.intensity === 'moderate' ? 6 : 4) / mapData.zoom;
       ctx.lineCap = 'round';
       ctx.shadowColor = colors[route.intensity];
       ctx.shadowBlur = 10 / mapData.zoom;
       
       ctx.beginPath();
       ctx.moveTo(route.start.x, route.start.y);
       ctx.lineTo(route.end.x, route.end.y);
       ctx.stroke();
       
       // Reset shadow
       ctx.shadowBlur = 0;
       
       // Draw route labels (only at certain zoom levels)
       if (mapData.zoom > 0.8) {
         const midX = (route.start.x + route.end.x) / 2;
         const midY = (route.start.y + route.end.y) / 2;
         
         ctx.fillStyle = '#ffffff';
         ctx.font = `${10 / mapData.zoom}px Inter, sans-serif`;
         ctx.textAlign = 'center';
         ctx.fillText(route.name, midX, midY - 5);
       }
     });
   }

   // Draw weather overlay
   if (mapData.showWeather) {
     cityZones.forEach(zone => {
       const weatherColors = {
         sunny: 'rgba(251, 191, 36, 0.3)',
         cloudy: 'rgba(156, 163, 175, 0.3)',
         rainy: 'rgba(59, 130, 246, 0.3)',
         clear: 'rgba(34, 197, 94, 0.2)',
         'partly cloudy': 'rgba(168, 162, 158, 0.3)'
       };
       
       ctx.fillStyle = weatherColors[zone.weather] || 'rgba(100, 100, 100, 0.2)';
       ctx.beginPath();
       ctx.arc(zone.x, zone.y, zone.radius + 15, 0, 2 * Math.PI);
       ctx.fill();
     });
   }

   // Draw city zones
   if (mapData.showZones) {
     cityZones.forEach(zone => {
       const isSelected = mapData.selectedZone?.id === zone.id;
       
       // Zone glow effect
       if (isSelected) {
         ctx.shadowColor = zone.color;
         ctx.shadowBlur = 20 / mapData.zoom;
       }
       
       // Zone circle
       ctx.fillStyle = zone.color;
       ctx.globalAlpha = isSelected ? 0.9 : 0.7;
       ctx.beginPath();
       ctx.arc(zone.x, zone.y, zone.radius, 0, 2 * Math.PI);
       ctx.fill();

       // Zone border
       ctx.globalAlpha = 1;
       ctx.strokeStyle = isSelected ? '#ffffff' : '#e5e7eb';
       ctx.lineWidth = (isSelected ? 3 : 2) / mapData.zoom;
       ctx.stroke();
       
       // Reset shadow
       ctx.shadowBlur = 0;

       // Zone label (scale with zoom)
       ctx.fillStyle = '#ffffff';
       ctx.font = `${isSelected ? 14 : 12}px Inter, sans-serif`;
       ctx.textAlign = 'center';
       ctx.fillText(zone.name, zone.x, zone.y + zone.radius + 20);
       
       // Population count
       if (mapData.zoom > 0.7) {
         ctx.fillStyle = '#9ca3af';
         ctx.font = `${10}px Inter, sans-serif`;
         ctx.fillText(zone.population, zone.x, zone.y + zone.radius + 35);
       }
       
       // Alert indicators
       if (zone.alerts > 0) {
         ctx.fillStyle = '#ef4444';
         ctx.beginPath();
         ctx.arc(zone.x + zone.radius - 5, zone.y - zone.radius + 5, 8, 0, 2 * Math.PI);
         ctx.fill();
         
         ctx.fillStyle = '#ffffff';
         ctx.font = `${10}px Inter, sans-serif`;
         ctx.textAlign = 'center';
         ctx.fillText(zone.alerts.toString(), zone.x + zone.radius - 5, zone.y - zone.radius + 9);
       }
     });
   }

   // Restore context for non-transformed elements
   ctx.restore();

   // Draw user/selected location (always in center, not affected by zoom)
   if (mapLocation) {
     const centerX = canvas.width / 2;
     const centerY = canvas.height / 2;
     
     // Pulse animation
     const pulseRadius = 15 + Math.sin(Date.now() / 300) * 5;
     
     // Pulse effect
     ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
     ctx.beginPath();
     ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
     ctx.fill();
     
     // Inner pulse
     ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
     ctx.beginPath();
     ctx.arc(centerX, centerY, pulseRadius * 0.6, 0, 2 * Math.PI);
     ctx.fill();
     
     // Location dot
     ctx.fillStyle = '#3b82f6';
     ctx.beginPath();
     ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
     ctx.fill();
     
     // Location ring
     ctx.strokeStyle = '#ffffff';
     ctx.lineWidth = 3;
     ctx.stroke();
     
     // Location icon
     ctx.fillStyle = '#ffffff';
     ctx.beginPath();
     ctx.moveTo(centerX, centerY - 5);
     ctx.lineTo(centerX - 3, centerY - 2);
     ctx.lineTo(centerX + 3, centerY - 2);
     ctx.closePath();
     ctx.fill();

     // Coordinates display
     if (mapLocation.latitude && mapLocation.longitude) {
       ctx.fillStyle = '#ffffff';
       ctx.font = '12px Inter, sans-serif';
       ctx.textAlign = 'center';
       ctx.fillText(
         `${mapLocation.latitude.toFixed(4)}, ${mapLocation.longitude.toFixed(4)}`, 
         centerX, centerY + 40
       );
     }
   }

   // Draw UI elements (compass, scale, legend) - not affected by zoom
   // Compass
   ctx.fillStyle = '#ffffff';
   ctx.font = '16px Inter, sans-serif';
   ctx.textAlign = 'center';
   ctx.fillText('N', canvas.width - 30, 30);
   
   // Compass circle
   ctx.strokeStyle = '#ffffff';
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.arc(canvas.width - 30, 35, 15, 0, 2 * Math.PI);
   ctx.stroke();
   
   // North arrow
   ctx.fillStyle = '#ef4444';
   ctx.beginPath();
   ctx.moveTo(canvas.width - 30, 25);
   ctx.lineTo(canvas.width - 35, 35);
   ctx.lineTo(canvas.width - 25, 35);
   ctx.closePath();
   ctx.fill();

   // Draw scale
   ctx.strokeStyle = '#ffffff';
   ctx.lineWidth = 3;
   ctx.beginPath();
   ctx.moveTo(20, canvas.height - 40);
   ctx.lineTo(70, canvas.height - 40);
   ctx.stroke();
   
   // Scale markers
   ctx.moveTo(20, canvas.height - 45);
   ctx.lineTo(20, canvas.height - 35);
   ctx.moveTo(70, canvas.height - 45);
   ctx.lineTo(70, canvas.height - 35);
   ctx.stroke();
   
   ctx.fillStyle = '#ffffff';
   ctx.font = '12px Inter, sans-serif';
   ctx.textAlign = 'left';
   ctx.fillText('0', 15, canvas.height - 20);
   ctx.fillText(`${(1 / mapData.zoom).toFixed(1)}km`, 65, canvas.height - 20);

   // Draw mini legend
   if (mapData.showTraffic || mapData.showWeather) {
     const legendY = 60;
     ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
     ctx.fillRect(10, legendY, 120, 80);
     
     ctx.fillStyle = '#ffffff';
     ctx.font = '12px Inter, sans-serif';
     ctx.textAlign = 'left';
     ctx.fillText('Legend:', 15, legendY + 15);
     
     if (mapData.showTraffic) {
       // Traffic legend
       ctx.strokeStyle = '#ef4444';
       ctx.lineWidth = 4;
       ctx.beginPath();
       ctx.moveTo(15, legendY + 25);
       ctx.lineTo(35, legendY + 25);
       ctx.stroke();
       ctx.fillText('Heavy Traffic', 40, legendY + 28);
       
       ctx.strokeStyle = '#f59e0b';
       ctx.beginPath();
       ctx.moveTo(15, legendY + 40);
       ctx.lineTo(35, legendY + 40);
       ctx.stroke();
       ctx.fillText('Moderate', 40, legendY + 43);
       
       ctx.strokeStyle = '#22c55e';
       ctx.beginPath();
       ctx.moveTo(15, legendY + 55);
       ctx.lineTo(35, legendY + 55);
       ctx.stroke();
       ctx.fillText('Light Traffic', 40, legendY + 58);
     }
   }

   // Draw zoom level indicator
   ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
   ctx.fillRect(canvas.width - 80, canvas.height - 30, 70, 20);
   ctx.fillStyle = '#ffffff';
   ctx.font = '12px Inter, sans-serif';
   ctx.textAlign = 'center';
   ctx.fillText(`${(mapData.zoom * 100).toFixed(0)}%`, canvas.width - 45, canvas.height - 15);

 }, [mapLocation, mapData, adaptiveSettings, networkInfo]);

 // Click handler with zoom and pan transformation
 const handleCanvasClick = (event) => {
   const canvas = canvasRef.current;
   const rect = canvas.getBoundingClientRect();
   const rawX = event.clientX - rect.left;
   const rawY = event.clientY - rect.top;

   // Transform click coordinates to account for zoom and pan
   const centerX = canvas.width / 2;
   const centerY = canvas.height / 2;
   
   const x = ((rawX - centerX - mapData.offsetX) / mapData.zoom) + centerX;
   const y = ((rawY - centerY - mapData.offsetY) / mapData.zoom) + centerY;

   // Check if click is on a zone
   const clickedZone = cityZones.find(zone => {
     const distance = Math.sqrt((x - zone.x) ** 2 + (y - zone.y) ** 2);
     return distance <= zone.radius;
   });

   if (clickedZone) {
     setMapData(prev => ({ 
       ...prev, 
       selectedZone: clickedZone === prev.selectedZone ? null : clickedZone 
     }));
   } else {
     setMapData(prev => ({ ...prev, selectedZone: null }));
   }
 };

 const toggleLayer = (layer) => {
   setMapData(prev => ({
     ...prev,
     [layer]: !prev[layer]
   }));
 };

 useEffect(() => {
   drawMap();
   const interval = setInterval(drawMap, 100); // Smooth animations
   return () => clearInterval(interval);
 }, [drawMap]);

 return (
   <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
     {/* Map Header with Controls */}
     <div className="p-4 border-b border-gray-700/50">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <MapPin className="text-blue-400" size={24} />
           <div>
             <h3 className="text-xl font-bold text-white">Interactive City Map</h3>
             <p className="text-gray-400 text-sm">
               {mapLocation ? 
                 `${mapLocation.latitude.toFixed(6)}, ${mapLocation.longitude.toFixed(6)}` : 
                 'Click zones for details'
               }
             </p>
           </div>
         </div>
         
         <div className="flex items-center space-x-2">
           <button
             onClick={() => toggleLayer('showTraffic')}
             className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
               mapData.showTraffic 
                 ? 'bg-red-500 text-white' 
                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
             }`}
           >
             <Car size={16} className="inline mr-1" />
             Traffic
           </button>
           <button
             onClick={() => toggleLayer('showWeather')}
             className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
               mapData.showWeather 
                 ? 'bg-blue-500 text-white' 
                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
             }`}
           >
             <Cloud size={16} className="inline mr-1" />
             Weather
           </button>
           <button
             onClick={() => toggleLayer('showZones')}
             className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
               mapData.showZones 
                 ? 'bg-purple-500 text-white' 
                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
             }`}
           >
             <Layers size={16} className="inline mr-1" />
             Zones
           </button>
         </div>
       </div>
     </div>

     {/* Interactive Canvas */}
     <div 
       ref={containerRef}
       className="relative h-96"
       onClick={handleCanvasClick}
       onWheel={handleWheel}
       onMouseDown={handleMouseDown}
       onMouseMove={handleMouseMove}
       onMouseUp={handleMouseUp}
       onMouseLeave={handleMouseUp}
     >
       <canvas
         ref={canvasRef}
         className="absolute inset-0 w-full h-full"
         style={{ cursor: mapData.isDragging ? 'grabbing' : 'grab' }}
       />
       
       {/* Enhanced Zoom Controls */}
       <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 space-y-1">
         <button 
           className="block w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded text-white text-lg font-bold transition-colors flex items-center justify-center"
           onClick={zoomIn}
           title="Zoom In"
         >
           +
         </button>
         <button 
           className="block w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded text-white text-lg font-bold transition-colors flex items-center justify-center"
           onClick={zoomOut}
           title="Zoom Out"
         >
           -
         </button>
         <button 
           className="block w-10 h-6 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs font-medium transition-colors flex items-center justify-center"
           onClick={resetView}
           title="Reset View"
         >
           ⌂
         </button>
       </div>
       
       {/* Selected Zone Info Panel */}
       {mapData.selectedZone && (
         <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 min-w-[200px]">
           <h4 className="font-bold text-white mb-2 flex items-center">
             <div 
               className="w-3 h-3 rounded-full mr-2" 
               style={{ backgroundColor: mapData.selectedZone.color }}
             ></div>
             {mapData.selectedZone.name}
           </h4>
           <div className="space-y-2 text-sm">
             <div className="flex items-center justify-between">
               <span className="text-gray-400">Population:</span>
               <span className="text-white">{mapData.selectedZone.population}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-400">Traffic:</span>
               <span className={`font-medium ${
                 mapData.selectedZone.traffic === 'heavy' ? 'text-red-400' :
                 mapData.selectedZone.traffic === 'moderate' ? 'text-yellow-400' : 'text-green-400'
               }`}>
                 {mapData.selectedZone.traffic}
               </span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-400">Weather:</span>
               <span className="text-blue-400">{mapData.selectedZone.weather}</span>
             </div>
             {mapData.selectedZone.alerts > 0 && (
               <div className="flex items-center justify-between">
                 <span className="text-gray-400">Alerts:</span>
                 <span className="text-red-400 font-medium">{mapData.selectedZone.alerts}</span>
               </div>
             )}
           </div>
         </div>
       )}
     </div>

     {/* Map Footer */}
     <div className="p-4 border-t border-gray-700/50">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4 text-sm">
           <div className="flex items-center space-x-2 text-gray-400">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
             <span>Your Location</span>
           </div>
           <div className="flex items-center space-x-2 text-gray-400">
             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
             <span>High Traffic</span>
           </div>
           <div className="flex items-center space-x-2 text-gray-400">
             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
             <span>Low Traffic</span>
           </div>
         </div>
         
         <div className="text-sm text-gray-400">
           Click zones for details • {cityZones.length} areas mapped
         </div>
       </div>
     </div>
   </div>
 );
};