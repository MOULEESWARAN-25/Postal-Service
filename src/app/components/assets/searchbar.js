import { Search } from "lucide-react";
import Autocomplete from "react-google-autocomplete";

const Searchbar = ({ onLocationSelected }) => {
  const handlePlaceSelected = (place) => {
    if (!place || !place.geometry) {
      alert("Location not found or invalid place!");
      return;
    }

    const { lat, lng } = place.geometry.location;
    const location = { lat: lat(), lng: lng() };

    if (place.address_components && place.address_components.length > 0) {
      const { district, state } = extractLocationDetails(
        place.address_components
      );

      // Notify parent about the selected location
      onLocationSelected({
        name: place.formatted_address || "Unknown Location",
        district: district || "Unknown District",
        state: state || "Unknown State",
        position: location,
      });
    } else {
      alert("No address components found for the selected place.");
    }
  };

  const extractLocationDetails = (addressComponents) => {
    let district = "";
    let state = "";

    addressComponents.forEach((component) => {
      const types = component.types;
      if (types.includes("administrative_area_level_3")) {
        district = component.long_name; // District
      }
      if (types.includes("administrative_area_level_1")) {
        state = component.long_name; // State
      }
    });

    return { district, state };
  };

  return (
    <div
      style={{ zIndex: 1000 }}
      className="absolute z-50 left-1/2 transform -translate-x-1/2 top-2 flex-1 max-w-md"
    >
      <Autocomplete
        className="pl-10 pr-10 w-[500px] py-2 bg-white text-black shadow-2xl rounded-full border-2 border-blue-300"
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={handlePlaceSelected}
        types={["(regions)"]}
        placeholder="Search Google Maps"
      />
      <style jsx global>{`
        .pac-container {
          background-color: #ffffff; /* White background */
          border-radius: 8px; /* Rounded corners */
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
          padding: 0; /* Remove default padding */
          font-family: "Inter", sans-serif; /* Modern font */
          font-size: 14px; /* Adjust font size */
          z-index: 1000; /* Ensure it appears on top */
        }

        .pac-item {
          padding: 10px 16px 10px 40px; /* Add left padding for the icon */
          cursor: pointer; /* Pointer cursor for interactivity */
          border-bottom: 1px solid #f0f0f0; /* Divider between items */
          position: relative; /* Position for pseudo-element */
          transition: background-color 0.2s, color 0.2s; /* Smooth transitions */
        }

        .pac-item::before {
          content: ""; /* Pseudo-element for the icon */
          position: absolute;
          left: 12px; /* Adjust icon position */
          top: 50%;
          transform: translateY(-50%); /* Center icon vertically */
          width: 16px; /* Icon size */
          height: 16px;
          background-color: #007bff; /* Icon color */
          border-radius: 50%; /* Make it round */
        }

        .pac-item:hover {
          background-color: #f9fafb; /* Light hover effect */
          color: #007bff; /* Text color on hover */
        }

        .pac-item:last-child {
          border-bottom: none; /* Remove divider for last item */
        }

        .pac-icon {
          display: none; /* Hide default Google icons */
        }
      `}</style>
      <Search className="absolute left-3 top-1/2 text-blue-600 -translate-y-1/2 h-5 w-5" />
    </div>
  );
};

export default Searchbar;
