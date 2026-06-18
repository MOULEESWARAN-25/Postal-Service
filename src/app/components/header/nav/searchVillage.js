"use client";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useDashboardStore from "@/store/dashboardStore";

const VillageSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [villages, setVillages] = useState([]);
  const [allVillages, setAllVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { District, setVillage, setActiveTab, postoffice, subpostoffice } =
    useDashboardStore();

  // Fetch villages by pincode (when a post office is selected)
  const fetchByPincode = async (pincode) => {
    if (!pincode) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const names = data[0].PostOffice.map((o) => o.Name).filter(Boolean);
        const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b));
        setAllVillages(unique);
        setVillages(unique);
      } else {
        setAllVillages([]);
        setVillages([]);
      }
    } catch (err) {
      console.warn("Error fetching villages by pincode:", err);
      setAllVillages([]);
      setVillages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch villages by district (when only district is selected)
  const fetchByDistrict = async () => {
    if (!District) return;
    setLoading(true);
    try {
      const res = await fetch("/api/getVillages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ District }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const list = data.matches || [];
      const sorted = list.sort((a, b) => a.localeCompare(b));
      setAllVillages(sorted);
      setVillages(sorted);
    } catch (err) {
      console.warn("Error fetching villages:", err);
      setAllVillages([]);
      setVillages([]);
    } finally {
      setLoading(false);
    }
  };

  // When subpostoffice changes — use its pincode to get branch offices as villages
  useEffect(() => {
    const pincode = subpostoffice?.pincode;
    if (pincode) {
      fetchByPincode(pincode);
    }
  }, [subpostoffice]);

  // When postoffice changes — it may carry a pincode too
  useEffect(() => {
    if (postoffice && typeof postoffice === "object" && postoffice.pincode) {
      fetchByPincode(postoffice.pincode);
    }
  }, [postoffice]);

  // When only District is selected (no postoffice yet), fetch from DB/API
  useEffect(() => {
    if (District && !subpostoffice) {
      fetchByDistrict();
    }
  }, [District]);

  // Local debounced filter — no extra API call on search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        setVillages(
          allVillages.filter((v) =>
            v.toLowerCase().includes(query.toLowerCase())
          )
        );
      } else {
        setVillages(allVillages);
      }
    }, 300),
    [allVillages]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleclick = (village) => {
    setVillage(village);
    setActiveTab("");
  };

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
      <div className="overflow-y-auto border-t border-gray-200 mt-4 max-h-60 grid grid-cols-1 gap-2">
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
          <div className="text-center py-2 text-gray-500">No villages found</div>
        )}
      </div>
    </div>
  );
};

export default VillageSearch;
