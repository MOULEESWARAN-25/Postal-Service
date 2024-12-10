import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Zustand Store for Persistent GeoJSON
const useGeojsonStore = create(persist(
  (set) => ({
    savedGeojson: null,
    setSavedGeojson: (geojsonData) => set({ savedGeojson: geojsonData }),
    clearSavedGeojson: () => set({ savedGeojson: null })
  }),
  {
    name: 'geojson-storage',
    getStorage: () => localStorage,
  }
));

// Navigation Component
const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">GeoTracker</div>
      <nav className="space-x-4">
        <Link href="/" className="hover:text-blue-200">Map</Link>
        <Link href="/draw" className="hover:text-blue-200">Draw</Link>
      </nav>
    </header>
  );
};

// Leaflet Map Component
const LeafletMap = () => {
  const { savedGeojson, setSavedGeojson } = useGeojsonStore();
  const mapRef = React.useRef(null);
  const [map, setMap] = useState(null);

  // Sample small box GeoJSON
  const smallBoxGeojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Small Box" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-74.005, 40.712],  // Southwest corner
            [-73.995, 40.712],  // Southeast corner
            [-73.995, 40.720],  // Northeast corner
            [-74.005, 40.720],  // Northwest corner
            [-74.005, 40.712]   // Close the polygon
          ]]
        }
      }
    ]
  };

  useEffect(() => {
   if (!mapRef.current) return;

    // Initialize map
    const leafletMap = L.map(mapRef.current).setView([40.716, -74.000], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Render GeoJSON (either saved or default)
    const geoJsonToRender = savedGeojson || smallBoxGeojson;

    // Add GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoJsonToRender, {
      style: (feature) => ({
        color: '#ff7800',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.3
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          layer.bindPopup(JSON.stringify(feature.properties));
        }
      }
    }).addTo(leafletMap);

    // Fit map to GeoJSON bounds
    try {
      leafletMap.fitBounds(geoJsonLayer.getBounds());
    } catch (error) {
      console.warn('Could not fit bounds:', error);
    }

    // Save the rendered GeoJSON
    setSavedGeojson(geoJsonToRender);

    // Store map instance
    setMap(leafletMap);

    // Cleanup
    return () => {
      leafletMap.remove();
    };
  }, [savedGeojson, setSavedGeojson]);

  // Handle map resizing
  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  return (
    <div className="h-[calc(100vh-64px)]">
      <div 
        ref={mapRef} 
        className="h-full w-full"
      />
    </div>
  );
};

// Main Page Component
const MapPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <LeafletMap />
    </div>
  );
};

export default MapPage;






















