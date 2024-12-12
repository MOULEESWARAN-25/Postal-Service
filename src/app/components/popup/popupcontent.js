"use client";
import { lazy, useEffect, useState } from "react";
import useMapStore from "../../../store/useMapStore";
import { Search, X, AlignJustify, XCircle } from "lucide-react";
import useDemographicsStore from "@/store/demographicsStore";
const ModernCalendar = lazy(() => import("./calender")); // Lazy load the component

const PopupContent = () => {
  const { mapState, setMapState } = useMapStore();
  const{demographicData,setDemographicData}=useDemographicsStore();
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  const renderTabContent = () => {
    switch (mapState.activeTab) {
      case 1:
        return (
          <div
            className="overflow-y-auto h-[calc(100vh-2px)]  
          pb-24 border"
          >
car          </div>
        );
      case 2:
        return (
          <div
            className="overflow-y-auto  
          pb-24 border"
          >
            {" "}
            <ModernCalendar />
          </div>
        );
      case 3:
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">Page 3 Content</h2>
            <p className="text-gray-600">
              Detailed information for the third tab goes here.
            </p>
          </div>
        );
      default:
        return <div className="p-4">Invalid Page</div>;
    }
  };


  useEffect(() => {
  //  console.log("car",mapState.searchDetails);
   const getDemographics = async () => {
    try {
      const response = await fetch("/api/villages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: mapState.searchDetails.name }),
      });
      const data = await response.json();
      console.log("data",data);
      setDemographicData(data);
    } catch (error) {
      console.error("Error fetching demographics:", error);

      }
      finally {
        // setIsLoading(false);
      }
   }

   getDemographics();
  }, [mapState.searchDetails]);

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with Tabs and Search */}
      <header className="sticky top-0 z-50 bg-white shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between space-x-4">
            {/* Tabs Container */}
            <div className="flex items-center space-x-3 flex-grow">
              {/* Close Button */}
              <button
                onClick={() =>
                  setMapState({ isPopupOpen: !mapState.isPopupOpen })
                }
                className="btn btn-circle btn-sm btn-ghost hover:bg-red-50 group"
                aria-label="Close popup"
              >
                <XCircle className="h-6 w-6 text-gray-500 group-hover:text-red-500 transition-colors" />
              </button>
              {/* Tabs */}
              <div className="tabs tabs-boxed gap-1 bg-gray-100">
                <a
                  role="tab"
                  className={`tab ${
                    mapState.activeTab === 1
                      ? "tab-active bg-primary text-white"
                      : ""
                  }`}
                  onClick={() => setMapState({ activeTab: 1 })}
                >
                  Dashboard
                </a>
                <a
                  role="tab"
                  className={`tab ${
                    mapState.activeTab === 2
                      ? "tab-active bg-primary text-white"
                      : ""
                  }`}
                  onClick={() => setMapState({ activeTab: 2 })}
                >
                  Calender
                </a>
                <a
                  role="tab"
                  className={`tab ${
                    mapState.activeTab === 3
                      ? "tab-active bg-primary text-white"
                      : ""
                  }`}
                  onClick={() => setMapState({ activeTab: 3 })}
                >
                  More
                </a>
              </div>
            </div>



            {/* Search and Mobile Menu */}
            <div className="flex w-full justify-end items-center space-x-2">
              {/* Responsive Search */}
              <div className="relative">
                {isSearchExpanded ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="search"
                      placeholder="Search here..."
                      className="input input-bordered border-2  bg-white input-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setIsSearchExpanded(false)}
                      className="btn btn-circle btn-sm bg-red-500 border-none text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="btn btn-ghost btn-circle text-blue-500 hover:bg-blue-100"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle hover:bg-gray-200"
                >
                  <AlignJustify className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-gradient-to-r from-blue-100 to-blue-200 rounded-box w-52"
                >
                  <li>
                    <a className="text-blue-700 hover:text-blue-900 hover:bg-blue-300 rounded-md">
                      Option 1
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:text-blue-900 hover:bg-blue-300 rounded-md">
                      Option 2
                    </a>
                  </li>
                  <li>
                    <a className="text-blue-700 hover:text-blue-900 hover:bg-blue-300 rounded-md">
                      Option 3
                    </a>
                  </li>
                </ul>
              </div>
            </div>






          </div>
        </div>
      </header>

      {/* Tab Content */}
      <main className="mt-2">{renderTabContent()}</main>
    </div>
  );
};

export default PopupContent;
