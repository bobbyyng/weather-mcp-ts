import { WeatherData, WeatherForecast, WeatherAlert } from './types.js';

export const mockWeatherData: Record<string, WeatherData> = {
  'hong-kong': {
    location: 'Hong Kong',
    temperature: 28,
    humidity: 75,
    windSpeed: 15,
    windDirection: 'SE',
    condition: 'Partly Cloudy',
    description: 'Partly cloudy with occasional sunshine and high humidity',
    pressure: 1013,
    visibility: 10,
    uvIndex: 7,
    timestamp: new Date().toISOString()
  },
  'tokyo': {
    location: 'Tokyo',
    temperature: 22,
    humidity: 60,
    windSpeed: 8,
    windDirection: 'NE',
    condition: 'Sunny',
    description: 'Clear skies with bright sunshine, perfect spring weather',
    pressure: 1020,
    visibility: 15,
    uvIndex: 5,
    timestamp: new Date().toISOString()
  },
  'osaka': {
    location: 'Osaka',
    temperature: 24,
    humidity: 65,
    windSpeed: 6,
    windDirection: 'SW',
    condition: 'Partly Cloudy',
    description: 'Mild temperature with scattered clouds, comfortable for outdoor activities',
    pressure: 1018,
    visibility: 12,
    uvIndex: 6,
    timestamp: new Date().toISOString()
  },
  'kyoto': {
    location: 'Kyoto',
    temperature: 20,
    humidity: 70,
    windSpeed: 4,
    windDirection: 'N',
    condition: 'Overcast',
    description: 'Cloudy skies with cool temperatures, typical spring weather in ancient capital',
    pressure: 1016,
    visibility: 10,
    uvIndex: 3,
    timestamp: new Date().toISOString()
  },
  'hiroshima': {
    location: 'Hiroshima',
    temperature: 23,
    humidity: 68,
    windSpeed: 7,
    windDirection: 'SE',
    condition: 'Light Rain',
    description: 'Light drizzle with mild temperatures, umbrella recommended',
    pressure: 1012,
    visibility: 8,
    uvIndex: 2,
    timestamp: new Date().toISOString()
  },
  'sapporo': {
    location: 'Sapporo',
    temperature: 16,
    humidity: 55,
    windSpeed: 12,
    windDirection: 'NW',
    condition: 'Sunny',
    description: 'Cool and crisp northern weather with clear skies',
    pressure: 1022,
    visibility: 18,
    uvIndex: 4,
    timestamp: new Date().toISOString()
  },
  'fukuoka': {
    location: 'Fukuoka',
    temperature: 26,
    humidity: 72,
    windSpeed: 9,
    windDirection: 'SW',
    condition: 'Thunderstorms',
    description: 'Afternoon thunderstorms with warm temperatures, typical for southern Japan',
    pressure: 1008,
    visibility: 6,
    uvIndex: 8,
    timestamp: new Date().toISOString()
  },
  'london': {
    location: 'London',
    temperature: 15,
    humidity: 80,
    windSpeed: 12,
    windDirection: 'W',
    condition: 'Rainy',
    description: 'Light rain with overcast skies, typical British weather',
    pressure: 998,
    visibility: 8,
    uvIndex: 2,
    timestamp: new Date().toISOString()
  },
  'new-york': {
    location: 'New York',
    temperature: 25,
    humidity: 65,
    windSpeed: 10,
    windDirection: 'SW',
    condition: 'Cloudy',
    description: 'Mostly cloudy with mild temperatures, pleasant city weather',
    pressure: 1015,
    visibility: 12,
    uvIndex: 4,
    timestamp: new Date().toISOString()
  },
  'sydney': {
    location: 'Sydney',
    temperature: 22,
    humidity: 58,
    windSpeed: 14,
    windDirection: 'SE',
    condition: 'Sunny',
    description: 'Beautiful sunny day with harbor breeze, perfect for outdoor activities',
    pressure: 1019,
    visibility: 20,
    uvIndex: 9,
    timestamp: new Date().toISOString()
  }
};

export const mockForecastData: Record<string, WeatherForecast> = {
  'hong-kong': {
    location: 'Hong Kong',
    forecast: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 30,
        lowTemp: 25,
        condition: 'Thunderstorms',
        description: 'Afternoon thunderstorms with heavy rain',
        chanceOfRain: 80,
        humidity: 85
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 29,
        lowTemp: 24,
        condition: 'Partly Cloudy',
        description: 'Mix of sun and clouds, more comfortable',
        chanceOfRain: 30,
        humidity: 70
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 31,
        lowTemp: 26,
        condition: 'Sunny',
        description: 'Bright and sunny, hot weather returns',
        chanceOfRain: 10,
        humidity: 65
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 32,
        lowTemp: 27,
        condition: 'Hot',
        description: 'Very hot and humid, stay hydrated',
        chanceOfRain: 20,
        humidity: 80
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 28,
        lowTemp: 23,
        condition: 'Rainy',
        description: 'Rainy day with cooler temperatures',
        chanceOfRain: 90,
        humidity: 88
      },
      {
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 29,
        lowTemp: 24,
        condition: 'Partly Cloudy',
        description: 'Clearing up with occasional sunshine',
        chanceOfRain: 40,
        humidity: 75
      },
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 30,
        lowTemp: 25,
        condition: 'Sunny',
        description: 'Beautiful sunny weather for weekend',
        chanceOfRain: 15,
        humidity: 68
      }
    ]
  },
  'tokyo': {
    location: 'Tokyo',
    forecast: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 24,
        lowTemp: 18,
        condition: 'Partly Cloudy',
        description: 'Pleasant spring weather with mild temperatures',
        chanceOfRain: 20,
        humidity: 55
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 26,
        lowTemp: 19,
        condition: 'Sunny',
        description: 'Clear skies and warming temperatures',
        chanceOfRain: 10,
        humidity: 50
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 21,
        lowTemp: 16,
        condition: 'Rainy',
        description: 'Spring rain showers, cooler temperatures',
        chanceOfRain: 85,
        humidity: 78
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 23,
        lowTemp: 17,
        condition: 'Overcast',
        description: 'Cloudy skies with mild spring weather',
        chanceOfRain: 35,
        humidity: 65
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 25,
        lowTemp: 19,
        condition: 'Sunny',
        description: 'Beautiful clear day, perfect for cherry blossom viewing',
        chanceOfRain: 5,
        humidity: 48
      },
      {
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 27,
        lowTemp: 20,
        condition: 'Partly Cloudy',
        description: 'Warm spring day with scattered clouds',
        chanceOfRain: 25,
        humidity: 58
      },
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 28,
        lowTemp: 21,
        condition: 'Sunny',
        description: 'Excellent weather for outdoor activities',
        chanceOfRain: 10,
        humidity: 52
      }
    ]
  },
  'osaka': {
    location: 'Osaka',
    forecast: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 26,
        lowTemp: 20,
        condition: 'Sunny',
        description: 'Bright sunny day in the commercial heart of Japan',
        chanceOfRain: 15,
        humidity: 60
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 24,
        lowTemp: 18,
        condition: 'Light Rain',
        description: 'Light spring showers with cooler temperatures',
        chanceOfRain: 70,
        humidity: 75
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 27,
        lowTemp: 21,
        condition: 'Partly Cloudy',
        description: 'Mix of sun and clouds, pleasant weather',
        chanceOfRain: 30,
        humidity: 62
      }
    ]
  },
  'sapporo': {
    location: 'Sapporo',
    forecast: [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 18,
        lowTemp: 12,
        condition: 'Partly Cloudy',
        description: 'Cool northern weather with scattered clouds',
        chanceOfRain: 25,
        humidity: 50
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 15,
        lowTemp: 9,
        condition: 'Snow Showers',
        description: 'Late spring snow possible in northern Japan',
        chanceOfRain: 60,
        humidity: 70
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        highTemp: 20,
        lowTemp: 14,
        condition: 'Sunny',
        description: 'Clear and crisp, beautiful mountain views',
        chanceOfRain: 10,
        humidity: 45
      }
    ]
  }
};

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: 'hk-typhoon-001',
    type: 'Typhoon',
    severity: 'severe',
    title: 'Typhoon Warning Signal No. 8',
    description: 'Strong winds and heavy rain expected. Stay indoors and avoid unnecessary travel. Public transport may be suspended.',
    areas: ['Hong Kong Island', 'Kowloon', 'New Territories'],
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tokyo-heatwave-001',
    type: 'Heat Wave',
    severity: 'moderate',
    title: 'High Temperature Advisory',
    description: 'Temperatures may exceed 35°C. Stay hydrated and avoid prolonged outdoor activities during peak hours.',
    areas: ['Tokyo Metropolitan Area', 'Chiba', 'Saitama'],
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'osaka-thunderstorm-001',
    type: 'Thunderstorm',
    severity: 'moderate',
    title: 'Severe Thunderstorm Warning',
    description: 'Heavy rain, lightning, and strong winds expected. Avoid outdoor activities and seek shelter.',
    areas: ['Osaka Prefecture', 'Kyoto', 'Nara'],
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sapporo-snow-001',
    type: 'Snow',
    severity: 'minor',
    title: 'Late Season Snow Advisory',
    description: 'Unexpected late spring snowfall possible. Roads may become slippery, drive with caution.',
    areas: ['Sapporo City', 'Hokkaido Central'],
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'london-flood-001',
    type: 'Flood',
    severity: 'moderate',
    title: 'Flood Warning',
    description: 'Heavy rainfall may cause flooding in low-lying areas. Avoid driving through flooded roads.',
    areas: ['Thames Valley', 'South London', 'Surrey'],
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fukuoka-typhoon-001',
    type: 'Typhoon',
    severity: 'severe',
    title: 'Typhoon Approach Warning',
    description: 'Typhoon approaching southern Japan. Prepare for strong winds, heavy rain, and possible power outages.',
    areas: ['Fukuoka Prefecture', 'Kumamoto', 'Kagoshima'],
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  }
];

// Location mapping for easy search
export const locationMapping: Record<string, string> = {
  'hong kong': 'hong-kong',
  'hongkong': 'hong-kong',
  'hk': 'hong-kong',
  'tokyo': 'tokyo',
  'tokyo japan': 'tokyo',
  'osaka': 'osaka',
  'osaka japan': 'osaka',
  'kyoto': 'kyoto',
  'kyoto japan': 'kyoto',
  'hiroshima': 'hiroshima',
  'hiroshima japan': 'hiroshima',
  'sapporo': 'sapporo',
  'sapporo japan': 'sapporo',
  'fukuoka': 'fukuoka',
  'fukuoka japan': 'fukuoka',
  'london': 'london',
  'london uk': 'london',
  'new york': 'new-york',
  'newyork': 'new-york',
  'nyc': 'new-york',
  'sydney': 'sydney',
  'sydney australia': 'sydney'
};

export function getRandomWeatherData(): WeatherData {
  const locations = Object.keys(mockWeatherData);
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  return mockWeatherData[randomLocation];
}

export function searchLocationsByQuery(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const matchingLocations: string[] = [];
  
  // Search in location mapping
  Object.keys(locationMapping).forEach(key => {
    if (key.includes(normalizedQuery)) {
      const location = mockWeatherData[locationMapping[key]]?.location;
      if (location && !matchingLocations.includes(location)) {
        matchingLocations.push(location);
      }
    }
  });
  
  // Search in actual location names
  Object.values(mockWeatherData).forEach(data => {
    if (data.location.toLowerCase().includes(normalizedQuery) && 
        !matchingLocations.includes(data.location)) {
      matchingLocations.push(data.location);
    }
  });
  
  return matchingLocations;
} 