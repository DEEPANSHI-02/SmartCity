import React from 'react';
import { Widget } from '../widgets/Widget';
import { LiveWidget } from '../widgets/LiveWidget';
import { LazyWrapper } from '../common/LazyWrapper';
import { mockWidgets } from '../../services/mockData';
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

export const DashboardSection = () => {
  return (
    <div className="space-y-8">
      {/* Live Data Section */}
      <LazyWrapper>
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

      {/* Dashboard Overview Section */}
      <LazyWrapper>
        <h3 className="text-xl font-bold mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWidgets.map((widget, index) => (
            <Widget key={widget.id} widget={widget} index={index} />
          ))}
        </div>
      </LazyWrapper>
    </div>
  );
};