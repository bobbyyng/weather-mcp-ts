export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  description: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  timestamp: string;
}

export interface WeatherForecast {
  location: string;
  forecast: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  description: string;
  chanceOfRain: number;
  humidity: number;
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  areas: string[];
  startTime: string;
  endTime: string;
} 