"use client";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useDashboardStore from "@/store/dashboardStore";

const VillageSearch = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { District, setVillage, setActiveTab, postoffice, sathyBranchOffices } =
    useDashboardStore();
  // Simulated API call function
  const fetchVillages = async (query) => {
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
            step: 3,
            District: District,
            Query: query,
          },
        }),
      });
      const data = await response.json();
      setVillages(data.matches || []);
    } catch (error) {
      console.error("Error fetching villages:", error);
      setVillages(initialVillages);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        fetchVillages(query);
      } else {
        setVillages(initialVillages);
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

  const handleclick = (village) => {
    setVillage(village);
    setActiveTab("");
  };

  useEffect(() => {
    const fetchvillages = async () => {
      try {
        const response = await fetch("/api/getVillages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            District: District,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching districts: ${response.statusText}`);
        }

        const data = await response.json();

        setVillages(data.matches);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    if (District && !postoffice) {
      fetchvillages();
    }
  }, [District]);

  useEffect(() => {
    if (postoffice) {
      const branchOffices = sathyBranchOffices[postoffice];
      if (branchOffices) {
        console.log(branchOffices);
        setVillages(branchOffices);
      }
    }
  }, [postoffice]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full right--1/3 w-96 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10"
    >
      {/* Search Input */}
      <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-grow outline-none bg-transparent text-sm"
          placeholder="Search for a village"
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
        ) : villages.length > 0 ? (
          villages.map((village, index) => (
            <div
              onClick={() => handleclick(village)}
              key={index}
              className="text-center py-2 px-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-700">{village}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-gray-500">
            No villages found
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageSearch;
