import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    observerSupport: !!window.IntersectionObserver,
    loadTime: 0,
    intersectingElements: 0
  });

  useEffect(() => {
    // Monitor page load performance
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));

    // Log Intersection Observer support
    console.log('🔍 Intersection Observer API:', metrics.observerSupport ? 'Supported' : 'Not Supported');
    
    if (metrics.observerSupport) {
      console.log(' Lazy loading enabled');
    } else {
      console.log(' Fallback to immediate loading');
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 border border-gray-700/50">
      <div className="flex items-center space-x-2 mb-1">
        <Activity size={12} className="text-green-400" />
        <span>Performance</span>
      </div>
      <div>Load: {metrics.loadTime}ms</div>
      <div>Observer: {metrics.observerSupport ? '✅' : '❌'}</div>
    </div>
  );
};