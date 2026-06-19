"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import useDashboardStore from '@/store/dashboardStore';
import axios from 'axios';
import useheaddata from '@/store/headpostdata';

const SubPostOfficeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subPostOffice, setSubPostOffice] = useState([]);
  const [allSubPostOffices, setAllSubPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { District, State, setPostoffice, setActiveTab, setSubpostoffice } = useDashboardStore();
  const { setSub } = useheaddata();

  const fetchSubPostOffices = async () => {
    if (!District) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.postalpincode.in/postoffice/${District}`);

      if (response.data[0]?.Status === "Success") {
        const postOffices = response.data[0].PostOffice || [];

        // Extract state name — State can be object {name, image} or string
        const selectedState = typeof State === 'object' ? State?.name : State;

        // Filter to the correct state only (avoids cross-state results)
        const inState = selectedState
          ? postOffices.filter(o => o.State?.toLowerCase() === selectedState.toLowerCase())
          : postOffices;

        // Prefer Head and Sub Post Offices (SP level in postal hierarchy)
        const spLevel = inState.filter(o =>
          o.BranchType === "Head Post Office" || o.BranchType === "Sub Post Office"
        );

        // Fall back to all offices in state if no SP-level found
        const source = spLevel.length > 0 ? spLevel : inState;

        // Deduplicate by name, sort alphabetically
        const seen = new Set();
        const unique = [];
        source.forEach(office => {
          if (!seen.has(office.Name)) {
            seen.add(office.Name);
            unique.push({
              name: office.Name,
              pincode: office.Pincode,
              division: office.Division,
              state: office.State,
            });
          }
        });
        unique.sort((a, b) => a.name.localeCompare(b.name));

        setAllSubPostOffices(unique);
        setSubPostOffice(unique);
      } else {
        setError("No post offices found for this district");
        setSubPostOffice([]);
        setAllSubPostOffices([]);
      }
    } catch (err) {
      console.warn("Error fetching post offices:", err);
      setError("Failed to fetch post offices. Check your connection.");
      setSubPostOffice([]);
      setAllSubPostOffices([]);
    } finally {
      setLoading(false);
    }
  };

  // Local filter on search — restore full list when query cleared
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        setSubPostOffice(
          allSubPostOffices.filter(o =>
            o.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      } else {
        setSubPostOffice(allSubPostOffices);
      }
    }, 300),
    [allSubPostOffices]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClick = (office) => {
    setSubpostoffice({ name: office.name, pincode: office.pincode });
    setSub({ name: office.name, pincode: office.pincode });
    setPostoffice("");
    setActiveTab('postoffice');
  };

  useEffect(() => {
    if (District) {
      fetchSubPostOffices();
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
          placeholder="Search for a sub-post office"
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 text-gray-500">
          <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
        </svg>
      </label>

      {error && (
        <div className="text-center py-2 text-destructive mt-4">{error}</div>
      )}

      {/* Scrollable List */}
      <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-2">
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
