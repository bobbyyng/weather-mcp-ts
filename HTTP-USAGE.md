# Simple HTTP MCP Server Usage Guide

This is a simple HTTP MCP server that doesn't use SSE (Server-Sent Events), providing MCP services through a single simple HTTP URL endpoint.

## Starting the Server

```bash
# Compile the code
pnpm run build

# Start the server (default port 8080)
pnpm run start:simple

# Or specify a port
pnpm run start:simple:8080
# Or directly
node dist/simple-http-server.js 8090
```

## Server Endpoints

- **Main MCP endpoint**: `POST http://localhost:8080/mcp`
- **Documentation page**: `GET http://localhost:8080/`

## MCP Request Format

All MCP requests are made via POST to the `/mcp` endpoint using standard JSON-RPC 2.0 format.

### 1. List Available Tools

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

### 2. Call Tool - Get Current Weather

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_current_weather",
      "arguments": {
        "location": "Hong Kong"
      }
    }
  }'
```

### 3. Call Tool - Get Weather Forecast

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_weather_forecast",
      "arguments": {
        "location": "Tokyo",
        "days": 5
      }
    }
  }'
```

### 4. Call Tool - Search Locations

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "search_locations",
      "arguments": {
        "query": "kong"
      }
    }
  }'
```

## Available Tools

1. **get_current_weather** - Get current weather for a specified location
   - Parameters: `location` (required)

2. **get_weather_forecast** - Get weather forecast for a specified location
   - Parameters: `location` (required), `days` (optional, default 3 days)

3. **get_weather_alerts** - Get weather alerts
   - Parameters: `location` (optional)

4. **search_locations** - Search supported locations
   - Parameters: `query` (required)

5. **get_weather_stats** - Get weather statistics
   - Parameters: None

## Supported Locations

- Hong Kong
- Tokyo, Osaka, Kyoto, Hiroshima, Sapporo, Fukuoka (Japan)
- London (UK)
- New York (USA)
- Sydney (Australia)

## Using with LangChain

If you want to use this MCP server with LangChain or other frameworks, you can create an HTTP client to send JSON-RPC requests to the `http://localhost:8080/mcp` endpoint.

### Python Example

```python
import requests
import json

def call_mcp_tool(method, params=None):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method
    }
    if params:
        payload["params"] = params
    
    response = requests.post(
        "http://localhost:8080/mcp",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    return response.json()

# List tools
tools = call_mcp_tool("tools/list")
print(json.dumps(tools, indent=2))

# Get weather
weather = call_mcp_tool("tools/call", {
    "name": "get_current_weather",
    "arguments": {"location": "Hong Kong"}
})
print(json.dumps(weather, indent=2))
```

### JavaScript/Node.js Example

```javascript
async function callMCPTool(method, params = null) {
    const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: method
    };
    if (params) {
        payload.params = params;
    }
    
    const response = await fetch('http://localhost:8080/mcp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    return await response.json();
}

// Usage example
(async () => {
    // List tools
    const tools = await callMCPTool('tools/list');
    console.log(JSON.stringify(tools, null, 2));
    
    // Get weather
    const weather = await callMCPTool('tools/call', {
        name: 'get_current_weather',
        arguments: { location: 'Hong Kong' }
    });
    console.log(JSON.stringify(weather, null, 2));
})();
```

## Advantages

1. **Simple**: No need for SSE or complex connection management
2. **Standard**: Uses standard HTTP POST requests
3. **Easy to test**: Can be tested with curl or any HTTP client
4. **Cross-platform**: Can be called from any programming language that supports HTTP
5. **Stateless**: Each request is independent

## Disadvantages

1. **Performance**: Each request requires establishing a new HTTP connection
2. **Feature limitations**: No support for push notifications or bidirectional communication
3. **No session management**: No persistent connections or session state

This simple HTTP MCP server is very suitable for testing, prototyping, or simple integration scenarios. 