import React from 'react';
import { Activity, MapPin } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'map', label: 'City Map', icon: MapPin }
];

export const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 pt-8">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-gray-300 text-sm font-medium mb-3">Live Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Location</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between text-sm">
               <span className="text-gray-400">Air Quality</span>
               <span className="text-green-400">Good</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-400">Traffic</span>
               <span className="text-yellow-400">Moderate</span>
             </div>
           </div>
         </div>
       </div>
     </aside>
   </>
 );
};