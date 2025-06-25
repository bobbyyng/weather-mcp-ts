# Weather MCP Server

A weather MCP (Model Context Protocol) server developed with TypeScript, providing simulated weather data and related functionality.

## Features

- 🌤️ Get current weather information
- 📅 Multi-day weather forecast
- ⚠️ Weather alert system
- 🔍 Location search functionality
- 📊 Weather statistics
- 🎭 Mock data support

## Install Dependencies

```bash
pnpm install
```

## 🚀 Usage

### Installation and Build
```bash
# Install dependencies
pnpm install

# Build project
pnpm run build
```

### Startup Methods

#### 1. MCP Protocol (stdio)
```bash
# For MCP client integration
pnpm start
```

#### 2. HTTP API Server 🆕
```bash
# Start HTTP server (default port 8080)
pnpm run start:http

# Start HTTP server (specified port 3001)
pnpm run start:http:3001

# Or specify port directly
node dist/http-server.js 8080
```

#### 3. Simple HTTP Server (Recommended) 🚀
```bash
# Start with default port 8080
pnpm run start:simple

# Start with specific ports
pnpm run start:simple:3000  # Development port
pnpm run start:simple:5000  # Alternative port
pnpm run start:simple:9000  # High port

# Or use the serve commands
pnpm run serve              # Default port 8080
pnpm run serve:dev          # Development port 3000
pnpm run serve:prod         # Production port 8080

# Or specify any port directly
node dist/simple-http-server.js 4000
```

### Dynamic Port Support

The simple HTTP server supports dynamic port configuration:

```bash
# Use any port you want
node dist/simple-http-server.js 3000
node dist/simple-http-server.js 5000
node dist/simple-http-server.js 9000
node dist/simple-http-server.js 12345
```

The server will automatically:
- Use port 8080 as default if no port is specified
- Accept any valid port number as a command line argument
- Display the actual port in the startup message and documentation

### HTTP API Usage Examples

Once the HTTP server is started, you can use it in the following ways:

#### Browser Access
- Open `http://localhost:8080` to view API documentation
- Click links directly to test various APIs

#### curl Commands
```bash
# Get current weather for Hong Kong
curl "http://localhost:8080/weather?location=Hong Kong"

# Get 5-day weather forecast for Tokyo
curl "http://localhost:8080/forecast?location=Tokyo&days=5"

# Get weather alerts
curl "http://localhost:8080/alerts?location=Hong Kong"

# Search locations
curl "http://localhost:8080/locations?q=kong"

# Get statistics
curl "http://localhost:8080/stats"
```

#### JavaScript/Fetch
```javascript
// Get weather data
const response = await fetch('http://localhost:8080/weather?location=Tokyo');
const weather = await response.json();
console.log(weather);
```

### Development Mode
```bash
# Watch mode compilation
pnpm run dev
```

## Available Tools

### 1. get_current_weather
Get current weather information for a specified location

**Parameters:**
- `location` (string): Location name

**Example:**
```json
{
  "location": "Hong Kong"
}
```

### 2. get_weather_forecast
Get weather forecast for a specified location

**Parameters:**
- `location` (string): Location name
- `days` (number, optional): Forecast days (1-7 days, default 3 days)

**Example:**
```json
{
  "location": "Tokyo",
  "days": 5
}
```

### 3. get_weather_alerts
Get weather alert information

**Parameters:**
- `location` (string, optional): Location name

**Example:**
```json
{
  "location": "Hong Kong"
}
```

### 4. search_locations
Search supported locations

**Parameters:**
- `query` (string): Search keyword

**Example:**
```json
{
  "query": "kong"
}
```

### 5. get_weather_stats
Get weather statistics

**Parameters:** None

## Supported Locations

Currently supports detailed weather data for the following locations:
- Hong Kong
- Tokyo, Osaka, Kyoto, Hiroshima, Sapporo, Fukuoka (Japan)
- London (UK)
- New York (USA)
- Sydney (Australia)

Other locations will return randomly generated mock data.

## Technical Specifications

- **Language**: TypeScript
- **Package Manager**: pnpm
- **MCP SDK**: @modelcontextprotocol/sdk
- **Node.js**: >=18

## Project Structure

```
src/
├── index.ts              # MCP server main file (stdio)
├── http-server.ts        # HTTP API server
├── simple-http-server.ts # Simple HTTP server
├── weather-service.ts    # Weather service logic
├── mock-data.ts          # Mock data
└── types.ts              # TypeScript type definitions
```

## HTTP API Endpoints

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/` | GET | - | API documentation page |
| `/mcp` | POST | JSON-RPC 2.0 | MCP protocol endpoint |
| `/weather` | GET | location (required) | Get current weather |
| `/forecast` | GET | location (required), days (optional) | Get weather forecast |
| `/alerts` | GET | location (optional) | Get weather alerts |
| `/locations` | GET | q (required) | Search locations |
| `/stats` | GET | - | Get statistics |

## License

MIT License 