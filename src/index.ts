#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { WeatherService } from './weather-service.js';

class WeatherMCPServer {
  private server: Server;
  private weatherService: WeatherService;

  constructor() {
    this.server = new Server(
      {
        name: 'weather-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.weatherService = new WeatherService();
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_current_weather',
            description: 'Get current weather information for a specified location',
            inputSchema: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'Location name (e.g., Hong Kong, Tokyo, London)',
                },
              },
              required: ['location'],
            },
          },
          {
            name: 'get_weather_forecast',
            description: 'Get weather forecast for a specified location',
            inputSchema: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'Location name',
                },
                days: {
                  type: 'number',
                  description: 'Forecast days (1-7 days, default is 3 days)',
                  minimum: 1,
                  maximum: 7,
                },
              },
              required: ['location'],
            },
          },
          {
            name: 'get_weather_alerts',
            description: 'Get weather alert information',
            inputSchema: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'Location name (optional, if not provided, get all alerts)',
                },
              },
            },
          },
          {
            name: 'search_locations',
            description: 'Search supported locations',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search keyword',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_weather_stats',
            description: 'Get weather statistics information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ] as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_current_weather': {
            const { location } = args as { location: string };
            const weather = await this.weatherService.getCurrentWeather(location);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weather, null, 2),
                },
              ],
            };
          }

          case 'get_weather_forecast': {
            const { location, days = 3 } = args as { location: string; days?: number };
            const forecast = await this.weatherService.getWeatherForecast(location, days);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(forecast, null, 2),
                },
              ],
            };
          }

          case 'get_weather_alerts': {
            const { location } = args as { location?: string };
            const alerts = await this.weatherService.getWeatherAlerts(location);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(alerts, null, 2),
                },
              ],
            };
          }

          case 'search_locations': {
            const { query } = args as { query: string };
            const locations = await this.weatherService.searchLocations(query);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(locations, null, 2),
                },
              ],
            };
          }

          case 'get_weather_stats': {
            const stats = await this.weatherService.getWeatherStats();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(stats, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Weather MCP server started');
  }
}

// Start server
const server = new WeatherMCPServer();
server.run().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});