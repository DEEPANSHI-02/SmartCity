import React from 'react';

export const Widget = ({ widget, index }) => {
  const Icon = widget.icon;
  
  return (
    <div 
      className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${widget.color} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{widget.value}</p>
          <p className="text-sm text-gray-400">{widget.trend}</p>
        </div>
      </div>
      <h3 className="text-gray-300 font-medium">{widget.title}</h3>
    </div>
  );
};