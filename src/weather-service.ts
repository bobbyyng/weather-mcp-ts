import { WeatherData, WeatherForecast, WeatherAlert } from './types.js';
import { mockWeatherData, mockForecastData, mockWeatherAlerts, getRandomWeatherData, locationMapping, searchLocationsByQuery } from './mock-data.js';

export class WeatherService {
  /**
   * Get current weather for a specified location
   */
  async getCurrentWeather(location: string): Promise<WeatherData> {
    // Normalize location name using location mapping
    const normalizedLocation = this.normalizeLocation(location);
    
    if (mockWeatherData[normalizedLocation]) {
      return {
        ...mockWeatherData[normalizedLocation],
        timestamp: new Date().toISOString()
      };
    }
    
    // If location not found, return random weather data
    const randomData = getRandomWeatherData();
    return {
      ...randomData,
      location: location,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get weather forecast for a specified location
   */
  async getWeatherForecast(location: string, days: number = 3): Promise<WeatherForecast> {
    const normalizedLocation = this.normalizeLocation(location);
    
    if (mockForecastData[normalizedLocation]) {
      const forecast = mockForecastData[normalizedLocation];
      return {
        ...forecast,
        forecast: forecast.forecast.slice(0, days)
      };
    }
    
    // If location not found, generate mock forecast data
    return this.generateMockForecast(location, days);
  }

  /**
   * Get weather alerts
   */
  async getWeatherAlerts(location?: string): Promise<WeatherAlert[]> {
    if (!location) {
      return mockWeatherAlerts;
    }
    
    const normalizedLocation = this.normalizeLocation(location);
    const locationName = mockWeatherData[normalizedLocation]?.location || location;
    
    return mockWeatherAlerts.filter(alert => 
      alert.areas.some(area => 
        area.toLowerCase().includes(locationName.toLowerCase()) ||
        locationName.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(normalizedLocation) ||
        normalizedLocation.includes(area.toLowerCase())
      )
    );
  }

  /**
   * Search for supported locations
   */
  async searchLocations(query: string): Promise<string[]> {
    // Use the enhanced search function from mock-data
    return searchLocationsByQuery(query);
  }

  /**
   * Get weather statistics
   */
  async getWeatherStats(): Promise<{
    totalLocations: number;
    averageTemperature: number;
    mostCommonCondition: string;
    locationBreakdown: Array<{location: string, temperature: number, condition: string}>;
  }> {
    const locations = Object.values(mockWeatherData);
    const totalLocations = locations.length;
    const averageTemperature = locations.reduce((sum, data) => sum + data.temperature, 0) / totalLocations;
    
    const conditionCounts: Record<string, number> = {};
    locations.forEach(data => {
      conditionCounts[data.condition] = (conditionCounts[data.condition] || 0) + 1;
    });
    
    const mostCommonCondition = Object.entries(conditionCounts)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    const locationBreakdown = locations.map(data => ({
      location: data.location,
      temperature: data.temperature,
      condition: data.condition
    }));
    
    return {
      totalLocations,
      averageTemperature: Math.round(averageTemperature * 10) / 10,
      mostCommonCondition,
      locationBreakdown
    };
  }

  private normalizeLocation(location: string): string {
    const lowerLocation = location.toLowerCase().trim();
    
    // Check if location exists in mapping
    if (locationMapping[lowerLocation]) {
      return locationMapping[lowerLocation];
    }
    
    // Fallback to original normalization
    return lowerLocation
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private generateMockForecast(location: string, days: number): WeatherForecast {
    const forecast = [];
    const baseTemp = 20 + Math.random() * 15; // Temperature between 20-35°C
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorms', 'Overcast', 'Light Rain'];
    const descriptions = {
      'Sunny': 'Clear skies with bright sunshine',
      'Partly Cloudy': 'Mix of sun and clouds',
      'Cloudy': 'Overcast skies with mild temperatures',
      'Rainy': 'Rain showers expected',
      'Thunderstorms': 'Thunderstorms with heavy rain',
      'Overcast': 'Cloudy skies throughout the day',
      'Light Rain': 'Light rain showers'
    };
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const tempVariation = (Math.random() - 0.5) * 10;
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        highTemp: Math.round(baseTemp + tempVariation + 5),
        lowTemp: Math.round(baseTemp + tempVariation - 5),
        condition,
        description: descriptions[condition as keyof typeof descriptions] || `${condition} conditions expected`,
        chanceOfRain: condition.includes('Rain') || condition.includes('Thunder') ? 70 + Math.random() * 30 : Math.random() * 40,
        humidity: 50 + Math.random() * 40
      });
    }
    
    return {
      location,
      forecast
    };
  }
} 