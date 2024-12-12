"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import useDashboardStore from '@/store/dashboardStore';
import axios from 'axios'; // Make sure to install axios: npm install axios
import useheaddata from '@/store/headpostdata';

const SubPostOfficeSearch = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [subPostOffice, setSubPostOffice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { District, setVillage, setPostoffice, setActiveTab, setSubpostoffice } = useDashboardStore();

  const erodePostOffices = [
    {
      name: "Anthiyur S.O",
      pincode: "638501",
      phone: "04256-260238",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Bhavani Head Post Office",
      pincode: "638301",
      phone: "04256-233035",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Erode Head Post Office",
      pincode: "638001",
      phone: "0424-259111",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Gobichettipalyam Head Post Office",
      pincode: "638452",
      phone: "04285-241028",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Kodumudi S.O",
      pincode: "638151",
      phone: "04204-222166",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Modakkuruchi S.O",
      pincode: "638104",
      phone: "0424-2500280",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Nambiyur S.O",
      pincode: "638458",
      phone: "04285-267432",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Perundurai S.O",
      pincode: "638052",
      phone: "04294-220530",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Sathiyamangalam S.O",
      pincode: "638401",
      phone: "04295-2220208",
      division: "Erode",
      state: "Tamil Nadu"
    },
    {
      name: "Talavadi S.O",
      pincode: "638461",
      phone: "04295-245521",
      division: "Erode",
      state: "Tamil Nadu"
    }
  ];
  

 
  const fetchVillages = async () => {
    if (!District) return;

    setLoading(true);
    setError(null);

    if(District==="Erode"){
      setSubPostOffice(erodePostOffices);
      setLoading(false);
      return
    }

    try {
      const response = await axios.get(`https://api.postalpincode.in/postoffice/${District}`);
      
      if (response.data[0]?.Status === "Success") {
        const postOffices = response.data[0].PostOffice || [];
        setSubPostOffice(postOffices.map(office => ({
          name: office.Name,
          pincode: office.Pincode,
          phone: 'N/A', // API doesn't provide phone numbers
          division: office.Division,
          state: office.State
        })));
      } else {
        setError("No post offices found for this district");
        setSubPostOffice([]);
      }
    } catch (error) {
      console.error("Error fetching post offices:", error);
      setError("Failed to fetch post offices");
      setSubPostOffice([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        // Filter subPostOffice based on search query
        setSubPostOffice((prevPostOffices) =>
          prevPostOffices.filter((office) =>
            office.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      } else {
        fetchVillages();
      }
    }, 300),
    []
  );

  const{setSub}=useheaddata()

  // Handle selecting a post office
  const handleClick = (office) => {
    console.log(office);
    // setSubpostoffice( office.Pincode);
    setSubpostoffice({ name: office.name, pincode: office.pincode });
    setSub({ name: office.name, pincode: office.pincode })
    setPostoffice("");
    setActiveTab('postoffice');
  };

  useEffect(() => {
    if (District) {
      fetchVillages();
    }
  }, [District]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full -right-1/4 w-96 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10"
    >
      {/* Search Input */}
      <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-grow outline-none bg-transparent text-sm"
          placeholder="Search for a post office"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-5 w-5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      {/* Error Handling */}
      {error && (
        <div className="text-center py-2 text-red-500 mt-4">
          {error}
        </div>
      )}

      {/* Scrollable List */}
      <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-center py-2 text-gray-500">Loading...</div>
        ) : subPostOffice.length > 0 ? (
          subPostOffice.map((office, index) => (
            <div
              key={index}
              onClick={() => handleClick(office)}
              className="text-center py-2 px-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-700">
                {office.name} ({office.pincode})
              </p>
              <p className="text-xs text-gray-500">
                {office.division}, {office.state}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-gray-500">
            {error || "No post offices found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubPostOfficeSearch;
