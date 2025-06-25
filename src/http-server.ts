#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { WeatherService } from "./weather-service.js";
import * as http from "http";

// ==================== Type Definitions ====================

interface JSONRPCRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

interface JSONRPCResponse {
  jsonrpc: string;
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

interface MCPCapabilities {
  tools: {};
}

interface ServerInfo {
  name: string;
  version: string;
}

// ==================== Constants ====================

const PROTOCOL_VERSION = "2025-03-26";
const SERVER_NAME = "weather-mcp-http";
const SERVER_VERSION = "1.0.0";

const JSON_RPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

// ==================== Main Server Class ====================

class WeatherHTTPServer {
  private server: Server;
  private weatherService: WeatherService;
  private httpServer!: http.Server;
  private port: number;

  constructor(port: number = 8080) {
    this.port = port;
    this.server = this.createMCPServer();
    this.weatherService = new WeatherService();
    this.setupMCPHandlers();
    this.createHTTPServer();
  }

  // ==================== MCP Server Setup ====================

  private createMCPServer(): Server {
    return new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  private setupMCPHandlers(): void {
    this.setupToolsListHandler();
    this.setupToolsCallHandler();
  }

  private setupToolsListHandler(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getAvailableTools(),
      };
    });
  }

  private setupToolsCallHandler(): void {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return await this.executeWeatherTool(name, args);
    });
  }

  // ==================== Tool Definitions ====================

  private getAvailableTools(): Tool[] {
    return [
      {
        name: "get_current_weather",
        description: "Get current weather information for a specified location",
        inputSchema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Location name (e.g., Hong Kong, Tokyo, London)",
            },
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
    ] as Tool[];
  }

  // ==================== Tool Execution ====================

  private async executeWeatherTool(toolName: string, args: any): Promise<any> {
    try {
      switch (toolName) {
        case "get_current_weather":
          return await this.handleCurrentWeather(args);
        case "get_weather_forecast":
          return await this.handleWeatherForecast(args);
        case "get_weather_alerts":
          return await this.handleWeatherAlerts(args);
        case "search_locations":
          return await this.handleSearchLocations(args);
        case "get_weather_stats":
          return await this.handleWeatherStats();
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCurrentWeather(args: { location: string }) {
    const { location } = args;
    const weather = await this.weatherService.getCurrentWeather(location);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(weather, null, 2),
        },
      ],
    };
  }

  private async handleWeatherForecast(args: {
    location: string;
    days?: number;
  }) {
    const { location, days = 3 } = args;
    const forecast = await this.weatherService.getWeatherForecast(
      location,
      days
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(forecast, null, 2),
        },
      ],
    };
  }

  private async handleWeatherAlerts(args: { location?: string }) {
    const { location } = args;
    const alerts = await this.weatherService.getWeatherAlerts(location);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(alerts, null, 2),
        },
      ],
    };
  }

  private async handleSearchLocations(args: { query: string }) {
    const { query } = args;
    const locations = await this.weatherService.searchLocations(query);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(locations, null, 2),
        },
      ],
    };
  }

  private async handleWeatherStats() {
    const stats = await this.weatherService.getWeatherStats();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }

  // ==================== MCP Request Handling ====================

  private async handleMCPRequest(
    mcpRequest: JSONRPCRequest
  ): Promise<JSONRPCResponse> {
    try {
      switch (mcpRequest.method) {
        case "initialize":
          return this.handleInitialize(mcpRequest);
        case "tools/list":
          return this.handleToolsList(mcpRequest);
        case "tools/call":
          return await this.handleToolsCall(mcpRequest);
        default:
          return this.createErrorResponse(
            mcpRequest.id,
            JSON_RPC_ERRORS.METHOD_NOT_FOUND,
            "Unsupported method"
          );
      }
    } catch (error) {
      return this.createErrorResponse(
        mcpRequest.id,
        JSON_RPC_ERRORS.INTERNAL_ERROR,
        "Internal error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private handleInitialize(mcpRequest: JSONRPCRequest): JSONRPCResponse {
    return {
      jsonrpc: "2.0",
      id: mcpRequest.id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
        } as MCPCapabilities,
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        } as ServerInfo,
      },
    };
  }

  private handleToolsList(mcpRequest: JSONRPCRequest): JSONRPCResponse {
    return {
      jsonrpc: "2.0",
      id: mcpRequest.id,
      result: {
        tools: this.getAvailableTools(),
      },
    };
  }

  private async handleToolsCall(
    mcpRequest: JSONRPCRequest
  ): Promise<JSONRPCResponse> {
    const { name, arguments: args } = mcpRequest.params;
    const result = await this.executeWeatherTool(name, args);

    return {
      jsonrpc: "2.0",
      id: mcpRequest.id,
      result: result,
    };
  }

  private createErrorResponse(
    id: string | number | null,
    code: number,
    message: string,
    data?: any
  ): JSONRPCResponse {
    return {
      jsonrpc: "2.0",
      id: id,
      error: {
        code,
        message,
        ...(data && { data }),
      },
    };
  }

  // ==================== HTTP Server Setup ====================

  private createHTTPServer(): void {
    this.httpServer = http.createServer(async (req, res) => {
      this.setCORSHeaders(res);

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        await this.handleHTTPRequest(req, res);
      } catch (error) {
        console.error("HTTP Server Error:", error);
        this.sendErrorResponse(res, 500, {
          error: "Server Error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  private setCORSHeaders(res: http.ServerResponse): void {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  private async handleHTTPRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    // MCP Endpoint Handling
    if (this.isMCPEndpoint(req)) {
      await this.handleMCPEndpoint(req, res);
      return;
    }

    // Documentation Page
    if (req.url === "/" && req.method === "GET") {
      this.sendDocumentationPage(res);
      return;
    }

    // 404 Error
    this.sendErrorResponse(res, 404, { error: "Endpoint Not Found" });
  }

  private isMCPEndpoint(req: http.IncomingMessage): boolean {
    return (req.url === "/" || req.url === "/mcp") && req.method === "POST";
  }

  private async handleMCPEndpoint(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const mcpRequest = JSON.parse(body) as JSONRPCRequest;
        const response = await this.handleMCPRequest(mcpRequest);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error("MCP Request Processing Error:", error);
        const errorResponse = this.createErrorResponse(
          null,
          JSON_RPC_ERRORS.PARSE_ERROR,
          "Parse Error",
          error instanceof Error ? error.message : String(error)
        );
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(errorResponse));
      }
    });
  }

  private sendErrorResponse(
    res: http.ServerResponse,
    statusCode: number,
    errorData: any
  ): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(errorData));
  }

  // ==================== Documentation Page ====================

  private sendDocumentationPage(res: http.ServerResponse): void {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(this.generateDocumentationHTML());
  }

  private generateDocumentationHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Simple Weather MCP Server</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .method { background: #007acc; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        pre { background: #333; color: #fff; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .example { background: #e8f4f8; padding: 10px; border-left: 4px solid #007acc; margin: 10px 0; }
        .tools-list { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .tool-item { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🌤️ Simple Weather MCP Server</h1>
    <p>Server running on port <strong>${this.port}</strong></p>
    
    <h2>MCP Endpoints</h2>
    <div class="endpoint">
        <h3><span class="method">POST</span> / or /mcp</h3>
        <p>Handle MCP requests (supports two endpoints)</p>
        <p><strong>Content-Type:</strong> application/json</p>
        
        <div class="example">
            <h4>Example 1: Initialize</h4>
            <pre>
curl -X POST http://localhost:${this.port}/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": {"name": "test-client", "version": "1.0.0"}
    }
  }'
            </pre>
        </div>
        
        <div class="example">
            <h4>Example 2: List Tools</h4>
            <pre>
curl -X POST http://localhost:${this.port}/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'
            </pre>
        </div>
        
        <div class="example">
            <h4>Example 3: Get Weather</h4>
            <pre>
curl -X POST http://localhost:${this.port}/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_current_weather",
      "arguments": {
        "location": "Hong Kong"
      }
    }
  }'
            </pre>
        </div>
        
        <div class="example">
            <h4>Example 4: Standard MCP Configuration</h4>
            <pre>
{
  "mcpServers": {
    "weather": {
      "transport": "http",
      "url": "http://localhost:${this.port}",
      "reconnect": {
        "enabled": true,
        "maxAttempts": 5,
        "delayMs": 2000
      },
      "automaticSSEFallback": false
    }
  }
}
            </pre>
        </div>
    </div>
    
    <h2>Available Tools</h2>
    <div class="tools-list">
        <div class="tool-item">
            <strong>get_current_weather</strong> - Get current weather for specified location
            <br><em>Parameters: location (required)</em>
        </div>
        <div class="tool-item">
            <strong>get_weather_forecast</strong> - Get weather forecast for specified location
            <br><em>Parameters: location (required), days (1-7, default 3)</em>
        </div>
        <div class="tool-item">
            <strong>get_weather_alerts</strong> - Get weather alert information
            <br><em>Parameters: location (optional)</em>
        </div>
        <div class="tool-item">
            <strong>search_locations</strong> - Search supported locations
            <br><em>Parameters: query (required)</em>
        </div>
        <div class="tool-item">
            <strong>get_weather_stats</strong> - Get weather statistics
            <br><em>Parameters: none</em>
        </div>
    </div>
    
    <h2>Supported Locations</h2>
    <p>Hong Kong, Tokyo, London, New York</p>
    
    <h2>Protocol Flow</h2>
    <ol>
        <li><strong>Initialize:</strong> Client sends <code>initialize</code> method</li>
        <li><strong>Get Tools:</strong> Client sends <code>tools/list</code> method</li>
        <li><strong>Call Tools:</strong> Client sends <code>tools/call</code> method</li>
    </ol>
</body>
</html>
    `;
  }

  // ==================== Server Lifecycle ====================

  async start(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.httpServer.listen(this.port, () => {
        console.log(
          `🌤️ Simple Weather MCP Server started at http://localhost:${this.port}`
        );
        console.log(`📖 API Documentation: http://localhost:${this.port}`);
        console.log(
          `🔗 MCP Endpoint: http://localhost:${this.port}/ (root path)`
        );
        console.log(
          `🔗 MCP Endpoint: http://localhost:${this.port}/mcp (alternative path)`
        );
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.httpServer.close(() => {
        console.log("Simple HTTP server stopped");
        resolve();
      });
    });
  }
}

// ==================== Program Entry Point ====================

async function main() {
  const port = parseInt(process.argv[2]) || 8080;
  const server = new WeatherHTTPServer(port);

  // Graceful shutdown handling
  process.on("SIGINT", async () => {
    console.log("\nShutting down server...");
    await server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\nShutting down server...");
    await server.stop();
    process.exit(0);
  });

  try {
    await server.start();
  } catch (error) {
    console.error("Simple HTTP server failed to start:", error);
    process.exit(1);
  }
}

// Start the server
main();
