import React from 'react';
import { LazyWrapper } from '../common/LazyWrapper';

export const Widget = ({ widget, index }) => {
  const Icon = widget.icon;
  
  const WidgetContent = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${widget.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {widget.value}
          </p>
          <p className="text-sm text-gray-400">{widget.trend}</p>
        </div>
      </div>
      <h3 className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
        {widget.title}
      </h3>
      
      {/* Loading shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-700/50" />
        <div className="text-right space-y-2">
          <div className="w-16 h-6 bg-gray-700/50 rounded" />
          <div className="w-12 h-4 bg-gray-700/30 rounded" />
        </div>
      </div>
      <div className="w-24 h-4 bg-gray-700/30 rounded" />
    </div>
  );

  return (
    <LazyWrapper
      fallback={<LoadingSkeleton />}
      className="relative"
      threshold={0.2}
      rootMargin="100px"
      animationDelay={index * 100}
    >
      <WidgetContent />
    </LazyWrapper>
  );
};