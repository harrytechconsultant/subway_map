import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  // Parse hex values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  console.log(hex);
  console.log(`rgb(${r}, ${g}, ${b})`);
  return `rgb(${r}, ${g}, ${b})`;
}

function SubwayMap() {
  const [routes, setRoutes] = useState([]);
  const [routeShapes, setRouteShapes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New York City coordinates
  const nycCenter = [40.7128, -74.0060];

  // Backend URL - try proxy first, fallback to direct URL
  const API_BASE = process.env.NODE_ENV === 'development' 
    ? '/api' 
    : 'http://localhost:3001/api';

  useEffect(() => {
    fetchAllRoutes();
  }, []);

  const fetchAllRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all routes from:', API_BASE);
      const response = await fetch(`${API_BASE}/routes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const routesData = await response.json();
      console.log('Routes fetched successfully:', routesData.length, 'routes');
      setRoutes(routesData);
      
      // Fetch shapes for all routes
      await fetchAllRouteShapes(routesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(`Failed to fetch routes: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchAllRouteShapes = async (routesData) => {
    const shapesData = {};
    
    for (const route of routesData) {
      try {
        console.log('Fetching shape for route:', route.id);
        const response = await fetch(`${API_BASE}/routes/${route.id}/shape`);
        
        if (response.ok) {
          const shape = await response.json();
          shapesData[route.id] = shape;
          console.log(`Route ${route.id}: ${shape.length} shape points`);
        }
      } catch (err) {
        console.error(`Error fetching shape for route ${route.id}:`, err);
      }
    }
    
    setRouteShapes(shapesData);
  };

  if (loading) {
    return (
      <div className="map-container">
        <h2>Loading Subway Routes...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container">
        <h2>Error Loading Routes</h2>
        <p>{error}</p>
        <button onClick={fetchAllRoutes}>Retry</button>
      </div>
    );
  }

  return (
    <div className="map-container">
      <h2>New York City Subway System</h2>
      <p>All {routes.length} subway routes displayed</p>
      
      {/* Map */}
      <MapContainer 
        center={nycCenter} 
        zoom={10} 
        style={{ height: '700px', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        {/* Simple, clean map tiles with just land outlines */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Draw all route lines using shape data */}
        {routes.map(route => {
          const shape = routeShapes[route.id];
          if (shape && shape.length > 1) {
            return (
              <Polyline
                key={route.id}
                positions={shape}
                color={route.color ? hexToRgb(route.color) : 'red'}
                // color="rgb(255, 0, 0)"
                weight={4}
                opacity={0.8}
                smoothFactor={1}
              />
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}

export default SubwayMap;
