import express from 'express';
import cors from 'cors';
import GTFSParser from './gtfsParser.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize GTFS parser
const gtfsParser = new GTFSParser();

app.use(cors());
app.use(express.json());

// Load GTFS data on startup
try {
  gtfsParser.loadData();
  console.log('✅ GTFS data loaded successfully');
} catch (error) {
  console.error('❌ Error loading GTFS data:', error);
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Backend!' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World API!' });
});

// Test endpoint to verify backend is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    gtfsLoaded: gtfsParser.routes.size > 0
  });
});

// GTFS API endpoints
app.get('/api/routes', (req, res) => {
  try {
    if (gtfsParser.routes.size === 0) {
      return res.status(500).json({ 
        error: 'GTFS data not loaded',
        message: 'The GTFS parser failed to load data on startup'
      });
    }
    
    const routes = gtfsParser.getAllRoutes();
    console.log(`📡 Sending ${routes.length} routes`);
    res.json(routes);
  } catch (error) {
    console.error('Error in /api/routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes', details: error.message });
  }
});

app.get('/api/routes/:routeId', (req, res) => {
  try {
    const { routeId } = req.params;
    const route = gtfsParser.routes.get(routeId);
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found', routeId });
    }
    
    res.json(route);
  } catch (error) {
    console.error('Error in /api/routes/:routeId:', error);
    res.status(500).json({ error: 'Failed to fetch route', details: error.message });
  }
});

app.get('/api/routes/:routeId/shape', (req, res) => {
  try {
    const { routeId } = req.params;
    const shape = gtfsParser.getRouteShape(routeId);
    
    if (!shape || shape.length === 0) {
      return res.status(404).json({ error: 'Route shape not found', routeId });
    }
    
    res.json(shape);
  } catch (error) {
    console.error('Error in /api/routes/:routeId/shape:', error);
    res.status(500).json({ error: 'Failed to fetch route shape', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});
