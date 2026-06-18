"use client";
import {
  BarChart2,
  CalendarDays,
  LandPlot,
  Map,
  MapPinHouse,
  MapPinned,
  MessageSquare,
  Signpost,
  Sparkles,
  Users,
  Globe,
  Menu,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDashboardStore from "@/store/dashboardStore";
import RegionSearch from "./nav/searchState";
import DistrictSearch from "./nav/searchDistrict";
import VillageSearch from "./nav/searchVillage";
import SubPostOfficeSearch from "./nav/searchSubPostOffice";
import SearchPostOffice from "./nav/searchPostOffice";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/",            label: "Dashboard",       icon: BarChart2 },
  { href: "/compare",     label: "Compare Regions", icon: Globe },
  { href: "/publicInfo",  label: "Beneficiaries",   icon: Users },
  { href: "/calender",    label: "Campaigns",       icon: CalendarDays },
  { href: "/recommender",    label: "Recommender",      icon: Sparkles },
  { href: "/analytics",      label: "Analytics",        icon: TrendingUp },
  { href: "/query-resolver", label: "Assistant",        icon: MessageSquare },
];

const Header = () => {
  const pathname = usePathname();

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
    state:       useRef(null),
    district:    useRef(null),
    village:     useRef(null),
    subPostOffice: useRef(null),
    postOffice:  useRef(null),
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName === activeTab ? "" : tabName);
  };

  const handleClick = () => {
    setIsShrink(!isShrink);
    if (!State && !District && !village && !subpostoffice && !postoffice) return;
    setLoading(true);

    const getDemographics = async () => {
      try {
        const response = await fetch("/api/demographics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: {
              State:         State?.name || null,
              District:      District || null,
              Village:       village || null,
              SubPostOffice: subpostoffice?.name || null,
              PostOffice:    (typeof postoffice === "object" ? postoffice?.name : postoffice) || null,
            },
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch demographics");
        const data = await response.json();
        setTotalDemographicData(data);
        filterDemographicData(data);
        setSchemePerformanceVisible(true);
      } catch (error) {
        console.warn("Error fetching demographics:", error);
      } finally {
        setLoading(false);
      }
    };

    getDemographics();
  };

  // Animation variants for smooth shrink / expand transition
  const containerVariants = {
    expanded: { width: "100%", transition: { duration: 0.3, ease: "easeInOut" } },
    shrunk:   { width: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0,   transition: { duration: 0.3 } },
    shrunk:   { opacity: 1, x: 0,   transition: { duration: 0.3 } },
    exit:     { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideModal = Object.values(modalRefs).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!isInsideModal) setActiveTab("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common tab button styles
  const tabBase = `relative text-xs p-5 font-semibold flex items-center gap-4 w-full h-full justify-start hover:shadow-2xl rounded-full cursor-pointer transition-colors`;
  const tabActive = `bg-white text-[#C8102E] shadow-2xl`;
  const tabInactive = `text-[#1A2B4A]`;

  return (
    <header
      className={`flex ${isShrink ? "items-center" : "items-start"} sticky top-0 z-50 justify-between px-8 py-4 shadow-md bg-white`}
    >
      {/* Left side: Logo Section (fixed width for perfect centering) */}
      <div className="flex items-center space-x-2 w-[260px] shrink-0 justify-start">
        <img src="/postoffice.png" alt="India Post" className="h-10" />
        <div className="leading-tight">
          <p className="text-base font-bold text-[#C8102E] leading-none">Postal Service</p>
          <p className="text-xs font-semibold text-[#1A2B4A] uppercase tracking-wide leading-none">DSS Portal</p>
        </div>
      </div>

      {/* Center side: Search/Navigation Section */}
      <motion.div
        className="flex flex-col justify-center items-center flex-1 mx-4"
        layout
      >
        {/* Navigation Section (visible above expanded search bar) */}
        <AnimatePresence mode="wait">
          {!isShrink && (
            <motion.nav
              key="nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex items-center space-x-6 mb-4 text-sm font-medium text-gray-700"
            >
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`hover:text-[#C8102E] transition-colors ${
                      active ? "text-[#C8102E] font-semibold" : "text-[#374151]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Search Bar Section */}
        <motion.div
          layout
          variants={containerVariants}
          animate={isShrink ? "shrunk" : "expanded"}
          className={`flex items-center max-w-5xl ${
            activeTab ? "bg-gray-100" : "bg-white"
          } border rounded-full shadow-md overflow-hidden`}
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
                <div className="flex w-full items-center">
                  {/* State */}
                  <motion.div
                    ref={modalRefs.state}
                    className={`${tabBase} ${activeTab === "state" ? tabActive : tabInactive}`}
                    onClick={(e) => { e.stopPropagation(); handleTabClick("state"); }}
                    initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Map className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">Select State</span>
                      <p className="text-xs text-[#C8102E] font-semibold truncate">{State?.name || "Choose State"}</p>
                    </div>
                    {activeTab === "state" && <RegionSearch />}
                  </motion.div>

                  <div className="divider lg:divider-horizontal py-2" />

                  {/* District */}
                  <motion.div
                    ref={modalRefs.district}
                    className={`${tabBase} ${activeTab === "district" ? tabActive : tabInactive}`}
                    onClick={(e) => { e.stopPropagation(); handleTabClick("district"); }}
                    initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <LandPlot className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">Select District</span>
                      <p className="text-xs text-[#C8102E] font-semibold truncate">{District || "Select?"}</p>
                    </div>
                    {activeTab === "district" && <DistrictSearch />}
                  </motion.div>

                  <div className="divider lg:divider-horizontal py-2 m-0" />

                  {/* Sub Post Office */}
                  <motion.div
                    ref={modalRefs.subPostOffice}
                    className={`${tabBase} ${activeTab === "subpostoffice" ? tabActive : tabInactive}`}
                    onClick={(e) => { e.stopPropagation(); handleTabClick("subpostoffice"); }}
                    initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <MapPinned className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">Select SP</span>
                      <p className="text-xs text-[#C8102E] font-semibold truncate">{subpostoffice?.name || "Select?"}</p>
                    </div>
                    {activeTab === "subpostoffice" && <SubPostOfficeSearch />}
                  </motion.div>

                  <div className="divider lg:divider-horizontal py-2 m-0" />

                  {/* Post Office */}
                  <motion.div
                    ref={modalRefs.postOffice}
                    className={`${tabBase} ${activeTab === "postoffice" ? tabActive : tabInactive}`}
                    onClick={(e) => { e.stopPropagation(); handleTabClick("postoffice"); }}
                    initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Signpost className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">Select Post Office</span>
                      <p className="text-xs text-[#C8102E] font-semibold truncate">
                        {typeof postoffice === "object" ? (postoffice?.name || "Select?") : (postoffice || "Select?")}
                      </p>
                    </div>
                    {activeTab === "postoffice" && <SearchPostOffice />}
                  </motion.div>

                  <div className="divider lg:divider-horizontal py-2 m-0" />

                  {/* Village */}
                  <motion.div
                    ref={modalRefs.village}
                    className={`${tabBase} ${activeTab === "village" ? tabActive : tabInactive}`}
                    onClick={(e) => { e.stopPropagation(); handleTabClick("village"); }}
                    initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <MapPinHouse className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-gray-500">Select Village</span>
                      <p className="text-xs text-[#C8102E] font-semibold truncate">{village || "Select?"}</p>
                    </div>
                    {activeTab === "village" && <VillageSearch />}
                  </motion.div>

                  {/* Search / Analyse button */}
                  <div className="flex items-center justify-center p-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClick}
                      className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0"
                      style={{ background: "#C8102E" }}
                      title="Analyse"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Shrunk state — Navigation links inside the compact pill */
              <motion.div
                key="shrunk-search"
                initial="exit"
                animate="shrunk"
                exit="exit"
                variants={contentVariants}
                className="p-2 flex items-center gap-4 shrink-0"
              >
                <div className="hidden md:flex items-center gap-2 pl-2">
                  {NAV_LINKS.map(({ href, label }) => {
                    const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full hover:text-[#C8102E] transition-colors ${
                          active ? "text-[#C8102E] bg-red-50" : "text-[#374151]"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
                <div className="flex md:hidden items-center gap-2 pl-2">
                  <Sheet>
                    <SheetTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Open navigation menu"
                          className="h-8 w-8 text-[#1A2B4A] hover:bg-muted/50 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Menu size={18} />
                        </Button>
                      }
                    />
                    <SheetContent side="left" className="w-[280px] bg-white">
                      <SheetHeader className="border-b pb-4 mb-4">
                        <SheetTitle className="text-left text-lg font-bold text-[#C8102E]">Navigation</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-2">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
                          return (
                            <Link
                              key={href}
                              href={href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                active ? "bg-red-50 text-[#C8102E]" : "text-[#374151] hover:bg-slate-50"
                              }`}
                            >
                              <Icon size={14} />
                              <span>{label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="w-[1px] h-6 bg-gray-200" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsShrink(!isShrink)}
                  className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-[#C8102E] shrink-0 mr-1"
                  title="Search Location"
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

      {/* Right side: Menu Section (fixed width for perfect centering) */}
      <div className="flex items-center space-x-4 w-[260px] shrink-0 justify-end">
        {/* Globe/Language Selection Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-[#1A2B4A]" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-32 bg-white border border-gray-100 z-50">
            <DropdownMenuItem className="font-semibold text-[#1A2B4A] cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-600 cursor-pointer">
              हिन्दी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-[#1A2B4A] hover:bg-[#15223b] rounded-full cursor-pointer flex items-center justify-center text-white"
                aria-label="User profile menu"
              >
                <Users className="w-4 h-4 text-white" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 z-50">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="text-[#374151] w-full cursor-pointer">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register" className="text-[#374151] w-full cursor-pointer">
                Create User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 font-semibold cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
