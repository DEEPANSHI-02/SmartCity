import { Car, Cloud, Bus, Zap, Users, Activity } from 'lucide-react';

export const mockCityData = {
  cityName: "Neo Tokyo",
  temperature: "24°C",
  weatherCondition: "Partly Cloudy",
  airQuality: "Good",
  trafficLevel: "Moderate",
  activeAlerts: 3,
  population: "13.96M",
  networkStatus: "5G",
  batteryLevel: 85
};

export const mockWidgets = [
  { id: 1, title: "Traffic Flow", icon: Car, color: "from-blue-500 to-cyan-500", value: "Normal", trend: "+2%" },
  { id: 2, title: "Weather", icon: Cloud, color: "from-purple-500 to-pink-500", value: "24°C", trend: "Sunny" },
  { id: 3, title: "Public Transit", icon: Bus, color: "from-green-500 to-emerald-500", value: "On Time", trend: "95%" },
  { id: 4, title: "Energy Usage", icon: Zap, color: "from-orange-500 to-red-500", value: "Low", trend: "-5%" },
  { id: 5, title: "Population", icon: Users, color: "from-indigo-500 to-purple-500", value: "13.96M", trend: "+0.1%" },
  { id: 6, title: "Air Quality", icon: Activity, color: "from-teal-500 to-green-500", value: "Good", trend: "Stable" }
];