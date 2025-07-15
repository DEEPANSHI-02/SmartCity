import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';

export const SearchBar = ({ onSearch, searchResults, onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock city data for search results
  const mockCities = [
    { id: 1, name: 'New York', country: 'USA', coords: { lat: 40.7128, lng: -74.0060 }, weather: '22°C', traffic: 'Heavy' },
    { id: 2, name: 'London', country: 'UK', coords: { lat: 51.5074, lng: -0.1278 }, weather: '18°C', traffic: 'Moderate' },
    { id: 3, name: 'Tokyo', country: 'Japan', coords: { lat: 35.6762, lng: 139.6503 }, weather: '25°C', traffic: 'Light' },
    { id: 4, name: 'Paris', country: 'France', coords: { lat: 48.8566, lng: 2.3522 }, weather: '20°C', traffic: 'Moderate' },
    { id: 5, name: 'Sydney', country: 'Australia', coords: { lat: -33.8688, lng: 151.2093 }, weather: '23°C', traffic: 'Light' },
    { id: 6, name: 'Mumbai', country: 'India', coords: { lat: 19.0760, lng: 72.8777 }, weather: '28°C', traffic: 'Heavy' },
    { id: 7, name: 'Delhi', country: 'India', coords: { lat: 28.6139, lng: 77.2090 }, weather: '26°C', traffic: 'Heavy' },
    { id: 8, name: 'Singapore', country: 'Singapore', coords: { lat: 1.3521, lng: 103.8198 }, weather: '30°C', traffic: 'Moderate' }
  ];

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      setShowResults(true);
      
      // Simulate API delay
      setTimeout(() => {
        const filtered = mockCities.filter(city => 
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase())
        );
        onSearch(filtered);
        setIsSearching(false);
      }, 300);
    } else {
      setShowResults(false);
      onSearch([]);
    }
  };

  const handleSelectCity = (city) => {
    setQuery(city.name);
    setShowResults(false);
    onSelectCity(city);
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    onSearch([]);
  };

  return (
    <div className="relative">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
       <input
         type="text"
         value={query}
         onChange={(e) => handleSearch(e.target.value)}
         placeholder="Search cities worldwide..."
         className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
       />
       {query && (
         <button
           onClick={clearSearch}
           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
         >
           <X size={16} />
         </button>
       )}
     </div>

     {/* Search Results Dropdown */}
     {showResults && (
       <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
         {isSearching ? (
           <div className="p-4 text-center text-gray-400">
             <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
             Searching...
           </div>
         ) : searchResults.length > 0 ? (
           searchResults.map((city) => (
             <button
               key={city.id}
               onClick={() => handleSelectCity(city)}
               className="w-full p-4 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700/30 last:border-b-0"
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <MapPin size={16} className="text-blue-400" />
                   <div>
                     <p className="text-white font-medium">{city.name}</p>
                     <p className="text-gray-400 text-sm">{city.country}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-white text-sm">{city.weather}</p>
                   <p className="text-gray-400 text-xs">{city.traffic} Traffic</p>
                 </div>
               </div>
             </button>
           ))
         ) : query.length > 0 ? (
           <div className="p-4 text-center text-gray-400">
             No cities found for "{query}"
           </div>
         ) : null}
       </div>
     )}
   </div>
 );
};