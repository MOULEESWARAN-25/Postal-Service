"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import useDashboardStore from '@/store/dashboardStore';
import useheaddata from '@/store/headpostdata';

const DistrictSearch = () => {

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulated API call function
  const fetchDistricts = async (query) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/searchPlace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: {
            step:2,
            Query: query,
          
        } }),
      });
      const data = await response.json();

      setDistricts(data.matches || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts(initialDistricts);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        fetchDistricts(query);
      } else {
        setDistricts(initialDistricts);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const{District,setSubpostoffice,setDistrict,setVillage,setActiveTab,State}=useDashboardStore();
  const{setDis,setSub}=useheaddata()

  const handleclick=(district)=>{
    setDistrict(district);
    setSubpostoffice("")
    setDis(district)
    setSub("")
    setActiveTab('subpostoffice');
  }

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/getDistricts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: State, // Pass the state directly in the body object
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching districts: ${response.statusText}`);
        }
  
        const data = await response.json();
        
        
        setDistricts(data.matches);
        console.log("districts",districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
  
    if (State) {
      fetchDistricts();
    }
  }, [State]);
  

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
          placeholder="Search for a district"
          disabled={State==null}
          
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

      {/* Scrollable List */}
      <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-center py-2 text-gray-500">Loading...</div>
        ) : districts.length > 0 ? (
          districts.map((district, index) => (
            <div
              key={index}
              onClick={() => handleclick(district)}
              className="text-center py-2 px-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-700">
                {district}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-gray-500">No districts found  Or Select State</div>
        )}
      </div>
    </div>
  );
};

export default DistrictSearch;