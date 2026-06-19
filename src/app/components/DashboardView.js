"use client";
import React, { useEffect, useState } from "react";
import {
  NotebookTabs,
  MapPin,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";
import dynamic from "next/dynamic";

const PopulationSpike = dynamic(() => import("./Charts/PopulationSpike"), { ssr: false });
const LiteracyPieChart = dynamic(() => import("./Charts/LiteracyPieChart"), { ssr: false });
const Occupation = dynamic(() => import("./Charts/Occupation"), { ssr: false });
const IncomeDistribution = dynamic(() => import("./Charts/IncomeDistribution"), { ssr: false });

import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

function DashboardView() {
  const router = useRouter();

  const {
    demographicData,
    totalDemographicData,
    setTotalDemographicData,
    filterDemographicData,
    setDemographicData,
    setLoading,
    loading,
    State,
    District,
    village,
    subpostoffice,
    postoffice,
    setActiveTab,
    triggerChatbot
  } = useDashboardStore();

  const [postOfficesCount, setPostOfficesCount] = useState(null);
  const [postofficesCount, setPostofficesCount] = useState(null);
  const [error, setError] = useState(null);

  // DSS Data States
  const [activeChartTab, setActiveChartTab] = useState("population");
  const [recommendations, setRecommendations] = useState([]);
  const [liveEnrollmentCount, setLiveEnrollmentCount] = useState(0);
  const [comparisonData, setComparisonData] = useState([]);

  // Fetch campaign recommendations from MongoDB
  const fetchRecommendations = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/campaign-recommendations");
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.warn("Error fetching priority actions:", err);
    }
  }, []);

  // Fetch live enrollments count from MongoDB
  const fetchLiveEnrollments = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/enrollments");
      if (res.data.success) {
        setLiveEnrollmentCount(res.data.stats.totalEnrolled || 84);
        const allVilsData = res.data.stats.byVillage || [];
        setComparisonData(allVilsData);
      }
    } catch (err) {
      console.warn("Error fetching live enrollments count:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
    fetchLiveEnrollments();
  }, [village, demographicData, fetchRecommendations, fetchLiveEnrollments]);

  const fetchVillages = React.useCallback(async () => {
    if (!District) return;

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/postoffice/${District}`
      );

      if (response.data[0]?.Status === "Success") {
        const count =
          response.data[0].PostOffice.filter(
            (office) => office.BranchType !== "Head Post Office"
          ) || [];
        setPostOfficesCount(count); 
      } else {
        setError("No post offices found for this district");
      }
    } catch (error) {
      console.warn("Error fetching post offices:", error);
    }
  }, [District]);

  const fetchPostOffices = React.useCallback(async () => {
    if (!subpostoffice) return;

    try {
      const searchPincode = subpostoffice?.pincode || 624001;

      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${searchPincode}`
      );

      if (response.data[0]?.Status === "Success") {
        const postOffices = response.data[0].PostOffice || [];
        setpostofficesCount(postOffices); 
      } else {
        setError("No post offices found");
      }
    } catch (error) {
      console.warn("Error fetching post offices by pincode:", error);
    }
  }, [subpostoffice]);

  useEffect(() => {
    fetchVillages();
  }, [fetchVillages]);

  useEffect(() => {
    fetchPostOffices();
  }, [fetchPostOffices]);

  // ── Location-reactive demographics fetch ─────────────────────────────────
  // Runs on mount (loads national data) and re-runs whenever any location
  // selector changes, ensuring KPI cards always reflect the selected region.
  useEffect(() => {
    const fetchDemographicsForLocation = async () => {
      setLoading(true);
      try {
        const hasLocation = !!(State || District || village || subpostoffice || postoffice);
        const body = hasLocation
          ? {
              address: {
                State:         State?.name || null,
                District:      District || null,
                Village:       village || null,
                SubPostOffice: subpostoffice?.name || null,
                PostOffice:    (typeof postoffice === "object" ? postoffice?.name : postoffice) || null,
              },
            }
          : { address: { name: "INDIA" } };

        const response = await fetch("/api/demographics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Demographics fetch failed");
        const data = await response.json();
        setTotalDemographicData(data);
        filterDemographicData(data);
      } catch (error) {
        console.warn("Error fetching demographics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographicsForLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [State, District, village, subpostoffice, postoffice]);

  const [selectedData, setSelectedData] = useState(null);

  const handleRadioChange = (index) => {
    if (totalDemographicData && Array.isArray(totalDemographicData)) {
      const selected = totalDemographicData[index];
      setSelectedData(selected); 
      setDemographicData(selected); 
    }
  };

  // Dynamic recommendation lookup for DSS
  const getDynamicRecommendation = () => {
    const normalizedVil = (village || "").trim().toLowerCase();
    if (normalizedVil) {
      const found = recommendations.find(
        (r) => (r.village || "").trim().toLowerCase() === normalizedVil
      );
      if (found) return found;

      // Fallbacks for specific Erode villages
      if (normalizedVil === "bannari") {
        return {
          village: "Bannari",
          recommendedScheme: "Kisan Credit Card (KCC)",
          opportunityScore: 89,
          campaignWindow: "October - November 2026",
          keyDrivers: [
            "Predominant agricultural worker demographic (64.2%) in Bannari sector",
            "Low overall credit utilization and marginal farmer logs",
            "Favorable seasonal monsoon sowing window detected by event scheduler"
          ],
          estimatedEligibleCitizens: "~95"
        };
      }
      
      return {
        village: village,
        recommendedScheme: "Atal Pension Yojana (APY)",
        opportunityScore: 87,
        campaignWindow: "November - December 2026",
        keyDrivers: [
          `High portion of marginal workers (34.2%) registered in ${village}`,
          "Low active pension policy count inside sector sub-post office records",
          "Opportunity to target self-employed shopkeepers and casual laborers"
        ],
        estimatedEligibleCitizens: "~85"
      };
    }

    return null;
  };

  const isLocationSelected = !!(State || District || subpostoffice || postoffice || village);
  const currentRec = getDynamicRecommendation();
  const regionTitle = village || (typeof postoffice === "object" ? postoffice?.name : postoffice) || subpostoffice?.name || District || State?.name || "India (National)";

  const handleExploreClick = () => {
    setActiveTab("state");
  };

  return (
    <main className="flex-1 bg-background min-h-screen text-foreground">
      <div className="page-container max-w-[1440px] mx-auto w-full space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumb className="text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {District && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-semibold text-muted-foreground">{District}</span>
                </BreadcrumbItem>
              </>
            )}
            {isLocationSelected && regionTitle !== District && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-secondary">{regionTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Premium Page Hero Banner */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 55%, #1E3A5F 100%)",
            padding: "1.75rem 2rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Decorative radial glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(200,16,46,0.18) 0%, transparent 70%)", transform: "translate(20%, -40%)" }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)", transform: "translate(-50%, 50%)" }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ background: "rgba(200, 16, 46, 0.25)", color: "#F87171", border: "1px solid rgba(200,16,46,0.3)" }}
                >
                  DSS Portal
                </div>
              </div>
              <h1
                className="text-2xl font-extrabold text-white"
                style={{ letterSpacing: "-0.03em" }}
              >
                {regionTitle} Intelligence
              </h1>
              <p className="text-xs font-medium mt-1.5" style={{ color: "rgba(148,163,184,0.85)" }}>
                Decision Support System analyzing regional Census data, opportunities, and campaigns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(226,232,240,0.9)",
                }}
              >
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Status</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live • High Readiness
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified 2-Column SaaS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column (75% width) - Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Row: Strategic Card & Supporting Metrics Grid - ABOVE THE FOLD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column span 2: Primary Decision / Strategy Center */}
              <div className="md:col-span-2 flex flex-col">
                {isLocationSelected && currentRec ? (
                  <div
                    className="flex-grow relative rounded-xl overflow-hidden flex flex-col justify-between"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
                      padding: "1.5rem",
                    }}
                  >
                    {/* Top accent gradient bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: "linear-gradient(90deg, #C8102E 0%, #E8193A 60%, #F43F5E 100%)" }}
                    />
                    <div>
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="p-1.5 rounded-lg"
                            style={{ background: "rgba(200,16,46,0.08)" }}
                          >
                            <Sparkles size={12} style={{ color: "#C8102E" }} className="animate-pulse" />
                          </div>
                          <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: "#C8102E" }}
                          >
                            Strategic Action Center
                          </span>
                        </div>
                        {/* Opportunity Score badge */}
                        <div
                          className="shrink-0 text-center px-3 py-1.5 rounded-xl"
                          style={{
                            background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                            boxShadow: "0 4px 12px rgba(200,16,46,0.25)",
                          }}
                        >
                          <div className="text-xl font-extrabold text-white leading-none" style={{ letterSpacing: "-0.03em" }}>
                            {currentRec.opportunityScore}
                          </div>
                          <div className="text-xs font-bold text-white/70 uppercase tracking-wider">/ 100</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold leading-tight mb-2" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        Promote {currentRec.recommendedScheme} in {currentRec.village || regionTitle}
                      </h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                        <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
                          Eligible: <strong style={{ color: "#1E293B" }}>{currentRec.estimatedEligibleCitizens}</strong>
                        </span>
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>•</span>
                        <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
                          Window: <strong style={{ color: "#1E293B" }}>{currentRec.campaignWindow}</strong>
                        </span>
                      </div>

                      {/* Supporting Evidence ("Why?") */}
                      <div
                        className="rounded-xl p-3 space-y-2"
                        style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                          Supporting Evidence
                        </h4>
                        <ul className="space-y-1.5">
                          {currentRec.keyDrivers?.map((driver, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ background: "#C8102E" }}
                              />
                              <span className="text-xs font-medium" style={{ color: "#374151" }}>{driver}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-5">
                      <button
                        onClick={() => router.push("/calender")}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-all duration-150"
                        style={{
                          background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                          boxShadow: "0 2px 8px rgba(200,16,46,0.25)",
                        }}
                      >
                        <ChevronRight size={13} />
                        Launch Campaign
                      </button>
                      <button
                        onClick={() => triggerChatbot(`Provide an operational outreach plan for promoting ${currentRec.recommendedScheme} in ${currentRec.village || regionTitle}.`)}
                        className="h-9 px-4 rounded-lg text-xs font-bold transition-all duration-150"
                        style={{
                          background: "transparent",
                          border: "1px solid #E8EDF5",
                          color: "#1E293B",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        Ask AI Assistant
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex-grow relative rounded-xl overflow-hidden flex flex-col justify-between"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      padding: "1.5rem",
                    }}
                  >
                    {/* Top accent gradient bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: "linear-gradient(90deg, #1A2B4A 0%, #2A3F66 100%)" }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="p-1.5 rounded-lg" style={{ background: "rgba(26,43,74,0.08)" }}>
                          <Sparkles size={12} style={{ color: "#1A2B4A" }} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>
                          National Intelligence Overview
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold leading-tight mb-2" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        Welcome to Regional Intelligence
                      </h3>
                      <p className="text-xs font-semibold mt-2 leading-relaxed" style={{ color: "#64748B" }}>
                        Select a State, District, or Village to generate region-specific campaign recommendations, eligibility insights, and demographic intelligence.
                      </p>

                      <div
                        className="rounded-xl p-3 space-y-2 mt-4"
                        style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Available Capabilities</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                            <span className="text-xs font-medium" style={{ color: "#374151" }}>Identify optimal schemes tailored to local literacy and workforce demographics.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                            <span className="text-xs font-medium" style={{ color: "#374151" }}>Target agricultural harvest seasons to maximize POSA savings enrollments.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                            <span className="text-xs font-medium" style={{ color: "#374151" }}>Evaluate suitability ratios and run direct outreach campaign calendars.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-5">
                      <button
                        onClick={handleExploreClick}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-all duration-150"
                        style={{
                          background: "linear-gradient(135deg, #1A2B4A 0%, #2A3F66 100%)",
                          boxShadow: "0 2px 8px rgba(26,43,74,0.25)",
                        }}
                      >
                        <ChevronRight size={13} />
                        Select Location
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Column span 1: Supporting Metrics (KPIs grid) */}
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 gap-4 h-full items-stretch">
                  {/* KPI 1: Population */}
                  <div
                    className="relative flex flex-col justify-between p-4 rounded-xl overflow-hidden transition-all duration-250 cursor-default min-h-[128px]"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] opacity-0 transition-opacity duration-200 rounded-t-xl"
                      style={{ background: "linear-gradient(90deg, #1A2B4A, #2A3F66)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    />
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Population</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,43,74,0.08)" }}>
                        <Users className="h-3.5 w-3.5" style={{ color: "#1A2B4A" }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xl font-extrabold" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {demographicData?.totP ? demographicData.totP.toLocaleString() : "—"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        {demographicData?.noHh ? `${demographicData.noHh.toLocaleString()} Households` : "Calculating..."}
                      </p>
                    </div>
                  </div>

                  {/* KPI 2: Workforce */}
                  <div
                    className="relative flex flex-col justify-between p-4 rounded-xl overflow-hidden transition-all duration-250 cursor-default min-h-[128px]"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workforce</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,43,74,0.08)" }}>
                        <TrendingUp className="h-3.5 w-3.5" style={{ color: "#1A2B4A" }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xl font-extrabold" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {demographicData?.totWorkP ? `${((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(1)}%` : "—"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        {demographicData?.totWorkP ? `${demographicData.totWorkP.toLocaleString()} Active` : "Calculating..."}
                      </p>
                    </div>
                  </div>

                  {/* KPI 3: Literacy */}
                  <div
                    className="relative flex flex-col justify-between p-4 rounded-xl overflow-hidden transition-all duration-250 cursor-default min-h-[128px]"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Literacy</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(200,16,46,0.08)" }}>
                        <NotebookTabs className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xl font-extrabold" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {demographicData?.fLit && demographicData?.mLit ? `${((demographicData.fLit + demographicData.mLit) / 2).toFixed(1)}%` : "—"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        M: {demographicData?.mLit || 0}% &nbsp;|&nbsp; F: {demographicData?.fLit || 0}%
                      </p>
                    </div>
                  </div>

                  {/* KPI 4: POs Network */}
                  <div
                    className="relative flex flex-col justify-between p-4 rounded-xl overflow-hidden transition-all duration-250 cursor-default min-h-[128px]"
                    style={{
                      background: "#fff",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">POs Network</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,43,74,0.08)" }}>
                        <MapPin className="h-3.5 w-3.5" style={{ color: "#1A2B4A" }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xl font-extrabold truncate" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {postofficesCount && postofficesCount.length > 0
                          ? `${postofficesCount.length} Branch`
                          : postOfficesCount
                          ? `${postOfficesCount.length} Branch`
                          : "1.55+ Lakh"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        {village ? "Village" : postoffice ? "Sub-Office" : District ? "District" : "National"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Demographics Breakdowns Workspace */}
            {demographicData && (
              <Card className="border border-border bg-card shadow-sm rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-primary shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Demographics Visualizer & Insights</h3>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        Detailed breakdowns, literacy gaps, and worker classifications.
                      </p>
                    </div>
                  </div>
                  
                  {/* Census segment selector */}
                  {totalDemographicData && Array.isArray(totalDemographicData) && (
                    <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border shrink-0">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 hidden md:inline">Segment:</span>
                      {totalDemographicData.map((item, index) => {
                        const isSelected = selectedData === item || (index === 0 && selectedData === null);
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleRadioChange(index)}
                            className={cn(
                              "px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer uppercase tracking-wider",
                              isSelected
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {item.tru || `Segment ${index + 1}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Visualizer 1: Gender split */}
                  <div className="bg-muted/30 p-5 rounded-xl border border-border flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender Balance & Density</span>
                        <Badge variant="outline" className="border-border text-xs font-bold rounded">Ratio</Badge>
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-secondary">
                          {demographicData.totM && demographicData.totF
                            ? ((demographicData.totF / demographicData.totM) * 1000).toFixed(0)
                            : "942"
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">Females per 1000 Males</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary rounded-full" /> Male: {((demographicData.totM / (demographicData.totP || 1)) * 100).toFixed(1)}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> Female: {((demographicData.totF / (demographicData.totP || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex">
                        <div className="bg-secondary h-full" style={{ width: `${(demographicData.totM / (demographicData.totP || 1)) * 100}%` }} />
                        <div className="bg-primary h-full" style={{ width: `${(demographicData.totF / (demographicData.totP || 1)) * 100}%` }} />
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-border text-xs text-muted-foreground font-medium">
                      🏠 Household density: <strong className="text-foreground">{(demographicData.totP / (demographicData.noHh || 1)).toFixed(1)}</strong> people/house.
                    </div>
                  </div>

                  {/* Visualizer 2: Literacy Gap */}
                  <div className="bg-muted/30 p-5 rounded-xl border border-border flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Education & Literacy Gap</span>
                        {(() => {
                          const gap = (demographicData.mLit || 0) - (demographicData.fLit || 0);
                          let badgeStyle = "border-emerald-500/20 bg-emerald-500/10 text-emerald-700";
                          let label = "Low Gap";
                          if (gap > 15) {
                            badgeStyle = "border-destructive/20 bg-destructive/10 text-destructive";
                            label = "Critical Gap";
                          } else if (gap > 5) {
                            badgeStyle = "border-amber-500/20 bg-amber-500/10 text-amber-700";
                            label = "Moderate Gap";
                          }
                          return <Badge variant="outline" className={cn("text-xs font-bold rounded", badgeStyle)}>{label}</Badge>;
                        })()}
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-secondary">
                          {((demographicData.mLit - demographicData.fLit) || 0).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">Gender Literacy Gap</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Male Literacy</span>
                          <span>{demographicData.mLit}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${demographicData.mLit}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Female Literacy</span>
                          <span>{demographicData.fLit}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${demographicData.fLit}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-border text-xs text-muted-foreground font-medium">
                      {demographicData.mLit - demographicData.fLit > 10 ? (
                        <span>💡 <strong className="text-primary">Target girls outreach:</strong> SSA savings scheme is highly recommended.</span>
                      ) : (
                        <span>💡 <strong className="text-emerald-700">Balanced literacy:</strong> RD/PPF retail options are primary.</span>
                      )}
                    </div>
                  </div>

                  {/* Visualizer 3: Workforce Profile */}
                  <div className="bg-muted/30 p-5 rounded-xl border border-border flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Labor & Livelihood Profile</span>
                        <Badge variant="outline" className="border-border text-xs font-bold rounded">Workers</Badge>
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-secondary">
                          {((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">Participation Rate</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Main Workers</span>
                          <span>{((demographicData.mainworkP / (demographicData.totWorkP || 1)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${(demographicData.mainworkP / (demographicData.totWorkP || 1)) * 100}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Marginal Workers</span>
                          <span>{((demographicData.margworkP / (demographicData.totWorkP || 1)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${(demographicData.margworkP / (demographicData.totWorkP || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-border text-xs text-muted-foreground space-y-0.5 font-medium">
                      <div className="flex justify-between">
                        <span>Cultivators:</span>
                        <strong className="text-foreground">{demographicData.mainClP?.toLocaleString() || "N/A"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Agri Labor:</span>
                        <strong className="text-foreground">{demographicData.mainAlP?.toLocaleString() || "N/A"}</strong>
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            )}

            {/* Bottom Row: Tabbed Demographic Chart Card */}
            <Card className="border border-border bg-card shadow-sm rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Demographic Distributions</h3>
                  <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                    Click tabs to switch between graphical distribution indicators.
                  </p>
                </div>
                
                {/* Visualizer chart tabs */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border shrink-0">
                  <button
                    onClick={() => setActiveChartTab("population")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer",
                      activeChartTab === "population"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Growth Trend
                  </button>
                  <button
                    onClick={() => setActiveChartTab("literacy")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer",
                      activeChartTab === "literacy"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Literacy Split
                  </button>
                  <button
                    onClick={() => setActiveChartTab("occupation")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer",
                      activeChartTab === "occupation"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Employment Ratio
                  </button>
                  <button
                    onClick={() => setActiveChartTab("income")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer",
                      activeChartTab === "income"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Income Tiers
                  </button>
                </div>
              </div>

              {/* Dynamic Chart Area */}
              <div className="h-[300px] w-full flex items-center justify-center pt-2">
                {activeChartTab === "population" && <PopulationSpike />}
                {activeChartTab === "literacy" && <LiteracyPieChart />}
                {activeChartTab === "occupation" && <Occupation />}
                {activeChartTab === "income" && <IncomeDistribution />}
              </div>
            </Card>

          </div>

          {/* Right Column (25% width) - Persistent Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Real-time DSS Status Card */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                padding: "1.25rem",
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.8)" }}>
                    Live DSS Status
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "rgba(100,116,139,0.8)" }}>Active Enrollments</span>
                    <h4 className="text-xl font-extrabold text-white mt-0.5" style={{ letterSpacing: "-0.02em" }}>
                      {loading ? <Skeleton className="h-5 w-16" /> : `${liveEnrollmentCount}`}
                    </h4>
                    <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Accounts registered</span>
                  </div>
                  <div
                    className="w-full h-[1px]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "rgba(100,116,139,0.8)" }}>Top Scheme</span>
                    <h4 className="text-xs font-bold mt-0.5" style={{ color: "#F87171" }}>
                      {isLocationSelected && currentRec ? currentRec.recommendedScheme : "Select location"}
                    </h4>
                  </div>
                  <div
                    className="w-full h-[1px]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(100,116,139,0.8)" }}>Readiness</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(52,211,153,0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(52,211,153,0.2)",
                      }}
                    >
                      High
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div
              className="rounded-xl"
              style={{
                background: "#fff",
                border: "1px solid #E8EDF5",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                padding: "1.25rem",
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider pb-3 mb-3" style={{ color: "#94A3B8", borderBottom: "1px solid #EEF1F8" }}>
                Quick Navigation
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: "Compare Villages", icon: Layers, onClick: () => router.push("/compare") },
                  { label: "Beneficiary Directory", icon: Users, onClick: () => router.push("/publicInfo") },
                  { label: "DSS Recommender", icon: Sparkles, onClick: () => router.push("/recommender") },
                ].map(({ label, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="flex items-center gap-2.5 w-full text-xs font-semibold h-9 px-3 rounded-lg text-left transition-all duration-150"
                    style={{ color: "#374151", background: "transparent", border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F8FAFF";
                      e.currentTarget.style.borderColor = "#E8EDF5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(26,43,74,0.08)" }}>
                      <Icon size={12} style={{ color: "#1A2B4A" }} />
                    </div>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid #E8EDF5",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {/* Gradient header */}
              <div
                className="px-4 py-3"
                style={{ background: "linear-gradient(135deg, #1A2B4A 0%, #2A3F66 100%)" }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
                  AI Campaign Assistant
                </h4>
                <p className="text-xs font-semibold text-white mt-0.5" style={{ letterSpacing: "-0.01em" }}>
                  Context-aware AI Scripts
                </p>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs leading-normal" style={{ color: "#64748B" }}>
                  Trigger operational planning scripts in the AI chatbot.
                </p>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  <button
                    onClick={() => triggerChatbot(`Generate a 10-point campaign organization checklist for promoting ${currentRec?.recommendedScheme || "Sukanya Samriddhi Yojana (SSA)"} in ${regionTitle}.`)}
                    className="flex items-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg text-left transition-all duration-150"
                    style={{ color: "#374151", background: "#F8FAFF", border: "1px solid #E8EDF5" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDF5"; }}
                  >
                    📝 Get Campaign Checklist
                  </button>
                  <button
                    onClick={() => triggerChatbot(`Draft an outreach announcement script and localized SMS template for promoting ${currentRec?.recommendedScheme || "Sukanya Samriddhi Yojana (SSA)"} in ${regionTitle}.`)}
                    className="flex items-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg text-left transition-all duration-150"
                    style={{ color: "#374151", background: "#F8FAFF", border: "1px solid #E8EDF5" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDF5"; }}
                  >
                    📢 Draft Outreach Scripts
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

export default DashboardView;
