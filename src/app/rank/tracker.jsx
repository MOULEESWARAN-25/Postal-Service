"use client";

import React, { useState } from "react";

const VillageTrackingUI = ({ onbuutonClick }) => {
  const [villages, setVillages] = useState([
    {
      name: "X",
      status: "pending",
      accounts: 0,
      totalAccounts: 50,
      coordinates: { lat: 20.5937, lng: 78.9629 },
    },
    {
      name: "A",
      status: "not-started",
      accounts: 0,
      totalAccounts: 50,
      coordinates: { lat: 20.6, lng: 79.0 },
    },
    {
      name: "B",
      status: "not-started",
      accounts: 0,
      totalAccounts: 50,
      coordinates: { lat: 20.55, lng: 79.1 },
    },
    {
      name: "C",
      status: "not-started",
      accounts: 0,
      totalAccounts: 50,
      coordinates: { lat: 20.65, lng: 79.2 },
    },
  ]);

  const [currentVillage, setCurrentVillage] = useState(null);

  const startVillageTracking = (village) => {
    setCurrentVillage(village);
  };

  const updateVillageProgress = (village, accountsCreated) => {
    setVillages((prev) =>
      prev.map((v) =>
        v.name === village.name
          ? {
              ...v,
              accounts: accountsCreated,
              status:
                accountsCreated >= v.totalAccounts
                  ? "completed"
                  : "in-progress",
            }
          : v
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container text-black mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">
            Village Tracking Progress
          </h2>
        </div>
        <div className="p-6">
          {/* Village Route Tracker */}
          <div className="flex items-center justify-between mb-4">
            {villages.map((village, index) => (
              <React.Fragment key={village.name}>
                <div
                  className={`
                    rounded-full w-16 h-16 flex items-center justify-center 
                    ${getStatusColor(village.status)}
                    relative cursor-pointer hover:scale-110 transition-transform
                  `}
                  onClick={() => startVillageTracking(village)}
                >
                  <span className="font-bold text-xl">{village.name}</span>
                  {village.status === "completed" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute -top-2 -right-2 text-green-600 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </div>
                {index < villages.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed Village Tracking */}
          {currentVillage && (
            <div className="mt-6 p-4 border rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                Village {currentVillage.name} Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Accounts Created:</p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max={currentVillage.totalAccounts}
                      value={currentVillage.accounts}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        if (
                          newValue >= 0 &&
                          newValue <= currentVillage.totalAccounts
                        ) {
                          updateVillageProgress(currentVillage, newValue);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          const incrementedValue = Math.min(
                            currentVillage.accounts + 1,
                            currentVillage.totalAccounts
                          );
                          updateVillageProgress(
                            currentVillage,
                            incrementedValue
                          );
                        } else if (e.key === "ArrowDown") {
                          const decrementedValue = Math.max(
                            currentVillage.accounts - 1,
                            0
                          );
                          updateVillageProgress(
                            currentVillage,
                            decrementedValue
                          );
                        }
                      }}
                      className="w-20 bg-white p-2 border rounded mr-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <span>/ {currentVillage.totalAccounts}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <span
                    className={`
                      px-3 py-1 rounded 
                      ${getStatusColor(currentVillage.status)}
                    `}
                  >
                    {currentVillage.status}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Geo Location:</p>
                  <p>
                    Lat: {currentVillage.coordinates.lat}
                    <br />
                    Lng: {currentVillage.coordinates.lng}
                  </p>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={onbuutonClick}
                    className="
                      border border-gray-300 text-gray-700 
                      hover:bg-gray-100 px-4 py-2 
                      rounded flex items-center 
                      transition-colors duration-200
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Mark Geo Location
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillageTrackingUI;
