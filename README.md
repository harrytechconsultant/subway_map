# Hello World App

A simple Hello World application built with React, Node.js, and Bun, featuring an interactive map centered around New York City.

## Features

- React frontend with Vite
- Node.js backend with Express
- Bun as package manager
- Interactive Leaflet map centered on NYC
- Sample subway station markers
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
├── backend/              # Node.js backend
│   ├── package.json
│   └── src/
│       └── index.js      # Express server
└── frontend/             # React frontend
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx      # React entry point
        ├── App.jsx       # Main App component
        ├── App.css       # Styles
        └── components/
            └── Map.jsx   # Leaflet map component
```

## Development

- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:3001
- API requests from frontend are proxied to backend automatically

## Map Features

- **Center**: New York City (40.7128°N, 74.0060°W)
- **Zoom Level**: 12 (shows most of Manhattan)
- **Tiles**: OpenStreetMap
- **Markers**: Sample subway stations with popup information
- **Interactive**: Click markers to see station details

## API Endpoints

- `GET /` - Welcome message
- `GET /api/hello` - Hello World message

The frontend automatically fetches from the backend API and displays the message, along with an interactive map of NYC subway stations.
