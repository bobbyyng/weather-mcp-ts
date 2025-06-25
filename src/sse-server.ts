#!/usr/bin/env node

import express, { Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WeatherService } from "./weather-service.js";

const app = express();

const server = new Server(
  {
    name: "weather-mcp-sse",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const weatherService = new WeatherService();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_current_weather",
      description: "Get current weather information for a specified location",
      inputSchema: {
        type: "object",
        properties: {
          location: { type: "string", description: "Location name" },
        },
        required: ["location"],
      },
    },
    {
      name: "get_weather_forecast",
      description: "Get weather forecast for a specified location",
      inputSchema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Location name",
          },
          days: {
            type: "number",
            description: "Forecast days (1-7 days, default 3 days)",
            minimum: 1,
            maximum: 7,
          },
        },
        required: ["location"],
      },
    },
    {
      name: "get_weather_alerts",
      description: "Get weather alert information",
      inputSchema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "Location name (optional, if not provided will get all alerts)",
          },
        },
      },
    },
    {
      name: "search_locations",
      description: "Search supported locations",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search keyword",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "get_weather_stats",
      description: "Get weather statistics information",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("Arguments are required");
  }

  switch (name) {
    case "get_current_weather":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await weatherService.getCurrentWeather(args.location as string),
              null,
              2
            ),
          },
        ],
      };
    case "get_weather_forecast":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await weatherService.getWeatherForecast(
                args.location as string,
                (args.days as number) || 3
              ),
              null,
              2
            ),
          },
        ],
      };
    case "get_weather_alerts":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await weatherService.getWeatherAlerts(
                args.location as string | undefined
              ),
              null,
              2
            ),
          },
        ],
      };
    case "search_locations":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await weatherService.searchLocations(args.query as string),
              null,
              2
            ),
          },
        ],
      };
    case "get_weather_stats":
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await weatherService.getWeatherStats(),
              null,
              2
            ),
          },
        ],
      };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

let transport: SSEServerTransport | null = null;

app.get("/sse", (req: Request, res: Response) => {
  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);
});

// 最重要：先註冊 message endpoint
app.post("/messages", (req, res) => {
  if (transport) {
    try {
      transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("Error handling post message", error);
      res.status(500).json({ error: "Failed to deliver message" });
    }
  } else {
    res.status(400).json({ error: "No active SSE transport" });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(PORT, () => {
  console.log(
    `Weather MCP SSE server (express) running at http://localhost:${PORT}`
  );
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Message endpoint: http://localhost:${PORT}/messages`);
});
