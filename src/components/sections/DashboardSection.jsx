import React from 'react';
import { Widget } from '../widgets/Widget';
import { LiveWidget } from '../widgets/LiveWidget';
import { LazyWrapper } from '../common/LazyWrapper';
import { createCityWidgets } from '../../services/mockData';
import { getCityData } from '../../services/cityService';
import { Car, Cloud, Activity, Bus } from 'lucide-react';

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

export const DashboardSection = ({ selectedCity }) => {
  const citySpecificData = selectedCity ? getCityData(selectedCity) : null;
  const cityWidgets = createCityWidgets(selectedCity);

  return (
    <div className="space-y-8">
      {/* City Info Banner */}
      {selectedCity && citySpecificData && (
        <LazyWrapper>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedCity.name}, {selectedCity.country}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{citySpecificData.temperature}</p>
                <p className="text-gray-300">{citySpecificData.condition}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{citySpecificData.humidity}</p>
                <p className="text-gray-300">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{citySpecificData.windSpeed}</p>
                <p className="text-gray-300">Wind Speed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{citySpecificData.trafficLevel}</p>
                <p className="text-gray-300">Traffic</p>
              </div>
            </div>
          </div>
        </LazyWrapper>
      )}

      {/* Live Data Section */}
      <LazyWrapper>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Live Data {selectedCity && `- ${selectedCity.name}`}
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
              selectedCity={selectedCity}
            />
          ))}
        </div>
      </LazyWrapper>

      {/* Dashboard Overview Section - Now City Specific */}
      <LazyWrapper>
        <h3 className="text-xl font-bold mb-4">
          Dashboard Overview {selectedCity && `- ${selectedCity.name}`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityWidgets.map((widget, index) => (
            <Widget key={widget.id} widget={widget} index={index} />
          ))}
        </div>
      </LazyWrapper>
    </div>
  );
};