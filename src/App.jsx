import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Widget } from './components/widgets/Widget';
import { InteractiveMap } from './components/map/InteractiveMap';
import { useGeolocation } from './hooks/useGeolocation';
import { mockCityData, mockWidgets } from './services/mockData';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { location, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header 
        cityData={mockCityData}
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
        />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-gray-400">
              Here's what's happening in {mockCityData.cityName} today
              {location && (
                <span className="ml-2 text-blue-400">
                  📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </span>
              )}
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search city data..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           {mockWidgets.map((widget, index) => (
             <Widget key={widget.id} widget={widget} index={index} />
           ))}
         </div>

         <InteractiveMap location={location} />
       </main>
     </div>
   </div>
 );
};

export default Dashboard;
    