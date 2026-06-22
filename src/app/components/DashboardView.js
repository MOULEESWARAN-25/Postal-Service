"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  NotebookTabs,
  MapPin,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import dynamic from "next/dynamic";

const PopulationSpike = dynamic(() => import("./Charts/PopulationSpike"), { ssr: false });
const LiteracyPieChart = dynamic(() => import("./Charts/LiteracyPieChart"), { ssr: false });
const Occupation = dynamic(() => import("./Charts/Occupation"), { ssr: false });
const IncomeDistribution = dynamic(() => import("./Charts/IncomeDistribution"), { ssr: false });

import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { calculateVillageRecommendations } from "@/lib/recommendationEngine";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import DSSMethodologyModal from "./DSSMethodologyModal";

function DashboardView() {
  const router = useRouter();
  const { t } = useTranslation();

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
  const [postofficesCount, setpostofficesCount] = useState(null);
  const [error, setError] = useState(null);

  // DSS Data States
  const [activeChartTab, setActiveChartTab] = useState("population");
  const [recommendations, setRecommendations] = useState([]);
  const [liveEnrollmentCount, setLiveEnrollmentCount] = useState(0);
  const [comparisonData, setComparisonData] = useState([]);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

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
        setLiveEnrollmentCount(res.data.stats.totalEnrolled || 0);
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

  const getWeightedLiteracy = () => {
    if (!demographicData) return "—";
    const totM = demographicData.totM || 0;
    const totF = demographicData.totF || 0;
    const totP = demographicData.totP || 1;
    const mLit = demographicData.mLit || 0;
    const fLit = demographicData.fLit || 0;
    const litPop = totM * (mLit / 100) + totF * (fLit / 100);
    return ((litPop / totP) * 100).toFixed(1) + "%";
  };

  const getRecommendationEvidence = (schemeName, dem) => {
    if (!dem) return null;
    const totP = dem.totP || 1;
    const totM = dem.totM || 0;
    const totF = dem.totF || 0;
    const mLit = dem.mLit || 82.1;
    const fLit = dem.fLit || 65.5;
    const litPop = totM * (mLit / 100) + totF * (fLit / 100);
    const literacyRate = (litPop / totP) * 100;

    const mainAlP = dem.mainAlP || 0;
    const mainClP = dem.mainClP || 0;
    const margAlP = dem.margAlP || 0;
    const margClP = dem.margClP || 0;
    const agriWorkers = mainAlP + mainClP + margAlP + margClP;
    const agriRatio = agriWorkers / totP;

    const childPop = dem.population717 || 0;
    const childRatio = childPop / totP;

    const seniorPop = dem.population60Plus || 0;
    const seniorRatio = seniorPop / totP;

    const mainOtP = dem.mainOtP || 0;
    const margOtP = dem.margOtP || 0;
    const salariedWorkers = mainOtP + margOtP;
    const salariedRatio = salariedWorkers / totP;

    const youthPop = dem.population1824 || 0;
    const youthRatio = youthPop / totP;

    const name = schemeName || "";
    
    if (name.includes("Sukanya")) {
      return {
        factors: [
          { label: "School-age Children", value: childPop },
          { label: "Total Population", value: totP },
          { label: "Child Ratio", value: `${(childRatio * 100).toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(45 + childRatio * 300))",
        explanation: `45 + (${childRatio.toFixed(3)} × 300)`
      };
    } else if (name.includes("Kisan Vikas Patra") || name.includes("KVP")) {
      return {
        factors: [
          { label: "Agricultural Workers", value: agriWorkers },
          { label: "Total Population", value: totP },
          { label: "Agricultural Ratio", value: `${(agriRatio * 100).toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(45 + agriRatio * 200))",
        explanation: `45 + (${agriRatio.toFixed(3)} × 200)`
      };
    } else if (name.includes("Senior Citizens") || name.includes("SCSS")) {
      return {
        factors: [
          { label: "Senior Citizens (60+)", value: seniorPop },
          { label: "Total Population", value: totP },
          { label: "Senior Ratio", value: `${(seniorRatio * 100).toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(30 + seniorRatio * 400))",
        explanation: `30 + (${seniorRatio.toFixed(3)} × 400)`
      };
    } else if (name.includes("Public Provident Fund") || name.includes("PPF")) {
      return {
        factors: [
          { label: "Salaried/Other Workers", value: salariedWorkers },
          { label: "Total Population", value: totP },
          { label: "Salaried Ratio", value: `${(salariedRatio * 100).toFixed(1)}%` },
          { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(30 + salariedRatio * 400 + literacyRate * 0.3))",
        explanation: `30 + (${salariedRatio.toFixed(3)} × 400) + (${literacyRate.toFixed(1)} × 0.3)`
      };
    } else if (name.includes("Savings Account (SB)") || name.includes("Savings Account")) {
      return {
        factors: [
          { label: "Total Population", value: totP },
          { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(50 + literacyRate * 0.5))",
        explanation: `50 + (${literacyRate.toFixed(1)} × 0.5)`
      };
    } else if (name.includes("Recurring Deposit") || name.includes("RD")) {
      return {
        factors: [
          { label: "Agricultural Workers", value: agriWorkers },
          { label: "Total Population", value: totP },
          { label: "Agricultural Ratio", value: `${(agriRatio * 100).toFixed(1)}%` },
          { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(45 + agriRatio * 200 + (100 - literacyRate) * 0.3))",
        explanation: `45 + (${agriRatio.toFixed(3)} × 200) + (${(100 - literacyRate).toFixed(1)} × 0.3)`
      };
    } else if (name.includes("Time Deposit") || name.includes("TD")) {
      return {
        factors: [
          { label: "Salaried/Other Workers", value: salariedWorkers },
          { label: "Total Population", value: totP },
          { label: "Salaried Ratio", value: `${(salariedRatio * 100).toFixed(1)}%` },
          { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(30 + salariedRatio * 300 + literacyRate * 0.2))",
        explanation: `30 + (${salariedRatio.toFixed(3)} × 300) + (${literacyRate.toFixed(1)} × 0.2)`
      };
    } else if (name.includes("Monthly Income") || name.includes("MIS")) {
      return {
        factors: [
          { label: "Senior Citizens (60+)", value: seniorPop },
          { label: "Senior Ratio", value: `${(seniorRatio * 100).toFixed(1)}%` },
          { label: "Agricultural Ratio", value: `${(agriRatio * 100).toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(35 + seniorRatio * 350 + (1 - agriRatio) * 20))",
        explanation: `35 + (${seniorRatio.toFixed(3)} × 350) + (${(1 - agriRatio).toFixed(3)} × 20)`
      };
    } else if (name.includes("Savings Certificate") || name.includes("NSC")) {
      return {
        factors: [
          { label: "Salaried/Other Workers", value: salariedWorkers },
          { label: "Salaried Ratio", value: `${(salariedRatio * 100).toFixed(1)}%` },
          { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        ],
        formula: "min(100, Math.round(25 + salariedRatio * 350 + literacyRate * 0.2))",
        explanation: `25 + (${salariedRatio.toFixed(3)} × 350) + (${literacyRate.toFixed(1)} × 0.2)`
      };
    } else if (name.includes("Mahila Samman") || name.includes("MSSC")) {
      const femaleRatio = totF / totP;
      const genderGap = mLit - fLit;
      return {
        factors: [
          { label: "Female Population", value: totF },
          { label: "Total Population", value: totP },
          { label: "Female Ratio", value: `${(femaleRatio * 100).toFixed(1)}%` },
          { label: "Gender Literacy Gap", value: `${genderGap.toFixed(1)}%` }
        ],
        formula: "min(100, Math.round(40 + femaleRatio * 100 + genderGap * 0.5))",
        explanation: `40 + (${femaleRatio.toFixed(3)} × 100) + (${genderGap.toFixed(1)} × 0.5)`
      };
    } else if (name.includes("Atal Pension") || name.includes("APY")) {
      return {
        factors: [
          { label: "Agricultural Workers", value: agriWorkers },
          { label: "Agricultural Ratio", value: `${(agriRatio * 100).toFixed(1)}%` },
          { label: "Youth Population (18-24)", value: youthPop },
          { label: "Youth Ratio", value: `${(youthRatio * 100).toFixed(1)}%` }
        ],
        formula: "min(100, Math.round(35 + agriRatio * 200 + youthRatio * 200))",
        explanation: `35 + (${agriRatio.toFixed(3)} × 200) + (${youthRatio.toFixed(3)} × 200)`
      };
    }

    return {
      factors: [
        { label: "Weighted Literacy Rate", value: `${literacyRate.toFixed(1)}%` },
        { label: "Agricultural Ratio", value: `${(agriRatio * 100).toFixed(1)}%` },
        { label: "Total Population", value: totP }
      ],
      formula: "Capped priority rules based on target segment ratios",
      explanation: "Scored dynamically based on village segment representation."
    };
  };

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
    if (demographicData) {
      const computed = calculateVillageRecommendations(demographicData);
      if (computed && computed.length > 0) {
        const top = computed[0];
        return {
          village: village || regionTitle,
          recommendedScheme: top.name,
          opportunityScore: top.score,
          campaignWindow: top.campaignWindow,
          keyDrivers: top.keyDrivers,
          estimatedEligibleCitizens: `~${top.expectedImpact}`,
          evidence: top.evidence,
          gap: top.gap,
          source: top.source,
          lastUpdated: top.lastUpdated
        };
      }
    }

    const normalizedVil = (village || "").trim().toLowerCase();
    if (normalizedVil) {
      const found = recommendations.find(
        (r) => (r.village || "").trim().toLowerCase() === normalizedVil
      );
      if (found) return found;
    }

    return null;
  };

  const isLocationSelected = !!(State || District || subpostoffice || postoffice || village);
  const regionTitle = village || (typeof postoffice === "object" ? postoffice?.name : postoffice) || subpostoffice?.name || District || State?.name || "India (National)";
  const currentRec = getDynamicRecommendation();

  const lastLoggedVillage = useRef(null);

  const logRecommendationAudit = async (rec) => {
    if (!rec || !rec.village) return;
    try {
      await axios.post("/api/audit-logs", {
        actionType: "VIEW_RECOMMENDATION",
        location: rec.village,
        recommendation: rec.recommendedScheme,
        opportunityIndex: rec.opportunityScore,
        userActionTime: new Date()
      });
    } catch (err) {
      console.warn("Failed to write audit log:", err);
    }
  };

  const handleLaunchCampaign = async () => {
    if (currentRec) {
      try {
        await axios.post("/api/audit-logs", {
          actionType: "LAUNCH_CAMPAIGN",
          location: currentRec.village || regionTitle,
          recommendation: currentRec.recommendedScheme,
          opportunityIndex: currentRec.opportunityScore,
          userActionTime: new Date()
        });
      } catch (err) {
        console.warn("Failed to log campaign launch:", err);
      }
    }
    router.push("/calender");
  };

  useEffect(() => {
    if (demographicData && currentRec) {
      const uniqueId = `${demographicData.name || "India"}-${currentRec.recommendedScheme}`;
      if (lastLoggedVillage.current !== uniqueId) {
        lastLoggedVillage.current = uniqueId;
        logRecommendationAudit(currentRec);
      }
    }
  }, [demographicData, currentRec]);

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
                  {t("dssPortal")}
                </div>
              </div>
              <h1
                className="text-2xl font-extrabold text-white"
                style={{ letterSpacing: "-0.03em" }}
              >
                {regionTitle} {t("intelligence")}
              </h1>
              <p className="text-xs font-medium mt-1.5" style={{ color: "rgba(148,163,184,0.85)" }}>
                {t("dssDescription")}
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
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{t("status")}</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {t("liveReady")}
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
                            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                            style={{ color: "#C8102E" }}
                          >
                            {t("strategicActionCenter")}
                            <button
                              type="button"
                              onClick={() => setIsMethodologyOpen(true)}
                              className="text-[10px] lowercase font-normal underline hover:opacity-80 transition cursor-pointer border-none bg-transparent"
                              style={{ color: "#C8102E" }}
                            >
                              ({t("methodology")} ⓘ)
                            </button>
                          </span>
                        </div>
                        {/* DSS Opportunity Index badge */}
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            className="shrink-0 text-center px-3 py-1.5 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setIsMethodologyOpen(true)}
                            style={{
                              background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                              boxShadow: "0 4px 12px rgba(200,16,46,0.25)",
                              border: "none"
                            }}
                          >
                            <div className="text-xl font-extrabold text-white leading-none" style={{ letterSpacing: "-0.03em" }}>
                              {currentRec.opportunityScore}
                            </div>
                            <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mt-0.5">Index ⓘ</div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-0 text-xs p-2.5 max-w-xs shadow-md z-[100]">
                            <p className="font-bold mb-1">DSS Opportunity Index</p>
                            <p className="text-[10px] text-slate-300">
                              Suitability priority index (0-100) calculated from demographic density and segment ratios. Click to view methodology overview.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      <h3 className="text-lg font-extrabold leading-tight mb-2" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {t("promote")} {currentRec.recommendedScheme} {t("in")} {currentRec.village || regionTitle}
                      </h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                        <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
                          {t("eligible")}: <strong style={{ color: "#1E293B" }}>{currentRec.estimatedEligibleCitizens}</strong>
                        </span>
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>•</span>
                        <span className="text-xs font-semibold" style={{ color: "#64748B" }}>
                          {t("window")}: <strong style={{ color: "#1E293B" }}>{currentRec.campaignWindow}</strong>
                        </span>
                      </div>

                      {/* Supporting Evidence ("Why?") */}
                      <div
                        className="rounded-xl p-3 space-y-2"
                        style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                          {t("supportingEvidence")}
                        </h4>
                        <ul className="space-y-1.5 mb-3">
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
  
                          {/* DSS Metadata Panel */}
                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dashed border-border/80 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            <div>
                              <span>Evidence:</span> <span className="text-foreground normal-case font-bold">{currentRec.evidence}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Gap Ratio:</span>
                              <Tooltip>
                                <TooltipTrigger className="cursor-help hover:opacity-80" aria-label="Gap ratio explanation">
                                  <HelpCircle size={10} className="text-muted-foreground/60" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-0 text-xs p-2.5 max-w-xs shadow-md z-[100]">
                                  <p className="font-bold mb-1">Gap Ratio ⓘ</p>
                                  <p className="text-[10px] text-slate-300">
                                    Refers to estimated target market penetration gap. Lower gap indicates high potential saturation.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <span className="text-foreground normal-case font-bold">{currentRec.gap}</span>
                            </div>
                            <div>
                              <span>Source:</span> <span className="text-foreground normal-case font-bold">{currentRec.source}</span>
                            </div>
                            <div>
                              {currentRec.lastUpdated === "Census 2011 PCA" ? (
                                <><span>Dataset Version:</span> <span className="text-foreground normal-case font-bold">Census 2011 PCA</span></>
                              ) : (
                                <><span>Last Updated:</span> <span className="text-foreground normal-case font-bold">{currentRec.lastUpdated}</span></>
                              )}
                            </div>
                          </div>
  
                          {/* Collapsible Evidence Details (Drawer/Panel) */}
                          <div className="pt-3 border-t border-dashed border-border/80">
                            <button
                              type="button"
                              onClick={() => setIsEvidenceOpen(!isEvidenceOpen)}
                              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 uppercase tracking-wider"
                            >
                              <span>{isEvidenceOpen ? `${t("hideEvidence")} ▲` : `${t("whyScheme", { scheme: currentRec.recommendedScheme })} (${t("viewEvidence")}) ▼`}</span>
                            </button>
  
                            {isEvidenceOpen && (() => {
                              const evidence = getRecommendationEvidence(currentRec.recommendedScheme, demographicData);
                              if (!evidence) return null;
                              return (
                                <div className="mt-2.5 p-3 bg-white rounded-lg border border-slate-100 space-y-2 text-[11px] text-slate-700 font-semibold normal-case">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Demographic Inputs</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                      {evidence.factors.map((f, idx) => (
                                        <div key={idx} className="flex justify-between border-b border-dashed border-slate-100 pb-0.5">
                                          <span className="text-slate-500">{f.label}:</span>
                                          <span className="font-bold text-slate-900">{f.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  </div>
                              );
                            })()}
                          </div>
  
                        </div>
                      </div>
  
                      <div className="flex gap-2 flex-wrap mt-5">
                        <button
                          onClick={handleLaunchCampaign}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white transition-all duration-150"
                          style={{
                            background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                            boxShadow: "0 2px 8px rgba(200,16,46,0.25)",
                          }}
                        >
                          <ChevronRight size={13} />
                          {t("launchCampaign")}
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
                          {t("askAssistant")}
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
                            {t("nationalIntelligenceOverview")}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold leading-tight mb-2" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                          {t("welcomeTitle")}
                        </h3>
                        <p className="text-xs font-semibold mt-2 leading-relaxed" style={{ color: "#64748B" }}>
                          {t("welcomeDesc")}
                        </p>
  
                        <div
                          className="rounded-xl p-3 space-y-2 mt-4"
                          style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{t("availableCapabilities")}</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                              <span className="text-xs font-medium" style={{ color: "#374151" }}>{t("cap1")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                              <span className="text-xs font-medium" style={{ color: "#374151" }}>{t("cap2")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#1A2B4A" }} />
                              <span className="text-xs font-medium" style={{ color: "#374151" }}>{t("cap3")}</span>
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
                          {t("chooseAnalysisRegion")}
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
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("population")}</span>
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
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("workforce")}</span>
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
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        {t("literacy")}
                        <Tooltip>
                          <TooltipTrigger className="cursor-help hover:opacity-80" aria-label="Literacy rate explanation">
                            <HelpCircle size={12} className="text-muted-foreground/60" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-0 text-xs p-2.5 max-w-xs shadow-md z-[100]">
                            <p className="font-bold mb-1">Literacy Index ⓘ</p>
                            <p className="text-[10px] text-slate-300">
                              The percentage of literate residents in the selected village. Sourced from Census 2011.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(200,16,46,0.08)" }}>
                        <NotebookTabs className="h-3.5 w-3.5" style={{ color: "#C8102E" }} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xl font-extrabold" style={{ color: "#1A2B4A", letterSpacing: "-0.02em" }}>
                        {getWeightedLiteracy()}
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
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("posNetwork")}</span>
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
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{t("demographicsInsights")}</h3>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                        Detailed breakdowns, literacy gaps, and worker classifications.
                      </p>
                    </div>
                  </div>
                  
                  {/* Census segment selector */}
                  {totalDemographicData && Array.isArray(totalDemographicData) && (
                    <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border shrink-0">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 hidden md:inline">{t("segment")}:</span>
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
                    {t("liveDssStatus")}
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "rgba(100,116,139,0.8)" }}>{t("activeEnrollments")}</span>
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
                    <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "rgba(100,116,139,0.8)" }}>{t("topScheme")}</span>
                    <h4 className="text-xs font-bold mt-0.5" style={{ color: "#F87171" }}>
                      {isLocationSelected && currentRec ? currentRec.recommendedScheme : t("chooseAnalysisRegion")}
                    </h4>
                  </div>
                  <div
                    className="w-full h-[1px]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(100,116,139,0.8)" }}>{t("readiness")}</span>
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
                {t("quickNavigation")}
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { labelKey: "compareVillages", icon: Layers, onClick: () => router.push("/compare") },
                  { labelKey: "beneficiaryDirectory", icon: Users, onClick: () => router.push("/publicInfo") },
                  { labelKey: "schemeRecommender", icon: Sparkles, onClick: () => router.push("/recommender") },
                ].map(({ labelKey, icon: Icon, onClick }) => (
                  <button
                    key={labelKey}
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
                    {t(labelKey)}
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
                  {t("campaignAssistant")}
                </h4>
                <p className="text-xs font-semibold text-white mt-0.5" style={{ letterSpacing: "-0.01em" }}>
                  {t("operationalScripts")}
                </p>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs leading-normal" style={{ color: "#64748B" }}>
                  Trigger operational planning scripts in the assistant chat.
                </p>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  <button
                    onClick={() => triggerChatbot(`Generate a 10-point campaign organization checklist for promoting ${currentRec?.recommendedScheme || "Sukanya Samriddhi Account (SSA)"} in ${regionTitle}.`)}
                    className="flex items-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg text-left transition-all duration-150"
                    style={{ color: "#374151", background: "#F8FAFF", border: "1px solid #E8EDF5" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDF5"; }}
                  >
                    {t("triggerChecklist")}
                  </button>
                  <button
                    onClick={() => triggerChatbot(`Draft an outreach announcement script and localized SMS template for promoting ${currentRec?.recommendedScheme || "Sukanya Samriddhi Account (SSA)"} in ${regionTitle}.`)}
                    className="flex items-center gap-2 w-full text-xs font-semibold h-8 px-3 rounded-lg text-left transition-all duration-150"
                    style={{ color: "#374151", background: "#F8FAFF", border: "1px solid #E8EDF5" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDF5"; }}
                  >
                    {t("triggerScripts")}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <DSSMethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </main>
  );
}

export default DashboardView;
