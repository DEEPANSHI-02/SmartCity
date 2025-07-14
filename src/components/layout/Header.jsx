import React, { useState, useEffect } from 'react';
import { Menu, X, Activity, Cloud, Wifi, Battery, Bell } from 'lucide-react';
import { LocationStatus } from '../map/LocationStatus';

export const Header = ({ cityData, onMenuToggle, isMobileMenuOpen, location, locationError, locationLoading, refreshLocation }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{cityData.cityName}</h1>
                <p className="text-gray-400 text-sm">{currentTime}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <LocationStatus 
              location={location} 
              error={locationError} 
              loading={locationLoading} 
              refreshLocation={refreshLocation}
            />
            <div className="flex items-center space-x-2 text-gray-300">
              <Cloud size={16} />
              <span className="text-sm">{cityData.temperature}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Wifi size={16} />
              <span className="text-sm">{cityData.networkStatus}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Battery size={16} />
              <span className="text-sm">{cityData.batteryLevel}%</span>
            </div>
            <div className="relative">
              <Bell size={20} className="text-gray-300 hover:text-white transition-colors cursor-pointer" />
              {cityData.activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cityData.activeAlerts}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};