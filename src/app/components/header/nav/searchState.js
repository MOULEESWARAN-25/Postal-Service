"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import useDashboardStore from "@/store/dashboardStore";
import useheaddata from "@/store/headpostdata";

const RegionSearch = () => {
  // Initial states with default images (for local states)
  const INITIAL_STATES = [
    { name: "Tamil Nadu", image: "./states/tamilnadu.png" },
    { name: "Maharashtra", image: "./states/maharastra.png" },
    { name: "Karnataka", image: "./states/karnataka.png" },
    { name: "Andhra Pradesh", image: "./states/andhrapradesh.png" },
    { name: "Kerala", image: "./states/kerala.png" },
    { name: "Telangana", image: "./states/telengana.png" },
  ];
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [displayStates, setDisplayStates] = useState(INITIAL_STATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch states from API
  const fetchStates = useCallback(async (query = "") => {
    // Only fetch if there's a non-empty query
    if (query.trim() === "") {
      setDisplayStates(INITIAL_STATES);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/searchPlace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: {
            step:1,
            Query: query,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }

      const data = await response.json();

      // Transform API response to match our state object structure
      const apiStates = data.matches.map((stateName) => ({
        name: stateName,
        image: `./states/${stateName.toLowerCase().replace(/\s+/g, '')}.png` || './placeholder-state.png'
      }));

      // Set API results
      setDisplayStates(apiStates);
    } catch (err) {
      setError(err.message);
      // Fallback to initial states if API fails
      setDisplayStates(INITIAL_STATES);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced API call
  const debouncedFetchStates = useCallback(
    debounce((query) => {
      fetchStates(query);
    }, 300),
    [fetchStates]
  );

  // Input change handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Only trigger API call for non-empty queries
    if (value.trim()) {
      debouncedFetchStates(value);
    } else {
      // Reset to initial states if input is empty
      setDisplayStates(INITIAL_STATES);
    }
  };

  // Filter states based on search term
  const filteredStates = useMemo(() => {
    if (!searchTerm) return displayStates;

    return displayStates.filter((state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, displayStates]);

  // Initial fetch on component mount
  useEffect(() => {
    // Prevent multiple initial fetches
    if (!initialLoadComplete) {
      // You can add initial API call here if needed
      // Currently set to use initial states
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);


  const{ setState,setDistrict,setActiveTab} = useDashboardStore();
  const{setDis,setSta}=useheaddata()

  const handleStateClick = (stateName) => {
    console.log(stateName);
    setState(stateName);
    setDistrict("")

    setSta(stateName)
    setDis("")
    setActiveTab('district');
}

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full -right-1/4 w-96 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10"
    >
      <h5 className="text-md font-semibold mb-4 flex gap-2">
        Search by region{" "}
        <label className="input input-bordered input-error flex bg-transparent items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={handleInputChange}
            value={searchTerm}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </h5>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* States Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {filteredStates.map((state) => (
            <div onClick={() => handleStateClick(state)} key={state.name} className="text-center">
              <img
                src={state.image || './placeholder-state.png'}
                alt={state.name}
                className="w-24 h-24 mx-auto mb-2 object-cover"
                onError={(e) => {
                  e.target.src = './placeholder-state.png';
                }}
              />
              <p>{state.name}</p>
            </div>
          ))}

          {filteredStates.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">
              No states found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionSearch;
