import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Widget } from './components/widgets/Widget';
import { LiveWidget } from './components/widgets/LiveWidget';
import { InteractiveMap } from './components/map/InteractiveMap';
import { LazyWrapper } from './components/common/LazyWrapper';
import { BackgroundSync } from './components/common/BackgroundSync';
import { useGeolocation } from './hooks/useGeolocation';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';
import { mockCityData, mockWidgets } from './services/mockData';
import { Car, Cloud, Activity, Bus } from 'lucide-react';

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { location, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation();
  const { backgroundData, scheduleNotification, isSupported: bgSupported } = useBackgroundTasks();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  // Live widgets configuration
  const liveWidgets = [
    {
      id: 'weather-live',
      title: 'Weather',
      dataKey: 'weatherData',
      icon: Cloud,
      color: 'from-blue-500 to-cyan-500',
      unit: '°C'
    },
    {
      id: 'traffic-live',
      title: 'Traffic Level',
      dataKey: 'trafficData',
      icon: Car,
      color: 'from-red-500 to-orange-500',
      unit: '%'
    },
    {
      id: 'air-quality-live',
      title: 'Air Quality',
      dataKey: 'airQuality',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      unit: ' AQI'
    },
    {
      id: 'transport-live',
      title: 'Public Transport',
      dataKey: 'publicTransport',
      icon: Bus,
      color: 'from-purple-500 to-pink-500',
      unit: '%'
    }
  ];

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
         {/* Welcome Section */}
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

         {/* Background Sync Status */}
         <LazyWrapper className="mb-8">
           <BackgroundSync />
         </LazyWrapper>

         {/* Live Data Widgets - Real-time updates from background sync */}
         <LazyWrapper className="mb-8">
           <h3 className="text-xl font-bold mb-4 flex items-center">
             <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
             Live Data
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {liveWidgets.map((widget, index) => (
               <LiveWidget
                 key={widget.id}
                 title={widget.title}
                 dataKey={widget.dataKey}
                 icon={widget.icon}
                 color={widget.color}
                 unit={widget.unit}
               />
             ))}
           </div>
         </LazyWrapper>

         {/* Static Widgets - Original dashboard widgets */}
         <LazyWrapper className="mb-8">
           <h3 className="text-xl font-bold mb-4">Dashboard Overview</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {mockWidgets.map((widget, index) => (
               <Widget key={widget.id} widget={widget} index={index} />
             ))}
           </div>
         </LazyWrapper>

         {/* Interactive Map */}
         <LazyWrapper 
           threshold={0.2}
           rootMargin="100px"
           fallback={
             <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 animate-pulse">
               <div className="h-96 bg-gray-700/30 rounded-xl flex items-center justify-center">
                 <div className="text-center space-y-3">
                   <div className="w-16 h-16 bg-gray-600/50 rounded-full mx-auto animate-pulse" />
                   <div className="w-32 h-4 bg-gray-600/50 rounded mx-auto" />
                 </div>
               </div>
             </div>
           }
         >
           <InteractiveMap location={location} />
         </LazyWrapper>
       </main>
     </div>
   </div>
 );
};

export default Dashboard;