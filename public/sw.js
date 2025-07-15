const CACHE_NAME = 'smart-city-dashboard-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Background sync data
let backgroundSyncData = {
  weatherData: null,
  trafficData: null,
  lastUpdate: null,
  notifications: []
};

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background Sync - sync data when connection is restored
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'city-data-sync') {
    event.waitUntil(syncCityData());
  }
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(processNotifications());
  }
});

// Periodic Background Sync - fetch data periodically
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic sync triggered:', event.tag);
  
  if (event.tag === 'city-data-update') {
    event.waitUntil(fetchLatestCityData());
  }
});

// Background fetch - handle large data downloads
self.addEventListener('backgroundfetch', (event) => {
  console.log('📡 Background fetch:', event.tag);
  
  if (event.tag === 'map-tiles') {
    event.waitUntil(downloadMapTiles());
  }
});

// Message handler - communicate with main thread
self.addEventListener('message', (event) => {
  console.log('💬 SW received message:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'UPDATE_BACKGROUND_DATA':
      updateBackgroundData(data);
      break;
    case 'GET_BACKGROUND_DATA':
      event.ports[0].postMessage(backgroundSyncData);
      break;
    case 'REGISTER_NOTIFICATION':
      registerNotification(data);
      break;
    case 'SYNC_NOW':
      syncCityData();
      break;
  }
});

// Sync city data function
async function syncCityData() {
  try {
    console.log('🌆 Syncing city data...');
    
    // Simulate API calls
    const weatherResponse = await fetch('/api/weather', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => generateMockWeatherData());
    
    const trafficResponse = await fetch('/api/traffic', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => generateMockTrafficData());
    
    const weatherData = weatherResponse.json ? await weatherResponse.json() : weatherResponse;
    const trafficData = trafficResponse.json ? await trafficResponse.json() : trafficResponse;
    
    // Update background data
    backgroundSyncData = {
      ...backgroundSyncData,
      weatherData,
      trafficData,
      lastUpdate: new Date().toISOString()
    };
    
    // Notify all clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_UPDATED',
        data: backgroundSyncData
      });
    });
    
    console.log('✅ City data synced successfully');
    
    // Check for alerts and send notifications
    checkForAlerts(weatherData, trafficData);
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Fetch latest city data periodically
async function fetchLatestCityData() {
  console.log('📊 Fetching latest city data...');
  
  try {
    const timestamp = new Date().toISOString();
    
    // Generate realistic mock data
    const newData = {
      weather: generateMockWeatherData(),
      traffic: generateMockTrafficData(),
      airQuality: generateMockAirQuality(),
      publicTransport: generateMockTransportData(),
      timestamp
    };
    
    backgroundSyncData = { ...backgroundSyncData, ...newData, lastUpdate: timestamp };
    
    // Broadcast to all tabs
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'PERIODIC_UPDATE',
        data: newData
      });
    });
    
  } catch (error) {
    console.error('❌ Periodic fetch failed:', error);
  }
}

// Process notifications
async function processNotifications() {
  console.log('🔔 Processing notifications...');
  
  const pendingNotifications = backgroundSyncData.notifications || [];
  
  for (const notification of pendingNotifications) {
    await self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: notification.tag,
      data: notification.data,
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }
  
  // Clear processed notifications
  backgroundSyncData.notifications = [];
}

// Check for alerts
function checkForAlerts(weatherData, trafficData) {
  const alerts = [];
  
  // Weather alerts
  if (weatherData.temperature > 35) {
    alerts.push({
      title: '🌡️ High Temperature Alert',
      body: `Temperature is ${weatherData.temperature}°C. Stay hydrated!`,
      tag: 'weather-alert',
      data: { type: 'weather', severity: 'warning' }
    });
  }
  
  // Traffic alerts
  if (trafficData.congestionLevel > 80) {
    alerts.push({
      title: '🚦 Traffic Alert',
      body: 'Heavy traffic detected. Consider alternative routes.',
      tag: 'traffic-alert',
      data: { type: 'traffic', severity: 'info' }
    });
  }
  
  // Store alerts for processing
  backgroundSyncData.notifications = [...(backgroundSyncData.notifications || []), ...alerts];
  
  if (alerts.length > 0) {
    processNotifications();
  }
}

// Mock data generators
function generateMockWeatherData() {
  return {
    temperature: Math.round(20 + Math.random() * 15),
    humidity: Math.round(40 + Math.random() * 40),
    condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
    windSpeed: Math.round(Math.random() * 20),
    timestamp: new Date().toISOString()
  };
}

function generateMockTrafficData() {
  return {
    congestionLevel: Math.round(Math.random() * 100),
    averageSpeed: Math.round(30 + Math.random() * 40),
    incidents: Math.floor(Math.random() * 5),
    timestamp: new Date().toISOString()
  };
}

function generateMockAirQuality() {
  return {
    aqi: Math.round(50 + Math.random() * 100),
    quality: ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString()
  };
}

function generateMockTransportData() {
  return {
    onTimePercentage: Math.round(85 + Math.random() * 15),
    delays: Math.floor(Math.random() * 10),
    timestamp: new Date().toISOString()
  };
}

// Update background data
function updateBackgroundData(data) {
  backgroundSyncData = { ...backgroundSyncData, ...data };
  console.log('📝 Background data updated');
}

// Register notification
function registerNotification(notification) {
  backgroundSyncData.notifications = backgroundSyncData.notifications || [];
  backgroundSyncData.notifications.push(notification);
  console.log('🔔 Notification registered:', notification.title);
}