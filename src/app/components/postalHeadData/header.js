"use client";
import {
  BarChart2,
  Building2,
  FileText,
  LandPlot,
  Lock,
  Map,
  MapPinHouse,
  MapPinned,
  Signpost,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDashboardStore from "@/store/dashboardStore";
import RegionSearch from "../../components/header/nav/searchState";
import DistrictSearch from "../../components/header/nav/searchDistrict";
import SubPostOfficeSearch from "../../components/header/nav/searchSubPostOffice";
import useheaddata from "@/store/headpostdata";

const Header = () => {
  const { Sta, Dis, sub, loa, sch, setLoa, setsch, fetchHeadData } =
    useheaddata();

  const {
    activeTab,
    setActiveTab,
    State,
    village,
    District,
    setLoading,
    setDemographicData,
    setTotalDemographicData,
    filterDemographicData,
    subpostoffice,
    postoffice,
    setSchemePerformanceVisible,
  } = useDashboardStore();
  const [isShrink, setIsShrink] = useState(false);

  const modalRefs = {
    state: useRef(null),
    district: useRef(null),
    village: useRef(null),
    subPostOffice: useRef(null),
    postOffice: useRef(null),
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName === activeTab ? "" : tabName);
  };

  // const handleClick = () => {
  //   if (!Sta && !Dis && !sub ) {
  //     return;
  //   }
  //   setLoa(true);

  //   const headData = async () => {
  //    console.log(Sta?.name,
  //     Dis,
  //     sub?.name?.split(' ').slice(0,1).join(' ')
  //   )
  //     try {
  //       const response = await fetch("/api/headPostData", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({

  //             State:Sta?.name,
  //             District:Dis,
  //             SubpostOffice:sub?.name?.split(' ').slice(0,1).join(' ')

  //         }),
  //       });

  //       // Check if the response status is OK (200)
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch demographics");
  //       }

  //       const data = await response.json();
  //       console.log(data)
  //       setsch(data)
  //     } catch (error) {
  //       console.error("Error fetching demographics:", error);
  //     } finally {
  //       setLoading(false); // Ensure loading state is reset
  //     }
  //   };

  //   headData();
  // };

  // Refined variants to minimize layout shifts
  const containerVariants = {
    expanded: {
      width: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    shrunk: {
      width: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    shrunk: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: isShrink ? -20 : 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideModal = Object.values(modalRefs).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );

      if (!isInsideModal) {
        setActiveTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center sticky top-0 z-50 justify-between px-5 py-4 shadow-md bg-white">
      <div className="flex items-center gap-5 justify-center">
        <Building2 className="h-9 w-9 text-red-400" />
        <h1 className="font-bold text-3xl text-red-400 tracking-wide">
          HeadPostData
        </h1>
      </div>
      <motion.div
        className="flex flex-col justify-center w-full  items-center"
        layout
      >
        {/* Search Bar Section */}
        <motion.div
          layout
          variants={containerVariants}
          animate={isShrink ? "shrunk" : "expanded"}
          className={`flex items-center max-w-5xl  ${
            activeTab ? "bg-gray-100" : "bg-white"
          } border rounded-full shadow-sm`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="expanded-search"
              layout
              initial="exit"
              animate="expanded"
              exit="exit"
              variants={contentVariants}
              className="flex w-full items-center"
            >
              {/* Expanded Search Tabs */}

              <div className="flex w-full items-center">
                <motion.div
                  ref={modalRefs.state}
                  className={`relative text-[11px] p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer ${
                    activeTab === "state"
                      ? "bg-white text-red-500 shadow-2xl"
                      : "text-black"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick("state");
                  }}
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  exit={{ x: 100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Map className="w-5 h-5 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-gray-500">Select State</span>
                    <p className="text-xs text-red-500 font-semibold truncate">
                      {State?.name || "Choose State"}
                    </p>
                  </div>
                  {activeTab === "state" && <RegionSearch />}
                </motion.div>

                <div className="divider lg:divider-horizontal py-2"></div>

                <motion.div
                  ref={modalRefs.district}
                  className={`relative text-[11px] p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer ${
                    activeTab === "district"
                      ? "bg-white text-red-500 font-semibold shadow-2xl"
                      : "text-black"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick("district");
                  }}
                  initial={{ x: -100 }} // Start from left off-screen
                  animate={{ x: 0 }} // Slide to the center
                  exit={{ x: 100 }} // Exit to the right when switching tabs
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth transition
                >
                  <LandPlot className="w-5 h-5 shrink-0" />

                  <div className="flex flex-col truncate">
                    <span className="text-xs text-gray-500">
                      Select District
                    </span>

                    <p className="text-xs text-red-500 font-semibold truncate">
                      {District || "Select?"}
                    </p>
                  </div>
                  {activeTab === "district" && <DistrictSearch />}
                </motion.div>

                {/* start  */}
                <div className="divider lg:divider-horizontal py-2 m-0"></div>

                <motion.div
                  ref={modalRefs.subPostOffice}
                  className={` relative text-[11px] p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer ${
                    activeTab === "subpostoffice"
                      ? "bg-white text-red-500 font-semibold shadow-2xl"
                      : "text-black"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabClick("subpostoffice");
                  }}
                  initial={{ x: -100 }} // Start from left off-screen
                  animate={{ x: 0 }} // Slide to the center
                  exit={{ x: 100 }} // Exit to the right when switching tabs
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth transition
                >
                  <MapPinned className="w-5 h-5 shrink-0" />

                  <div className="flex flex-col truncate">
                    <span className="text-xs text-gray-500">Select SP</span>

                    <p className="text-xs text-red-500 font-semibold truncate">
                      {subpostoffice?.name || "Select?"}
                    </p>
                  </div>
                  {activeTab === "subpostoffice" && <SubPostOfficeSearch />}
                </motion.div>

                {/* Search Button */}
                <div className="flex items-center justify-center p-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={fetchHeadData}
                    className="flex items-center justify-center w-10 h-10 text-white bg-red-500 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M16.65 10.35a6.35 6.35 0 11-12.7 0 6.35 6.35 0 0112.7 0z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Header;
