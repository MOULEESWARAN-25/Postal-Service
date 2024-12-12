"use client";
import {
  BarChart2,
  BarChartBig,
  FileText,
  LandPlot,
  Lock,
  Map,
  MapPinHouse,
  MapPinned,
  Signpost,
  SlidersHorizontal,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDashboardStore from "@/store/dashboardStore";
import RegionSearch from "./nav/searchState";
import DistrictSearch from "./nav/searchDistrict";
import VillageSearch from "./nav/searchVillage";
import SubPostOfficeSearch from "./nav/searchSubPostOffice";
import SearchPostOffice from "./nav/searchPostOffice";

const Header = () => {
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
  const [isShrink, setIsShrink] = useState(true);

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

  const handleClick = () => {
    setIsShrink(!isShrink);
    if (!State && !District && !village && !subpostoffice && !postoffice) {
      return;
    }
    setLoading(true);

    const getDemographics = async () => {
      console.log(
        State?.name,
        District,
        village,
        subpostoffice?.name,
        postoffice
      );
      try {
        const response = await fetch("/api/demographics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: {
              State: State?.name || null,
              District: District || null,
              Village: village || null,
              SubPostOffice: subpostoffice?.name || null,
              PostOffice: postoffice || null,
            },
          }),
        });

        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error("Failed to fetch demographics");
        }

        const data = await response.json();
        setTotalDemographicData(data);
        filterDemographicData();
        setSchemePerformanceVisible(true);
      } catch (error) {
        console.error("Error fetching demographics:", error);
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    };

    getDemographics();
  };

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
    <header
      className={`flex ${
        isShrink ? "items-center" : "items-start"
      } sticky top-0 z-50 justify-between px-8 py-4 shadow-md bg-white`}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-2 ">
        <img src="./postoffice.png" alt="Airbnb Logo" className="h-10" />
        <span className="text-xl font-semibold text-red-500">
          Postal Service
        </span>
      </div>

      <motion.div
        className="flex flex-col justify-center w-full  items-center"
        layout
      >
        {/* Navigation Section */}
        <AnimatePresence mode="wait">
          {!isShrink && (
            <motion.nav
              key="nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-6 mb-5 text-sm font-medium text-gray-700"
            >
              <Link href="/" className="hover:text-black">
                Dashboard
              </Link>
              <Link href="/calender" className="hover:text-black">
                Event Calender
              </Link>
              <Link
                href="/visualize"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black"
              >
                Visualize
              </Link>
              {/* <Link href="/publicInfo" className="hover:text-black">
                Public Info
              </Link> */}
            </motion.nav>
          )}
        </AnimatePresence>

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
            {!isShrink ? (
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
                      <span className="text-xs text-gray-500">
                        Select State
                      </span>
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

                  <div className="divider lg:divider-horizontal py-2 m-0"></div>

                  <motion.div
                    ref={modalRefs.postOffice}
                    className={` relative text-[11px] p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer ${
                      activeTab === "postoffice"
                        ? "bg-white text-red-500 font-semibold shadow-2xl"
                        : "text-black"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClick("postoffice");
                    }}
                    initial={{ x: -100 }} // Start from left off-screen
                    animate={{ x: 0 }} // Slide to the center
                    exit={{ x: 100 }} // Exit to the right when switching tabs
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth transition
                  >
                    <Signpost className="w-5 h-5 shrink-0" />

                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">
                        Select postoffice
                      </span>

                      <p className="text-xs text-red-500 font-semibold truncate">
                        {postoffice || "Select?"}
                      </p>
                    </div>
                    {activeTab === "postoffice" && <SearchPostOffice />}
                  </motion.div>

                  {/* end   */}

                  <div className="divider lg:divider-horizontal py-2 m-0"></div>

                  <motion.div
                    ref={modalRefs.village}
                    className={` relative text-[11px] p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer ${
                      activeTab === "village"
                        ? "bg-white text-red-500 font-semibold shadow-2xl"
                        : "text-black"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClick("village");
                    }}
                    initial={{ x: -100 }} // Start from left off-screen
                    animate={{ x: 0 }} // Slide to the center
                    exit={{ x: 100 }} // Exit to the right when switching tabs
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth transition
                  >
                    <MapPinHouse className="w-5 h-5 shrink-0" />

                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">
                        Select village
                      </span>

                      <p className="text-xs text-red-500 font-semibold truncate">
                        {village || "Select?"}
                      </p>
                    </div>
                    {activeTab === "village" && <VillageSearch />}
                  </motion.div>

                  {/* Search Button */}
                  <div className="flex items-center justify-center p-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClick}
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
            ) : (
              <motion.div
                key="shrunk-search"
                layout
                initial="exit"
                animate="shrunk"
                exit="exit"
                variants={contentVariants}
                className="p-2 flex gap-5 items-center"
              >
                <Link href={"/"} className="p-2 text-black">
                  Dashboard
                </Link>
                <div className="divider lg:divider-horizontal m-0 py-2"></div>
                <Link href={"/calender"} className="p-2 text-black">
                  Event Calender
                </Link>
                {/* <div className="divider lg:divider-horizontal m-0 py-2"></div> */}
                {/* <Link href={"/publicInfo"} className="p-2 text-black">
                  Public Info
                </Link> */}
                <div className="divider lg:divider-horizontal m-0 py-2"></div>
                <a
                  href="/visualize"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-black"
                >
                  Visualize
                </a>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsShrink(!isShrink)}
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Right Menu Section */}
      <div className="flex items-center space-x-4 ">
        <div className="dropdown dropdown-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            tabIndex={0}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          >
            🌐
          </motion.button>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow text-black bg-white rounded-box w-52"
          >
            <li>
              <a>
                <FileText className="w-5 h-5 mr-2" /> Forms
              </a>
            </li>
            <li>
              <Link href="/gamification" legacyBehavior>
                <a>
                  <MapPinned className="w-5 h-5 mr-2" /> Task Asign
                </a>
              </Link>
            </li>
            <li>
              <Link href="/farm" legacyBehavior>
                <a>
                  <Trophy className="w-5 h-5 mr-2" /> Agricultural
                </a>
              </Link>
            </li>
            <li>
              <Link href="/melafeedBack" legacyBehavior>
                <a>
                  <SlidersHorizontal className="w-5 h-5 mr-2" /> mela feed Back
                </a>
              </Link>
            </li>

            <li>
              <Link href="/postalHeadData" legacyBehavior>
                <a>
                  <BarChart2 className="w-5 h-5 mr-2" /> Data 
                </a>
              </Link>
            </li>
            <li>
              <Link href="/rank" legacyBehavior>
                <a>
                  <BarChartBig className="w-5 h-5 mr-2" /> Leaderboard
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          >
            <span className="text-sm font-semibold">👤</span>
          </motion.div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow text-black bg-white rounded-box w-52"
          >
            <li>
              <a>
                <User className="w-5 h-5 mr-2" /> Profile
              </a>
            </li>
            <li>
              <Link href="/register" legacyBehavior>
                <a>
                  <User className="w-5 h-5 mr-2" /> Create User
                </a>
              </Link>
            </li>
            <li>
              <a className="text-red-600">
                <Lock className="w-5 h-5 mr-2" /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
