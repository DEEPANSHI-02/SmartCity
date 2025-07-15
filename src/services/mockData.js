import { Car, Cloud, Bus, Zap, Users, Activity } from 'lucide-react';

export const createCityData = (location = null) => {
  return {
    cityName: location ? "Your Location" : "Smart City",
    temperature: "24°C",
    weatherCondition: "Partly Cloudy",
    airQuality: "Good",
    trafficLevel: "Moderate",
    activeAlerts: 3,
    population: "Local Area",
    networkStatus: "5G",
    batteryLevel: 85,
    coordinates: location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : null
  };
};

// Create city-specific widgets
export const createCityWidgets = (selectedCity) => {
  if (!selectedCity) {
    // Default widgets for user location
    return [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-blue-500 to-cyan-500", value: "Normal", trend: "+2%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-purple-500 to-pink-500", value: "24°C", trend: "Sunny" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "On Time", trend: "95%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-orange-500 to-red-500", value: "Low", trend: "-5%" },
      { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "Local", trend: "+0.1%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-teal-500 to-green-500", value: "Good", trend: "Stable" }
    ];
  }

  // City-specific widgets based on search
  const cityWidgetMap = {
    'Delhi': [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-red-500 to-orange-500", value: "Heavy", trend: "+15%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-orange-500 to-red-500", value: "26°C", trend: "Hazy" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-yellow-500 to-orange-500", value: "Delayed", trend: "70%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-red-500 to-pink-500", value: "High", trend: "+8%" },
      { id: 5, title: "Population", icon: Users, color: "from-purple-500 to-pink-500", value: "32.9M", trend: "+2.1%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-red-500 to-red-600", value: "Poor", trend: "Worsening" }
    ],
    'Mumbai': [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-red-500 to-orange-500", value: "Heavy", trend: "+12%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-blue-500 to-cyan-500", value: "28°C", trend: "Humid" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "On Time", trend: "92%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-orange-500 to-red-500", value: "High", trend: "+5%" },
      { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "20.4M", trend: "+1.8%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-yellow-500 to-orange-500", value: "Moderate", trend: "Stable" }
    ],
    'London': [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-yellow-500 to-orange-500", value: "Moderate", trend: "+3%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-gray-500 to-blue-500", value: "18°C", trend: "Cloudy" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "Excellent", trend: "98%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-green-500 to-teal-500", value: "Efficient", trend: "-3%" },
      { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "9.5M", trend: "+0.8%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-green-500 to-emerald-500", value: "Good", trend: "Improving" }
    ],
    'New York': [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-red-500 to-orange-500", value: "Heavy", trend: "+8%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-blue-500 to-cyan-500", value: "22°C", trend: "Clear" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-yellow-500 to-orange-500", value: "Delayed", trend: "78%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-orange-500 to-red-500", value: "High", trend: "+4%" },
      { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "8.3M", trend: "+0.5%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-yellow-500 to-orange-500", value: "Moderate", trend: "Stable" }
    ],
    'Tokyo': [
      { id: 1, title: "Traffic Flow", icon: Car, color: "from-green-500 to-emerald-500", value: "Light", trend: "-2%" },
      { id: 2, title: "Weather", icon: Cloud, color: "from-yellow-500 to-orange-500", value: "25°C", trend: "Sunny" },
      { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "Excellent", trend: "99%" },
      { id: 4, title: "Energy Usage", icon: Zap, color: "from-green-500 to-teal-500", value: "Efficient", trend: "-1%" },
      { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "14.0M", trend: "-0.2%" },
      { id: 6, title: "Air Quality", icon: Activity, color: "from-green-500 to-emerald-500", value: "Good", trend: "Stable" }
    ]
  };

  return cityWidgetMap[selectedCity.name] || [
    { id: 1, title: "Traffic Flow", icon: Car, color: "from-blue-500 to-cyan-500", value: "Unknown", trend: "N/A" },
    { id: 2, title: "Weather", icon: Cloud, color: "from-purple-500 to-pink-500", value: "N/A", trend: "N/A" },
    { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "Unknown", trend: "N/A" },
    { id: 4, title: "Energy Usage", icon: Zap, color: "from-orange-500 to-red-500", value: "Unknown", trend: "N/A" },
    { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "Unknown", trend: "N/A" },
    { id: 6, title: "Air Quality", icon: Activity, color: "from-teal-500 to-green-500", value: "Unknown", trend: "N/A" }
  ];
};

export const mockCityData = {
  cityName: "Smart City",
  temperature: "24°C",
  weatherCondition: "Partly Cloudy",
  airQuality: "Good",
  trafficLevel: "Moderate",
  activeAlerts: 3,
  population: "Local Area",
  networkStatus: "5G",
  batteryLevel: 85
};