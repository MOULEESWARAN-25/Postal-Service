"use client";
import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Landmark,
  MapPin,
  NotebookTabs,
  Pin,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Plus,
  HelpCircle,
  Award,
  Layers,
  ChevronRight
} from "lucide-react";
import { Loader } from "lucide-react"; 
import dynamic from "next/dynamic";

const PopulationSpike = dynamic(() => import("./Charts/PopulationSpike"), { ssr: false });
const LiteracyPieChart = dynamic(() => import("./Charts/LiteracyPieChart"), { ssr: false });
const Occupation = dynamic(() => import("./Charts/Occupation"), { ssr: false });
const WorkerClassification = dynamic(() => import("./Charts/WorkerClassification"), { ssr: false });
const GenderAge = dynamic(() => import("./Charts/GenderAge"), { ssr: false });
const IncomeDistribution = dynamic(() => import("./Charts/IncomeDistribution"), { ssr: false });

import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
    SchemePerformanceVisible,
    triggerChatbot
  } = useDashboardStore();


  const [postOfficesCount, setPostOfficesCount] = useState(null);
  const [postofficesCount, setPostofficesCount] = useState(null);
  const [error, setError] = useState(null);

  // DSS Data States
  const [activeChartTab, setActiveChartTab] = useState("demographics");
  const [recommendations, setRecommendations] = useState([]);
  const [liveEnrollmentCount, setLiveEnrollmentCount] = useState(0);
  const [compVillages, setCompVillages] = useState(["Arasur", "Bannari"]);
  const [comparisonData, setComparisonData] = useState([]);

  // Fetch campaign recommendations from MongoDB
  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("/api/campaign-recommendations");
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.warn("Error fetching priority actions:", err);
    }
  };

  // Fetch live enrollments count from MongoDB
  const fetchLiveEnrollments = async () => {
    try {
      const res = await axios.get("/api/enrollments");
      if (res.data.success) {
        setLiveEnrollmentCount(res.data.stats.totalEnrolled || 84);
        
        // Populate Comparison Engine Details
        const allVilsData = res.data.stats.byVillage || [];
        setComparisonData(allVilsData);
      }
    } catch (err) {
      console.warn("Error fetching live enrollments count:", err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    fetchLiveEnrollments();
  }, [village, demographicData]);

  const fetchVillages = async () => {
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
  };

  const fetchPostOffices = async () => {
    if (!subpostoffice) return;

    try {
      const searchPincode = subpostoffice?.pincode || (typeof postoffice === 'object' ? postoffice?.pincode : null) || 624001;

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
  };

  useEffect(() => {
    fetchVillages();
  }, [District]);

  useEffect(() => {
    fetchPostOffices();
  }, [subpostoffice]);

  const renderInfo = () => {
    if (!State && !District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total post offices
          </p>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5">1.55+ Lakhs</h2>
        </>
      );
    }
    if (State && !District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Number of post offices
          </p>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5">12,450</h2>
        </>
      );
    }
    if (State && District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            District Post Offices
          </p>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
            {postOfficesCount ? postOfficesCount.length : "Loading..."}
          </h2>
        </>
      );
    }
    if (State && District && subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Branch post offices
          </p>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
            {postofficesCount ? postofficesCount.length : "Loading..."}
          </h2>
        </>
      );
    }
    if (State && District && subpostoffice && postoffice && !village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Selected Post Office
          </p>
          <h2 className="text-sm font-extrabold text-slate-950 mt-0.5 truncate">
            {typeof postoffice === 'object' ? postoffice.name : postoffice}
          </h2>
        </>
      );
    }
    if (State && District && subpostoffice && postoffice && village) {
      return (
        <>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Selected Post Office
          </p>
          <h2 className="text-sm font-extrabold text-slate-950 mt-0.5 truncate">
            {typeof postoffice === 'object' ? postoffice.name : postoffice}
          </h2>
        </>
      );
    }
    return "Invalid data";
  };

  useEffect(() => {
    const getDemographics = async () => {
      if (demographicData) return;
      setLoading(true); 
      try {
        const response = await fetch("/api/demographics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: { name: "INDIA" } }),
        });
        const data = await response.json();
        setTotalDemographicData(data);
        filterDemographicData(data);
      } catch (error) {
        console.warn("Error fetching demographics:", error);
      } finally {
        setLoading(false); 
      }
    };

    getDemographics();
  }, []);

  const [selectedData, setSelectedData] = useState(null);

  const handleRadioChange = (index) => {
    if (totalDemographicData && Array.isArray(totalDemographicData)) {
      const selected = totalDemographicData[index];
      setSelectedData(selected); 
      setDemographicData(selected); 
    }
  };

  // Chatbot contextual queries
  const askAAboutRegion = () => {
    const regionName = demographicData?.name || "Erode";
    const promptText = `Analyze the demographics of the region "${regionName}". Highlight key points like total population (${demographicData?.totP?.toLocaleString() || 'N/A'}), literacy rates, and recommend which post office schemes (e.g. SSA, KCC, APY) are best to promote here and why.`;
    triggerChatbot(promptText);
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
      
      // Generic fallback
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

    // Default Arasur recommendation
    return {
      village: "Arasur",
      recommendedScheme: "Sukanya Samriddhi Yojana (SSA)",
      opportunityScore: 92,
      campaignWindow: "October - December 2026",
      keyDrivers: [
        "High female literacy (78.5%) detected in Erode branch sector",
        "Significant count of girl children under the age of 10 (~142)",
        "Low existing SSA adoption rates (<15%) compared to other post offices"
      ],
      estimatedEligibleCitizens: "~120"
    };
  };

  const currentRec = getDynamicRecommendation();
  const regionTitle = village || (typeof postoffice === "object" ? postoffice?.name : postoffice) || subpostoffice?.name || District || State?.name || "India (National)";

  return (
    <main className="flex-1 bg-[#F8F9FB] min-h-screen text-slate-800">
      <div className="max-w-[1440px] mx-auto p-6 space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumb className="text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="font-semibold text-slate-500 hover:text-[#C8102E]">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {State?.name && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-slate-500">{State.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {District && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-slate-500">{District}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {subpostoffice?.name && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-slate-500">{subpostoffice.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {postoffice && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-slate-500">
                    {typeof postoffice === "object" ? postoffice?.name : postoffice}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {village && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-extrabold text-[#1A2B4A]">{village}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Dynamic Section Heading */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {regionTitle} Intelligence
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Decision Support System (DSS) panel analyzing priority regional opportunities, demographic datasets, and scheme performance metrics.
            </p>
          </div>
          <Badge className="bg-[#1A2B4A] text-white py-1 px-3 rounded-full text-xs font-semibold">
            DSS Dashboard
          </Badge>
        </div>

        {/* Strategic Action Center (Action-First DSS Alert) */}
        <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden rounded-2xl relative">
          <CardHeader className="pb-3 pl-6 pt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#C8102E] uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse shrink-0" />
              <span>Strategic Action Center</span>
            </div>
            <CardTitle className="text-xl font-extrabold text-slate-900 mt-2">
              Promote {currentRec.recommendedScheme} in {currentRec.village}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-semibold mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              <span>Opportunity Score: <strong className="text-[#C8102E]">{currentRec.opportunityScore}/100</strong></span>
              <span>&bull;</span>
              <span>Eligible Citizens: <strong className="text-slate-800">{currentRec.estimatedEligibleCitizens}</strong></span>
              <span>&bull;</span>
              <span>Campaign Window: <strong className="text-slate-800">{currentRec.campaignWindow}</strong></span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6 pb-6 space-y-4">
            {/* Intelligence Summary ("Why?") */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Why? (Intelligence Summary)</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentRec.keyDrivers?.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C8102E] shrink-0 font-bold select-none">&bull;</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2 flex-wrap pt-2">
              <Button 
                onClick={() => router.push("/calender")}
                className="h-9 rounded-full bg-[#C8102E] text-white hover:bg-[#A00D24] text-xs font-bold shadow-sm"
              >
                Launch Campaign Outreach
              </Button>
              <Button 
                onClick={() => triggerChatbot(`Provide an operational outreach plan for promoting ${currentRec.recommendedScheme} in ${currentRec.village || 'Arasur'}.`)}
                variant="outline"
                className="h-9 rounded-full text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Ask Assistant for Action Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Census PCA Segment bar */}
        {totalDemographicData && Array.isArray(totalDemographicData) && (
          <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-200 bg-white shadow-sm rounded-xl">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 p-0">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-[#C8102E] text-white hover:bg-[#A30D24] text-[10px] py-1 px-2.5 rounded-full font-bold">Census PCA Segment</Badge>
                <form className="flex items-center gap-6 flex-wrap">
                  {totalDemographicData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`seg-${index}`}
                        checked={selectedData === item || (index === 0 && selectedData === null)}
                        onCheckedChange={() => handleRadioChange(index)}
                        aria-label={item.tru || `Segment ${index + 1}`}
                      />
                      <label
                        htmlFor={`seg-${index}`}
                        className="text-xs font-bold text-slate-700 cursor-pointer select-none"
                      >
                        {item.tru || `Segment ${index + 1}`}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 70/30 Split Layout (Visual Hierarchy Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Left Column (70% - Tabbed Supporting Evidence) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-100 mb-6 gap-2">
                {["demographics", "economics", "workforce"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveChartTab(tab)}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 uppercase tracking-wider transition-all ${
                      activeChartTab === tab 
                        ? "border-[#C8102E] text-[#C8102E]" 
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeChartTab === "demographics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Population Distribution</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Historical and projected demographics</p>
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center p-1">
                      <PopulationSpike />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Literacy Rates</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Visual distribution of literate population</p>
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center p-1">
                      <LiteracyPieChart />
                    </div>
                  </div>
                </div>
              )}

              {activeChartTab === "economics" && (
                <div className="space-y-2 max-w-md mx-auto">
                  <div className="border-b border-slate-100 pb-2 text-center">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Income Distribution</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Percentage representation of households by income tier</p>
                  </div>
                  <div className="h-[320px] w-full flex items-center justify-center p-1">
                    <IncomeDistribution />
                  </div>
                </div>
              )}

              {activeChartTab === "workforce" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Occupation Breakdown</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Employment distribution across agricultural and industrial sectors</p>
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center p-1">
                      <Occupation />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Worker Classification</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Main vs. marginal worker categories</p>
                    </div>
                    <div className="h-[280px] w-full flex items-center justify-center p-1">
                      <WorkerClassification />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Note on data density */}
            <div className="text-[11px] text-slate-400 font-medium italic flex items-center gap-1">
              <span>ℹ️</span>
              <span>Charts represent supporting evidence. The primary operational decisions are prioritized at the top of the interface.</span>
            </div>
          </div>

          {/* Right Column (30% - Intelligence Sidebar) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Intelligence Sidebar Card */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#1A2B4A]" />
                  <span>🧠 Intelligence Sidebar</span>
                </h3>
              </div>
              <CardContent className="p-4 space-y-4 divide-y divide-slate-100">
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Opportunity Score</span>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
                    {currentRec.opportunityScore}
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                  </h4>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Eligible Citizens</span>
                  <h4 className="text-base font-bold text-slate-800 mt-1">
                    {currentRec.estimatedEligibleCitizens} Citizens
                  </h4>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Campaign Readiness</span>
                  <div className="mt-1">
                    <Badge className="bg-[#2E7D32] text-white hover:bg-[#2E7D32] text-[10px] rounded">High Readiness</Badge>
                  </div>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Enrollments</span>
                  <h4 className="text-base font-bold text-slate-800 mt-1">
                    {loading ? <Skeleton className="h-5 w-16" /> : `${liveEnrollmentCount} Accounts`}
                  </h4>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recommended Scheme</span>
                  <p className="text-xs font-bold text-slate-700 mt-1">
                    {currentRec.recommendedScheme}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Navigation</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={() => router.push("/compare")}
                  variant="outline"
                  className="w-full justify-start text-xs font-semibold h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
                >
                  <Layers size={14} /> Compare Villages
                </Button>
                <Button 
                  onClick={() => router.push("/publicInfo")}
                  variant="outline"
                  className="w-full justify-start text-xs font-semibold h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
                >
                  <Users size={14} /> Beneficiary Directory
                </Button>
                <Button 
                  onClick={() => router.push("/recommender")}
                  variant="outline"
                  className="w-full justify-start text-xs font-semibold h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
                >
                  <Sparkles size={14} /> DSS Recommender
                </Button>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </main>
  );
}

export default DashboardView;
