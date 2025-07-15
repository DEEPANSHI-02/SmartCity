// Mock service to get city data
export const getCityData = (city) => {
  // Simulate different weather data for different cities
  const cityWeatherMap = {
    'New York': {
      temperature: '22°C',
      condition: 'Partly Cloudy',
      humidity: '65%',
      windSpeed: '15 km/h',
      airQuality: 'Moderate',
      trafficLevel: 'Heavy'
    },
    'London': {
      temperature: '18°C',
      condition: 'Cloudy',
      humidity: '80%',
      windSpeed: '12 km/h',
      airQuality: 'Good',
      trafficLevel: 'Moderate'
    },
    'Tokyo': {
      temperature: '25°C',
      condition: 'Sunny',
      humidity: '55%',
      windSpeed: '8 km/h',
      airQuality: 'Good',
      trafficLevel: 'Light'
    },
    'Paris': {
      temperature: '20°C',
      condition: 'Light Rain',
      humidity: '75%',
      windSpeed: '10 km/h',
      airQuality: 'Good',
      trafficLevel: 'Moderate'
    },
    'Mumbai': {
      temperature: '28°C',
      condition: 'Hot',
      humidity: '85%',
      windSpeed: '6 km/h',
      airQuality: 'Poor',
      trafficLevel: 'Heavy'
    },
    'Delhi': {
      temperature: '26°C',
      condition: 'Hazy',
      humidity: '70%',
      windSpeed: '5 km/h',
      airQuality: 'Poor',
      trafficLevel: 'Heavy'
    }
  };

  return cityWeatherMap[city.name] || {
    temperature: '24°C',
    condition: 'Unknown',
    humidity: '60%',
    windSpeed: '10 km/h',
    airQuality: 'Unknown',
    trafficLevel: 'Unknown'
  };
};

export const createCityDataFromSearch = (city) => {
  const cityData = getCityData(city);
  
  return {
    cityName: city.name,
    country: city.country,
    coordinates: `${city.coords.lat.toFixed(4)}, ${city.coords.lng.toFixed(4)}`,
    temperature: cityData.temperature,
    weatherCondition: cityData.condition,
    airQuality: cityData.airQuality,
    trafficLevel: cityData.trafficLevel,
    humidity: cityData.humidity,
    windSpeed: cityData.windSpeed,
    activeAlerts: Math.floor(Math.random() * 5),
    population: 'N/A',
    networkStatus: '4G',
    batteryLevel: 85,
    isSearchResult: true
  };
};