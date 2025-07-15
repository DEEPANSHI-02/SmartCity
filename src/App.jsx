import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchBar } from './components/common/SearchBar';
import { DashboardSection } from './components/sections/DashboardSection';
import { MapSection } from './components/sections/MapSection';
import { BackgroundSync } from './components/common/BackgroundSync';
import { useGeolocation } from './hooks/useGeolocation';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';
import { createCityData } from './services/mockData';
import { createCityDataFromSearch } from './services/cityService';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  
  const { location, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation();
  const { scheduleNotification, isSupported: bgSupported } = useBackgroundTasks();

  // Create dynamic city data based on search or location
  const cityData = selectedCity ? 
    createCityDataFromSearch(selectedCity) : 
    createCityData(location);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSearchResults([]);
    
    // Show notification for selected city
    if (bgSupported) {
      scheduleNotification({
        title: `🌍 Switched to ${city.name}`,
        body: `Now showing weather and traffic data for ${city.name}, ${city.country}`,
        tag: 'city-switch',
        data: { type: 'city-change', city: city.name }
      });
    }
  };

  const resetToUserLocation = () => {
    setSelectedCity(null);
  };

  // Demo notification on mount
  useEffect(() => {
    if (bgSupported) {
      setTimeout(() => {
        scheduleNotification({
          title: '🌆 Welcome to Smart City Dashboard',
          body: 'Search for any city worldwide to see its weather and traffic data!',
          tag: 'welcome-notification',
          data: { type: 'welcome' }
        });
      }, 3000);
    }
  }, [bgSupported, scheduleNotification]);

  const renderActiveSection = () => {
  switch (activeSection) {
    case 'dashboard':
      return <DashboardSection selectedCity={selectedCity} />;
    case 'map':
      // Fix: Handle both user location and selected city properly
      const mapLocation = selectedCity ? 
        { lat: selectedCity.coords.lat, lng: selectedCity.coords.lng } : 
        location;
      return <MapSection location={mapLocation} />;
    default:
      return <DashboardSection selectedCity={selectedCity} />;
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header 
        cityData={cityData}
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        location={selectedCity ? selectedCity.coords : location}
        locationError={locationError}
        locationLoading={locationLoading}
        refreshLocation={refreshLocation}
        selectedCity={selectedCity}
        onResetLocation={resetToUserLocation}
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
              {selectedCity ? (
                <>
                  Showing data for {selectedCity.name}, {selectedCity.country}
                  <button 
                    onClick={resetToUserLocation}
                    className="ml-2 text-blue-400 hover:text-blue-300 underline"
                  >
                    Switch back to your location
                  </button>
                </>
              ) : (
                <>
                  Here's what's happening in your area today
                  {location && (
                    <span className="ml-2 text-blue-400">
                      📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch}
              searchResults={searchResults}
              onSelectCity={handleSelectCity}
            />
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