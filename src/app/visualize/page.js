// components/LeafletMap.js
"use client"
import { motion } from "framer-motion";
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { MapContainer, TileLayer, GeoJSON, Popup, Marker } from "react-leaflet";
const PopupContent = lazy(() => import("../components/popup/popupcontent"));
import "leaflet/dist/leaflet.css";
import L, { popup } from "leaflet";
import axios from "axios";
import Loader from "../components/assets/loader";
import {
  ArrowLeft,
  CircleX,
  Layers,
  Mail,
  Map,
  MapPin,
  MapPinned,
  X,
} from "lucide-react";
import Searchbar from "../components/assets/searchbar";
import CustomZoombuttons from "../components/assets/customZoomButtons";
import ZoomToCenterButton from "../components/assets/zoomTocentre";
import CustomerSegmentation from "../components/Charts/CustomerSegmentation";
import SalesOverviewChart from "../components/Charts/SalesOverviewChart";
import useMapStore from "@/store/useMapStore";
import Link from "next/link";
import { set } from "zod";

const MapComponent = () => {
  //custom icon
  const customIcon = new L.Icon({
    iconUrl: "/images/marker.png", // URL of your custom marker image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon that will correspond to the marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });

  const mapRef = useRef();
  const { mapState, setMapState } = useMapStore();

  const [verticalbar, setVerticalbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility
  const sidebarRef = useRef(null); // Reference for the sidebar element
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };
  const verticalSidebar = () => {
    setVerticalbar(!verticalbar);
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false); // Close the sidebar if clicked outside
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navItems = [
    {
      img: "/images/nomap.png", // Image for no map
      label: "No map",
      tileUrl: "",
    },
    {
      img: "/images/cartoBW.png", // Image for Carto black and white map
      label: "Carto",
      tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    },
    {
      img: "/images/geo.png", // Image for Esri
      label: "Esri",
      tileUrl:
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    {
      icon: <Layers className="w-5 h-5" />, // JSX icon for "More"
      label: "More",
    },
  ];
  const verticalTiles = [
    {
      img: "/images/street.png", // Image for streets
      label: "Streets",
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      img: "/images/terrian.png", // Image for terrain
      label: "Terrain",
      tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
    {
      img: "images/thunderforest.png", // Image for Thunderforest
      label: "forest1",
      tileUrl:
        "https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png",
    },
    {
      img: "images/thunderforest2.png", // Image for Thunderforest Outdoors
      label: "forest2",
      tileUrl: "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
    },

    {
      img: "images/night.png", // Replace with your night map icon
      label: "Night ",
      tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    },
    {
      img: "images/thunderforest3.png", // Replace with your cycling map icon
      label: "Cycling",
      tileUrl: "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
    },
    {
      img: "images/transport.png", // Replace with your transport map icon
      label: "Transport",
      tileUrl: "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",
    },
  ];

  const handleLocationSelected = (locationDetails) => {
    console.log("Selected location:", locationDetails);
    setMapState({ searchPosition: locationDetails.position });
    setMapState({
      searchDetails: {
        name: locationDetails.name,
        district: locationDetails.district,
        state: locationDetails.state,
      },
    });

    // Center the map on the selected location
    if (mapRef.current) {
      mapRef.current.setView(
        [locationDetails.position.lat, locationDetails.position.lng],
        10
      );
    }
    setMapState({ selectedState: locationDetails.state });
  };
  useEffect(() => {
    if (
      mapState.selectedState &&
      mapState.searchPosition &&
      mapState.searchDetails
    ) {
      console.log("Selected state:", mapState.selectedState);
      loadSubdistrictsPostals(mapState.searchDetails.district); // Or whatever logic you want to trigger on state change
    }
  }, [mapState.selectedState]);

  // google apis implementation
  useEffect(() => {
    console.log(mapState.selectedPostalDetails);
  }, [mapState.selectedPostalDetails]);
  useEffect(() => {
    console.log(mapState.selectedSubdistrict);
  }, [mapState.selectedSubdistrict]);

  // remove the postal details option
  useEffect(() => {
    const fetchCoordinates = async () => {
      console.log("car", mapState.selectedPostalDetails);
      try {
        const response = await fetch(
          "http://localhost:3000/api/getgoogleplaces",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: `${
                mapState.selectedSubdistrict?.name ||
                mapState.selectedPostalDetails?.name
              } , ${mapState.selectedDistrict}, ${mapState.selectedState}`,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data: ", data);

          // Update state with the fetched coordinates
          setMapState({ postOfficeCoordinates: data || [] });
        } else {
          console.error("Error fetching coordinates:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [mapState.selectedPostalDetails, mapState.selectedSubdistrict]);

  useEffect(() => {
    console.log(mapState.postOfficeCoordinates);
  }, [mapState.postOfficeCoordinates]);

  const [history, setHistory] = useState([]);

  //some error is causing when loading the map again
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const center = [22.9734, 78.6569];
  const zoom = 4.5;

  const goBack = () => {
    if (history.length === 0) return;

    const lastAction = history.pop();
    setHistory([...history]);

    if (lastAction?.level === "subdistrict") {
      if (history.length > 0) {
        const previousDistrictAction = history.find(
          (item) => item.level === "district"
        );
        if (previousDistrictAction) {
          setMapState({ districtGeoJSON: previousDistrictAction.data });
          setMapState({ subdistrictGeoJSON: null });
          setMapState({ districtPostalsGeoJSON: null });
          setMapState({ selectedSubdistrict: null });
        }
      } else {
        setMapState({ districtGeoJSON: null });
        setMapState({ subdistrictGeoJSON: null });
        setMapState({ districtPostalsGeoJSON: null });
        setMapState({ selectedSubdistrict: null });
      }
    } else if (lastAction?.level === "postal") {
      if (history.length > 0) {
        const previousSubdistrictAction = history.find(
          (item) => item.level === "subdistrict"
        );
        if (previousSubdistrictAction) {
          setMapState({ subdistrictGeoJSON: previousSubdistrictAction.data });
          setMapState({ districtPostalsGeoJSON: null });
          setMapState({ selectedSubdistrict: null });
        }
      } else {
        setMapState({ districtPostalsGeoJSON: null });
        setMapState({ selectedSubdistrict: null });
      }
    } else if (lastAction?.level === "district") {
      setMapState({ districtGeoJSON: null });
      setMapState({ subdistrictGeoJSON: null });
      setMapState({ districtPostalsGeoJSON: null });
      setMapState({ selectedDistrict: null });
      setMapState({ selectedState: null });
    } else if (lastAction?.level === "state") {
      setMapState({ districtGeoJSON: null });
      setMapState({ subdistrictGeoJSON: null });
      setMapState({ districtPostalsGeoJSON: null });
      setMapState({ selectedState: null });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    if (!window || !document) {
      return;
    }

    const fetchGeoData = async () => {
      try {
        const response = await axios.get("api/states");
        setMapState({ geoData: response.data });
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeoData();
    return () => {
      const mapContainer = document.getElementById("leaflet-map-container");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
    };
  }, []);

  // const stateColors = useMemo(() => {
  //   const colors = {};
  //   if (geoData) {
  //     geoData.features.forEach((feature) => {
  //       const stateName = feature.properties.ST_NM;
  //       colors[stateName] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  //     });
  //   }
  //   return colors;
  // }, [geoData]);
  const stateColors = useMemo(() => {
    const skyBluePalette = [
      "#87CEEB", // Sky Blue
      "#87CEFA", // Light Sky Blue
      "#B0E0E6", // Powder Blue
      "#ADD8E6", // Light Blue
      "#4682B4", // Steel Blue
      "#5F9EA0", // Cadet Blue
      "#00CED1", // Dark Turquoise
      "#48D1CC", // Medium Turquoise
      "#76EEC6", // Pale Turquoise
      "#AFEEEE", // Pale Turquoise
    ];

    const colors = {};
    if (mapState.geoData) {
      mapState.geoData.features.forEach((feature, index) => {
        const stateName = feature.properties.ST_NM;
        // Use modulo to cycle through the palette if more states than colors
        colors[stateName] = skyBluePalette[index % skyBluePalette.length];
      });
    }
    return colors;
  }, [mapState.geoData]);
  const stateStyle = (feature) => ({
    fillColor: stateColors[feature.properties.ST_NM],
    weight: 2,
    opacity: 1,
    color:
      mapState.selectedState === feature.properties.ST_NM ? "green" : "white",
    fillOpacity: 0.7,
  });
  const onEachStateFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        const latlng = e.latlng;
        setMapState({ selectedState: feature.properties.ST_NM });
        setMapState({ selectedPosition: latlng });
        setHistory((prev) => [...prev, { level: "state" }]);

        try {
          const bounds = layer.getBounds();
          mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
        } catch (err) {
          console.error("Error fitting bounds:", err);
        }
      },
      mouseover: (e) => {
        layer.setStyle({
          weight: 3,
          color: "#666",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        layer.setStyle(stateStyle(feature));
      },
    });

    // Add popup with state name
    layer.bindPopup(feature.properties.ST_NM);
  };

  // Load districts
  const loadDistricts = async (stateName) => {
    try {
      setIsLoading(true);
      // Use the correct API route path
      const response = await axios.get(
        `/api/districts/${encodeURIComponent(stateName)}`
      );
      console.log(response.data);
      setMapState({ districtGeoJSON: response.data });
      setMapState({ subdistrictGeoJSON: null });

      // Fit bounds to the loaded districts
      const bounds = L.geoJSON(response.data).getBounds();
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });

      // Update history
      setHistory((prev) => [
        ...prev,
        { level: "district", data: response.data },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading district data:", error);
      // Log the full error for more details
      console.error("Full error:", error.response?.data || error.message);
      setError(`Failed to load districts for ${stateName}`);
      setIsLoading(false);
    }
  };
  const districtStyle = {
    fillColor: "orange",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
  const onEachDistrictFeature = (feature, layer) => {
    const districtName = feature.properties.dtname;
    layer.bindPopup(districtName);

    // Add hover effects
    layer.on("mouseover", () => {
      layer.setStyle({
        weight: 5, // Increase the border width
        color: "#3388ff", // Border color on hover
        opacity: 1,
      });
    });

    layer.on("mouseout", () => {
      layer.setStyle({
        weight: 2, // Reset border width
        color: "#3388ff", // Reset border color
        opacity: 0.7, // Reset opacity
      });
    });

    // Click event
    layer.on("click", (e) => {
      const latlng = e.latlng;
      setMapState({ selectedDistrict: districtName });
      setMapState({ selectedPosition: latlng });

      try {
        const bounds = layer.getBounds();
        mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  //load subdistricts
  const loadSubdistricts = async (districtName) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/subdistricts/${mapState.selectedState}/${districtName}`
      );

      // Filter subdistricts for the specific district
      const filteredFeatures = response.data.features.filter(
        (feature) =>
          feature.properties.dtname.toLowerCase() === districtName.toLowerCase()
      );

      if (!filteredFeatures.length) {
        alert("No subdistricts found for this district.");
        return;
      }

      setMapState({
        subdistrictGeoJSON: {
          type: "FeatureCollection",
          features: filteredFeatures,
        },
      });

      setMapState({ districtGeoJSON: null });

      // Fit bounds to the loaded subdistricts
      const bounds = L.geoJSON(filteredFeatures).getBounds();
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });

      // Update history
      setHistory((prev) => [
        ...prev,
        {
          level: "subdistrict",
          data: { type: "FeatureCollection", features: filteredFeatures },
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading subdistrict data:", error);
      setError(`Failed to load subdistricts for ${districtName}`);
      setIsLoading(false);
    }
  };
  const subdistrictStyle = {
    fillColor: "blue",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
  const onEachSubdistrictFeature = (feature, layer) => {
    const subdistrictName = feature.properties.sdtname || "Unnamed Subdistrict";
    layer.bindPopup(subdistrictName);

    // Hover effects
    layer.on("mouseover", () => {
      layer.setStyle({
        weight: 5, // Thicker border on hover
        color: "#FF5733", // Highlight color for the border
        opacity: 1, // Full opacity
      });
    });

    layer.on("mouseout", () => {
      layer.setStyle({
        weight: 2, // Reset to default border width
        color: "#FF5733", // Reset to default border color
        opacity: 0.7, // Reset to default opacity
      });
    });

    // Click functionality
    layer.on("click", (e) => {
      const latlng = e.latlng;
      setMapState({
        selectedSubdistrict: { name: subdistrictName, position: latlng },
      });

      try {
        const bounds = layer.getBounds();
        mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  // Load postal boundaries
  const loadSubdistrictsPostals = async (districtName) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/postals/${mapState.selectedState}/${districtName}`
      );

      // Filter subdistricts for the specific district
      const filteredFeatures = response.data.features.filter(
        (feature) =>
          feature.properties.district.toLowerCase() ===
          districtName.toLowerCase()
      );

      if (!filteredFeatures.length) {
        alert("No subdistricts found for this district.");
        return;
      }

      setMapState({
        districtPostalsGeoJSON: {
          type: "FeatureCollection",
          features: filteredFeatures,
        },
      });
      setMapState({ districtGeoJSON: null });
      setMapState({ geoData: null });
      // Fit bounds to the loaded subdistricts
      const bounds = L.geoJSON(filteredFeatures).getBounds();
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });

      // Update history
      setHistory((prev) => [
        ...prev,
        {
          level: "subdistrict",
          data: { type: "FeatureCollection", features: filteredFeatures },
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading posatl boundaries data:", error);
      setError(`Failed to load posatl boundaries for ${districtName}`);
      setIsLoading(false);
    }
  };
  const postalStyle = {
    fillColor: "pink",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
  const onEachPostalFeature = (feature, layer) => {
    const areaname = feature.properties.officename || "Unnamed Area";
    const pincode = feature.properties.pincode || "Pincode not found";

    // Bind popup with both area name and pincode
    layer.bindPopup(
      `<div>
        <strong>Area:</strong> ${areaname}<br />
        <strong>Pincode:</strong> ${pincode}
      </div>`
    );

    // Hover effects
    layer.on("mouseover", () => {
      layer.setStyle({
        weight: 5, // Thicker border on hover
        color: "#1E90FF", // Highlight color (customize as needed)
        opacity: 1, // Full opacity
      });
    });

    layer.on("mouseout", () => {
      layer.setStyle({
        weight: 2, // Reset border width
        color: "#1E90FF", // Reset color
        opacity: 0.7, // Reset opacity
      });
    });

    // Click functionality
    layer.on("click", (e) => {
      const latlng = e.latlng;
      setMapState({
        selectedPostalDetails: {
          name: areaname,
          pincode: pincode,
          position: latlng,
        },
      });

      try {
        const bounds = layer.getBounds();
        mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  return (
    <div>
      {isLoading && <Loader />}

      <Searchbar onLocationSelected={handleLocationSelected} />
      <MapContainer
        id="leaflet-map-container"
        center={center}
        zoom={zoom}
        style={{ height: "100vh", width: "100vw", backgroundColor: "white" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url={mapState.activeMapTile}
          attribution='&copy; <a href="https://carto.com">CartoDB</a> contributors'
        />

        <CustomZoombuttons />
        <ZoomToCenterButton center={center} zoom={zoom} />

        {!mapState.districtGeoJSON &&
          !mapState.subdistrictGeoJSON &&
          mapState.geoData && (
            <GeoJSON
              data={mapState.geoData}
              style={stateStyle}
              onEachFeature={onEachStateFeature}
            />
          )}
        {mapState.selectedState && mapState.selectedPosition && (
          <Popup
            position={mapState.selectedPosition}
            onClose={() => setMapState({ selectedState: null })}
            className="custom-popup"
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2 text-blue-500" size={20} />
                State Information
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Selected State:
                <span className="font-bold ml-2 text-gray-800">
                  {mapState.selectedState}
                </span>
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => loadDistricts(mapState.selectedState)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none gap-4 focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
              >
                <MapPinned />
                Show Districts
              </button>
            </div>
          </Popup>
        )}

        {mapState.districtGeoJSON && (
          <GeoJSON
            data={mapState.districtGeoJSON}
            style={districtStyle}
            onEachFeature={onEachDistrictFeature}
          />
        )}
        {mapState.selectedDistrict && mapState.selectedPosition && (
          <Popup
            position={mapState.selectedPosition}
            onClose={() => setMapState({ selectedDistrict: null })}
            className="custom-popup"
          >
            <div className="flex justify-between items-center mb-1 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2 text-blue-500" size={20} />
                District Information
              </h3>
              <button
                onClick={() => setMapState({ selectedDistrict: null })}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Selected District:
                <span className="font-bold ml-2 text-gray-800">
                  {mapState.selectedDistrict}
                </span>
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={() => loadSubdistricts(mapState.selectedDistrict)}
                  className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Map className="mr-2" size={18} />
                  Show Subdistricts
                </button>

                <button
                  onClick={() =>
                    loadSubdistrictsPostals(mapState.selectedDistrict)
                  }
                  className="flex items-center justify-center bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <Mail className="mr-2" size={18} />
                  Show Postal Bounds
                </button>
              </div>

              <button
                onClick={goBack}
                className="flex items-center justify-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <ArrowLeft className="mr-2" size={18} />
                Go Back
              </button>
            </div>
          </Popup>
        )}

        {mapState.subdistrictGeoJSON && (
          <GeoJSON
            data={mapState.subdistrictGeoJSON}
            style={subdistrictStyle}
            onEachFeature={onEachSubdistrictFeature}
          />
        )}
        {mapState.selectedSubdistrict &&
          mapState.selectedSubdistrict.position && (
            <Popup
              position={mapState.selectedSubdistrict.position}
              onClose={() => setMapState({ selectedSubdistrict: null })}
              className="custom-popup"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="mr-2 text-blue-500" size={20} />
                  Subdistrict Details
                </h3>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Selected Subdistrict:
                  <span className="font-bold ml-2 text-gray-800">
                    {mapState.selectedSubdistrict.name}
                  </span>
                </p>

                {/* Optional: Add more details if available */}
                {mapState.selectedSubdistrict.selectedPostalDetails && (
                  <div className="bg-gray-100 rounded-md p-2 mt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Postal Details
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {Object.entries(
                        mapState.selectedSubdistrict.selectedPostalDetails
                      ).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span className="font-semibold capitalize">
                            {key}:
                          </span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex">
                <button
                  onClick={goBack}
                  className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Go Back
                </button>
              </div>
            </Popup>
          )}

        {mapState.districtPostalsGeoJSON && (
          <GeoJSON
            data={mapState.districtPostalsGeoJSON}
            style={postalStyle}
            onEachFeature={onEachPostalFeature}
          />
        )}
        {mapState.selectedPostalDetails &&
          mapState.selectedPostalDetails.position && (
            <Popup
              position={mapState.selectedPostalDetails.position}
              onClose={() => setMapState({ selectedSubdistrict: null })}
              className="custom-popup"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Mail className="mr-2 text-blue-500" size={20} />
                  Postal Area Details
                </h3>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Selected Postal Area:
                  <span className="font-bold ml-2 text-gray-800">
                    {mapState.selectedPostalDetails.name}
                  </span>
                </p>

                {/* Optional: Add more postal details if available */}
                {mapState.selectedPostalDetails && (
                  <div className="bg-gray-100 rounded-md p-2 mt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Postal Information
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {Object.entries(mapState.selectedPostalDetails)
                        .filter(([key]) => key !== "position" && key !== "name")
                        .map(([key, value]) => (
                          <li key={key} className="flex justify-between">
                            <span className="font-semibold capitalize">
                              {key}:
                            </span>
                            <span>{value}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex">
                <button
                  onClick={goBack}
                  className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Go Back
                </button>
              </div>
            </Popup>
          )}

        {mapState.searchPosition && (
          <Marker
            icon={customIcon}
            position={[
              mapState.searchPosition.lat,
              mapState.searchPosition.lng,
            ]}
          >
            <Popup>
              <strong>{mapState.searchDetails?.name}</strong>
              <br />
              {mapState.searchDetails?.district && (
                <span>District: {mapState.searchDetails.district}</span>
              )}
              <br />
              {mapState.searchDetails?.state && (
                <span>State: {mapState.searchDetails.state}</span>
              )}
            </Popup>
          </Marker>
        )}

        {mapState.postOfficeCoordinates &&
          mapState.postOfficeCoordinates.length > 0 &&
          mapState.postOfficeCoordinates.map((marker, index) => (
            <Marker
              key={index}
              icon={customIcon}
              position={[marker.location.lat, marker.location.lng]}
            >
              <Popup>
                <strong>{marker.name}</strong>
                <br />
                {marker.vicinity}
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md z-[1000]">
        <div
          className="border-2 relative shadow-2xl  bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60  border-gray-100

        w-[75px] h-[75px]  cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0000 0%, #7087c1 100%)",
          }}
          onClick={toggleSidebar} // Handle click to toggle sidebar
        >
          <img
            src="/images/globe.png"
            alt=""
            className="rounded-lg w-full h-full"
          />

          <p className=" absolute top-2/3 left-1/2 flex flex-col justify-center items-center  transform -translate-x-1/2 -translate-y-1/2">
            <Layers />
            <span className="text-md font-semibold">layers</span>
          </p>
        </div>
        {/* Side div that appears on click */}
        <div
          ref={sidebarRef} // Attach ref to the sidebar
          className={`absolute top-0 left-[90px] p-3  h-[75px]  bg-white shadow-lg rounded-lg  flex  items-center justify-center transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10 pointer-events-none"
          }`}
        >
          <ul className="flex  items-center justify-center  md:gap-3 ">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <div
                  className={`w-12 h-12 flex justify-center items-center 
        bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border 
        ${
          mapState.activeIndex === index
            ? "border-2 border-blue-500"
            : "border-gray-100"
        }`} // Conditional border color
                  onClick={() => {
                    if (item.label === "More") {
                      verticalSidebar();
                    }
                    setMapState({ activeIndex: index });
                    setMapState({ activeMapTile: item.tileUrl });
                  }}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full rounded-md"
                    />
                  ) : (
                    item.icon
                  )}
                </div>
                <span className="text-xs mt-0.5 text-gray-600 font-medium">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {verticalbar && (
        <div
          className={`absolute bottom-24 left-28  rounded-md w-1/6 h-2/4 bg-white text-gray-500 shadow-2xl z-[1000] transition-all duration-500 ease-in-out transform ${
            verticalbar
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          <div className="w-full px-3 py-2  flex gap-14 items-center justify-between">
            <div className="flex gap-2  items-center text-center justify-center">
              <span>
                <Layers className="h-5 w-5" />
              </span>
              More Tile Layers
            </div>
            <span className="flex gap-2 items-center  text-red-500 justify-center">
              <CircleX
                className="h-7 w-7 cursor-pointer"
                onClick={verticalSidebar}
              />
            </span>
          </div>
          <div className="divider m-0 px-3"></div>

          {/* 3xN Grid for Content */}
          <div className="overflow-y-auto h-full">
            <div className="grid grid-cols-3 gap-4 p-4">
              {verticalTiles.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col justify-center items-center"
                >
                  <div
                    className={`w-12 h-12 flex justify-center items-center 
        bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border 
        ${
          mapState.activeIndex === index
            ? "border-2 border-blue-500"
            : "border-gray-100"
        }`} // Conditional border color
                    onClick={() => {
                      if (item.label === "More") {
                        verticalSidebar();
                      }
                      setMapState({ activeIndex: index });
                      setMapState({ activeMapTile: item.tileUrl });
                    }}
                  >
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full rounded-md"
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className="text-xs mt-0.5 text-gray-600 font-medium">
                    {item.label}
                  </span>
                </li>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute p-2 gap-2 flex flex-col right-0 bottom-0 h-full w-1/4 bg-transparent z-[1000]">
        <motion.div
          className="w-full h-1/2 group relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/test"
            className="absolute top-2 left-2 hidden group-hover:flex items-center z-50 px-3 py-1 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-all"
          >
            Action
          </Link>
          <CustomerSegmentation />
        </motion.div>

        <motion.div
          className="w-full h-1/2 group relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => setMapState({ isPopupOpen: !mapState.isPopupOpen })}
            className="absolute top-2 left-2 hidden group-hover:flex items-center z-20 px-3 py-1 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-all"
          >
            Action
          </button>

          {/* Popup overlay */}
          {mapState.isPopupOpen && (
            <div className="w-screen h-screen fixed inset-0 bg-gray-800 bg-opacity-75 z-40 flex items-center justify-center">
              <div className="bg-white w-screen h-screen">
                <Suspense fallback={<div>Loading...</div>}>
                  <PopupContent />
                </Suspense>
              </div>
            </div>
          )}
          <SalesOverviewChart />
        </motion.div>
      </div>
    </div>
  );
};

export default MapComponent;
