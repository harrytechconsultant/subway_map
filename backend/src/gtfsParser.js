import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GTFSParser {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/gtfs_subway');
    this.routes = new Map();
    this.trips = new Map();
    this.shapes = new Map();
    this.routeTrips = new Map(); // Map route_id to trip_ids
  }

  // Parse CSV file and return array of objects
  parseCSV(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      // Parse CSV with proper handling of quoted fields
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };
      
      const headers = parseCSVLine(lines[0]);
      
      return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return obj;
      });
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return [];
    }
  }

  // Load all GTFS data
  loadData() {
    console.log('Loading GTFS data...');
    
    // Load routes
    const routesData = this.parseCSV(path.join(this.dataPath, 'routes.txt'));
    routesData.forEach(route => {
      this.routes.set(route.route_id, {
        id: route.route_id,
        shortName: route.route_short_name,
        longName: route.route_long_name,
        color: route.route_color || '#000000',
        textColor: route.route_text_color || '#FFFFFF'
      });
    });

    // Load trips and create route-trip mapping
    const tripsData = this.parseCSV(path.join(this.dataPath, 'trips.txt'));
    tripsData.forEach(trip => {
      if (!this.routeTrips.has(trip.route_id)) {
        this.routeTrips.set(trip.route_id, []);
      }
      this.routeTrips.get(trip.route_id).push(trip.trip_id);
      
      if (!this.trips.has(trip.trip_id)) {
        this.trips.set(trip.trip_id, {
          id: trip.trip_id,
          routeId: trip.route_id,
          shapeId: trip.shape_id,
          direction: trip.direction_id,
          headsign: trip.trip_headsign
        });
      }
    });

    // Load shapes data
    const shapesData = this.parseCSV(path.join(this.dataPath, 'shapes.txt'));
    shapesData.forEach(shape => {
      if (!this.shapes.has(shape.shape_id)) {
        this.shapes.set(shape.shape_id, []);
      }
      this.shapes.get(shape.shape_id).push({
        lat: parseFloat(shape.shape_pt_lat),
        lon: parseFloat(shape.shape_pt_lon),
        sequence: parseInt(shape.shape_pt_sequence)
      });
    });

    // Sort shapes by sequence
    this.shapes.forEach(points => {
      points.sort((a, b) => a.sequence - b.sequence);
    });

    console.log(`Loaded ${this.routes.size} routes, ${this.trips.size} trips, ${this.shapes.size} shapes`);
  }

  // Get all routes summary
  getAllRoutes() {
    return Array.from(this.routes.values()).map(route => {
      const routeTripIds = this.routeTrips.get(route.id);
      const hasShape = routeTripIds && routeTripIds.length > 0 && 
        this.trips.get(routeTripIds[0])?.shapeId && 
        this.shapes.get(this.trips.get(routeTripIds[0]).shapeId);
      
      return {
        id: route.id,
        shortName: route.shortName,
        longName: route.longName,
        color: route.color,
        textColor: route.textColor,
        hasShape: !!hasShape
      };
    });
  }

  // Get shape coordinates for a route
  getRouteShape(routeId) {
    const routeTripIds = this.routeTrips.get(routeId);
    if (!routeTripIds || routeTripIds.length === 0) return null;

    // Get the first trip for this route
    const firstTripId = routeTripIds[0];
    const trip = this.trips.get(firstTripId);
    if (!trip || !trip.shapeId) return null;

    const shapePoints = this.shapes.get(trip.shapeId);
    if (!shapePoints) return null;

    return shapePoints.map(point => [point.lat, point.lon]);
  }
}

export default GTFSParser;
