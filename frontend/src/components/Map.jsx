import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map() {
  // New York City coordinates
  const nycCenter = [40.7128, -74.0060];
  
  // Sample subway stations in NYC
  const stations = [
    { name: 'Times Square', coords: [40.7580, -73.9855], lines: 'NQRW' },
    { name: 'Grand Central', coords: [40.7527, -73.9772], lines: '4567' },
    { name: 'Union Square', coords: [40.7359, -73.9911], lines: 'NQRWL456' },
    { name: 'Penn Station', coords: [40.7505, -73.9934], lines: '123ACE' },
    { name: 'Brooklyn Bridge', coords: [40.7061, -73.9969], lines: '456' }
  ];

  return (
    <div className="map-container">
      <h2>New York City Subway Map</h2>
      <MapContainer 
        center={nycCenter} 
        zoom={12} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {stations.map((station, index) => (
          <Marker key={index} position={station.coords}>
            <Popup>
              <div>
                <h3>{station.name}</h3>
                <p>Subway Lines: {station.lines}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
