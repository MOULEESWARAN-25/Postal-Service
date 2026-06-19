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
  { href: "/recommender", label: "Recommender",     icon: Sparkles },
  { href: "/analytics",   label: "Analytics",       icon: TrendingUp },
  { href: "/query-resolver", label: "Assistant",    icon: MessageSquare },
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

  const [searchOpen, setSearchOpen] = useState(false);

  const modalRefs = {
    state:       useRef(null),
    district:    useRef(null),
    village:     useRef(null),
    subPostOffice: useRef(null),
    postOffice:  useRef(null),
  };

  const searchDropdownRef = useRef(null);
  const searchButtonRef = useRef(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName === activeTab ? "" : tabName);
  };

  const handleClick = () => {
    setSearchOpen(false);
    setActiveTab("");
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideModal = Object.values(modalRefs).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      const isInsideDropdown = searchDropdownRef.current && searchDropdownRef.current.contains(event.target);
      const isInsideButton = searchButtonRef.current && searchButtonRef.current.contains(event.target);

      if (!isInsideModal && !isInsideDropdown && !isInsideButton) {
        setSearchOpen(false);
        setActiveTab("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common tab button styles
  const tabBase = `relative text-xs p-4 font-semibold flex items-center gap-3 w-full h-full justify-start rounded-xl cursor-pointer transition-colors`;
  const tabActive = `bg-muted text-primary border border-border shadow-sm`;
  const tabInactive = `text-foreground hover:bg-slate-50`;

  // Get active location title for navigation pill display
  const activeLocationTitle = village || (typeof postoffice === "object" ? postoffice?.name : postoffice) || subpostoffice?.name || District || State?.name || "India (National)";

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-white flex items-center justify-between px-8">
      {/* Left side: Logo Section */}
      <div className="flex items-center space-x-2.5 w-[240px] shrink-0 justify-start">
        <img src="/postoffice.png" alt="India Post" className="h-8" />
        <div className="leading-none">
          <p className="text-sm font-extrabold text-primary tracking-tight">Postal Service</p>
          <p className="text-xs font-bold text-secondary uppercase tracking-wider mt-0.5">DSS Portal</p>
        </div>
      </div>

      {/* Center side: Unified Navigation and Search Trigger Pill */}
      <div className="flex-1 max-w-4xl mx-4 flex justify-center relative">
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border border-border">
          {/* Navigation Links inside capsule */}
          <nav className="hidden lg:flex items-center gap-1 pl-2">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full hover:text-primary transition-colors ${
                    active ? "text-primary bg-white shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation Sheet Trigger */}
          <div className="flex lg:hidden items-center pl-2">
            <Sheet>
              <SheetTrigger render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-8 w-8 text-secondary hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
                >
                  <Menu size={16} />
                </Button>
              } />
              <SheetContent side="left" className="w-[280px] bg-white">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-left text-base font-extrabold text-primary">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                          active ? "bg-red-50/50 text-primary" : "text-foreground hover:bg-slate-50"
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

          <div className="w-[1px] h-5 bg-border mx-1" />

          {/* Location Selector Trigger Button */}
          <button
            ref={searchButtonRef}
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-white border border-border text-foreground hover:bg-slate-50 shadow-sm shrink-0 mr-0.5 transition"
            title="Choose Analysis Region"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 10.35a6.35 6.35 0 11-12.7 0 6.35 6.35 0 0112.7 0z"
              />
            </svg>
            <span className="truncate max-w-[150px]">{activeLocationTitle}</span>
          </button>
        </div>

        {/* Dropdown Floating Overlay Location Filter Selector Panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchDropdownRef}
              initial={{ opacity: 0, y: -10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -10, x: "-50%" }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-14 left-1/2 w-full max-w-4xl bg-white border border-border shadow-xl rounded-2xl p-4 flex items-center gap-3 z-50"
            >
              {/* State */}
              <div
                ref={modalRefs.state}
                className={`${tabBase} ${activeTab === "state" ? tabActive : tabInactive}`}
                onClick={(e) => { e.stopPropagation(); handleTabClick("state"); }}
              >
                <Map className="w-4 h-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col truncate text-left">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">State</span>
                  <p className="text-xs text-primary font-bold truncate">{State?.name || "Select State"}</p>
                </div>
                {activeTab === "state" && <RegionSearch />}
              </div>

              <div className="w-[1px] h-8 bg-border shrink-0" />

              {/* District */}
              <div
                ref={modalRefs.district}
                className={`${tabBase} ${activeTab === "district" ? tabActive : tabInactive}`}
                onClick={(e) => { e.stopPropagation(); handleTabClick("district"); }}
              >
                <LandPlot className="w-4 h-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col truncate text-left">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">District</span>
                  <p className="text-xs text-primary font-bold truncate">{District || "Select"}</p>
                </div>
                {activeTab === "district" && <DistrictSearch />}
              </div>

              <div className="w-[1px] h-8 bg-border shrink-0" />

              {/* Sub Post Office */}
              <div
                ref={modalRefs.subPostOffice}
                className={`${tabBase} ${activeTab === "subpostoffice" ? tabActive : tabInactive}`}
                onClick={(e) => { e.stopPropagation(); handleTabClick("subpostoffice"); }}
              >
                <MapPinned className="w-4 h-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col truncate text-left">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sub PO</span>
                  <p className="text-xs text-primary font-bold truncate">{subpostoffice?.name || "Select"}</p>
                </div>
                {activeTab === "subpostoffice" && <SubPostOfficeSearch />}
              </div>

              <div className="w-[1px] h-8 bg-border shrink-0" />

              {/* Post Office */}
              <div
                ref={modalRefs.postOffice}
                className={`${tabBase} ${activeTab === "postoffice" ? tabActive : tabInactive}`}
                onClick={(e) => { e.stopPropagation(); handleTabClick("postoffice"); }}
              >
                <Signpost className="w-4 h-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col truncate text-left">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Post Office</span>
                  <p className="text-xs text-primary font-bold truncate">
                    {typeof postoffice === "object" ? (postoffice?.name || "Select") : (postoffice || "Select")}
                  </p>
                </div>
                {activeTab === "postoffice" && <SearchPostOffice />}
              </div>

              <div className="w-[1px] h-8 bg-border shrink-0" />

              {/* Village */}
              <div
                ref={modalRefs.village}
                className={`${tabBase} ${activeTab === "village" ? tabActive : tabInactive}`}
                onClick={(e) => { e.stopPropagation(); handleTabClick("village"); }}
              >
                <MapPinHouse className="w-4 h-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col truncate text-left">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Village</span>
                  <p className="text-xs text-primary font-bold truncate">{village || "Select"}</p>
                </div>
                {activeTab === "village" && <VillageSearch />}
              </div>

              {/* Analyse button */}
              <div className="p-1 shrink-0">
                <Button
                  onClick={handleClick}
                  className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary hover:bg-primary/95 shrink-0 shadow-sm"
                  title="Analyse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                  </svg>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Language and profile */}
      <div className="flex items-center space-x-3 w-[240px] shrink-0 justify-end">
        {/* Globe/Language Selection Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-slate-100 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="Select language"
            >
              <Globe className="w-4 h-4 text-secondary" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-32 bg-white border border-border z-50">
            <DropdownMenuItem className="font-bold text-secondary cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground cursor-pointer">
              हिन्दी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full cursor-pointer flex items-center justify-center text-white transition-colors"
              aria-label="User profile menu"
            >
              <Users className="w-4 h-4 text-white" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-48 bg-white border border-border z-50">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="text-foreground w-full cursor-pointer">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register" className="text-foreground w-full cursor-pointer">
                Create User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive font-bold cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
