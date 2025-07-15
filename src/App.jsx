import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardSection } from './components/sections/DashboardSection';
import { MapSection } from './components/sections/MapSection';
import { BackgroundSync } from './components/common/BackgroundSync';
import { useGeolocation } from './hooks/useGeolocation';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';
import { createCityData } from './services/mockData';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { location, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation();
  const { scheduleNotification, isSupported: bgSupported } = useBackgroundTasks();

  // Create dynamic city data based on location
  const cityData = createCityData(location);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Demo notification on mount
  useEffect(() => {
    if (bgSupported) {
      setTimeout(() => {
        scheduleNotification({
          title: '🌆 Welcome to Smart City Dashboard',
          body: 'Background sync is now active. You\'ll receive real-time city updates.',
          tag: 'welcome-notification',
          data: { type: 'welcome' }
        });
      }, 3000);
    }
  }, [bgSupported, scheduleNotification]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'map':
        return <MapSection location={location} />;
      case 'traffic':
        return <div className="text-white">Traffic section coming soon...</div>;
      case 'weather':
        return <div className="text-white">Weather section coming soon...</div>;
      case 'transport':
        return <div className="text-white">Transport section coming soon...</div>;
      case 'alerts':
        return <div className="text-white">Alerts section coming soon...</div>;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header 
        cityData={cityData}
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        location={location}
        locationError={locationError}
        locationLoading={locationLoading}
        refreshLocation={refreshLocation}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-gray-400">
              Here's what's happening in your area today
              {location && (
                <span className="ml-2 text-blue-400">
                  📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </span>
              )}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search city data..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Background Sync Status - Only show on dashboard */}
          {activeSection === 'dashboard' && (
            <div className="mb-8">
              <BackgroundSync />
            </div>
          )}

          {/* Dynamic Content Based on Active Section */}
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;