# Hello World App

A simple Hello World application built with React, Node.js, and Bun, featuring an interactive subway map with real GTFS data centered around New York City.

## Features

- React frontend with Vite
- Node.js backend with Express
- Bun as package manager
- Interactive Leaflet map centered on NYC
- **Real GTFS subway data integration**
- **Dynamic route visualization with polylines**
- **Interactive route selection with color-coded buttons**
- **Station markers with detailed information**
- Hot reloading for development
- API proxy configuration

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- [Node.js](https://nodejs.org/) (version 16 or higher)

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development servers:
   ```bash
   bun run dev
   ```

This will start both the frontend (port 3000) and backend (port 3001) servers concurrently.

## Available Scripts

- `bun run dev` - Start both frontend and backend in development mode
- `bun run start` - Start only the backend server
- `bun run build` - Build the frontend for production

## Project Structure

```
├── package.json          # Root package.json with workspaces
├── data/
│   └── gtfs_subway/      # GTFS subway data files
│       ├── routes.txt    # Subway route definitions
│       ├── stops.txt     # Station locations
│       ├── trips.txt     # Trip schedules
│       └── stop_times.txt # Stop timing data
├── backend/              # Node.js backend
│   ├── package.json
│   └── src/
│       ├── index.js      # Express server with GTFS API
│       └── gtfsParser.js # GTFS data parser service
└── frontend/             # React frontend
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx      # React entry point
        ├── App.jsx       # Main App component
        ├── App.css       # Styles
        └── components/
            └── Map.jsx   # Interactive subway map component
```

## Development

- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:3001
- API requests from frontend are proxied to backend automatically

## Map Features

- **Center**: New York City (40.7128°N, 74.0060°W)
- **Zoom Level**: 11 (shows NYC metro area)
- **Tiles**: OpenStreetMap
- **Real Data**: GTFS subway data from MTA
- **Interactive Routes**: Click route buttons to display subway lines
- **Color-Coded**: Each route uses official MTA colors
- **Station Markers**: Click for detailed stop information
- **Route Polylines**: Visual representation of subway routes

## GTFS Data Integration

The app integrates real GTFS (General Transit Feed Specification) data from the MTA:
- **Routes**: 32 subway routes with official colors and names
- **Stops**: 1,499 stations with precise coordinates
- **Trips**: Real-time schedule information
- **Stop Times**: Arrival and departure times for each station

## API Endpoints

- `GET /` - Welcome message
- `GET /api/hello` - Hello World message
- `GET /api/routes` - List all subway routes
- `GET /api/routes/:routeId` - Get specific route with stops
- `GET /api/routes/:routeId/stops` - Get stops for a specific route
- `GET /api/stops` - Get all subway stations

## How to Use

1. **Select a Route**: Click on any colored route button (1, 2, 3, 4, 5, 6, 7, A, B, C, D, E, F, G, J, L, M, N, Q, R, W, Z, S, SI)
2. **View Route**: The selected route will be drawn on the map with a colored line
3. **Explore Stops**: Click on station markers to see detailed information
4. **Route Info**: View route details below the map
5. **Deselect**: Click the same route button again to hide it

The frontend automatically fetches from the backend API and displays real subway data, along with an interactive map of NYC subway routes.
