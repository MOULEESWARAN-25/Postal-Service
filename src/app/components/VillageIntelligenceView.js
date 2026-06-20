"use client";

import React from "react";
import { Target, Sparkles, ArrowLeft } from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function VillageIntelligenceView() {
  const { village, demographicData, triggerChatbot } = useDashboardStore();
  const [agriData, setAgriData] = React.useState(null);
  const [loadingAgri, setLoadingAgri] = React.useState(false);

  React.useEffect(() => {
    if (!village) {
      setAgriData(null);
      return;
    }
    const fetchAgriData = async () => {
      setLoadingAgri(true);
      try {
        const res = await fetch("/api/schemeTime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ village: village.trim().toLowerCase() })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.result) {
            setAgriData(data.result);
          } else {
            setAgriData(null);
          }
        } else {
          setAgriData(null);
        }
      } catch (err) {
        console.warn("Failed to fetch village agricultural data:", err);
        setAgriData(null);
      } finally {
        setLoadingAgri(false);
      }
    };
    fetchAgriData();
  }, [village]);

  const askAIAboutVillage = () => {
    const regionName = demographicData?.name || village || "Erode";
    const cropName = agriData?.crop || "Turmeric";
    const harvestSeason = agriData ? `${agriData.harvesting?.join(" - ")}` : "Jan - Feb";
    const promptText = `Analyze the demographics of the village "${regionName}". Total population: ${demographicData?.totP?.toLocaleString() || 'N/A'}, Female Literacy: ${demographicData?.fLit || 'N/A'}%, Workforce Mix: ${demographicData?.totWorkP ? ((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(0) : 'N/A'}% workers. Harvest season is ${cropName} (${harvestSeason}). Suggest which post office schemes are best to promote here and provide an outreach recommendation.`;
    triggerChatbot(promptText);
  };

  const getHeuristicText = () => {
    if (!agriData) {
      return "Select a village to calculate optimal sowing and harvest outreach campaign parameters.";
    }
    const cropLower = agriData.crop.toLowerCase();
    const sowing = agriData.sowing && agriData.sowing.length > 0 ? agriData.sowing.join(" and ") : "sowing season";
    const scheme = (agriData.crop === 'Turmeric' || agriData.crop === 'Cotton' || agriData.crop === 'Maize') 
      ? "Kisan Vikas Patra (KVP)" 
      : "Post Office Savings Account (SB)";
    return `Sowing starts in ${sowing} for ${cropLower}. Setup ${scheme} information desks at local village centers.`;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <div className="page-container space-y-6">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumb className="text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-extrabold text-secondary">Village Intelligence</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Link and Badge */}
        <div className="flex justify-between items-center border-b pb-4 border-border">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 font-bold transition text-xs">
            <ArrowLeft size={14} />
            <span>Back to Regional Intelligence</span>
          </Link>
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full px-3 py-1">
            Village Intelligence Module
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Target className="text-primary h-6 w-6" /> Village Intelligence
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Detailed demographic insights, local agricultural harvest seasons, and dynamic campaign heuristics for the currently selected village.
          </p>
        </div>

        <Card className="overflow-hidden border border-border bg-card shadow-sm rounded-xl">
          <div className="bg-secondary text-secondary-foreground p-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-secondary-foreground/70 uppercase tracking-widest">Active Target</span>
              <h2 className="text-xl font-extrabold mt-1 text-secondary-foreground">{village || "No Village Selected"}</h2>
            </div>
            <Badge variant="outline" className="border-secondary-foreground/20 text-secondary-foreground text-xs">
              {demographicData?.district || "Erode Region"}
            </Badge>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-border rounded-xl p-5 bg-muted/20">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Female Literacy Index</span>
                <div className="text-2xl font-extrabold text-foreground mt-2">
                  {demographicData?.fLit ? `${demographicData.fLit}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
                  Percentage of literate females in the village. Indicates potential outreach scope for female education savings (SSA).
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/20">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workforce Participation Rate</span>
                <div className="text-2xl font-extrabold text-foreground mt-2">
                  {demographicData?.totWorkP ? `${((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(1)}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
                  Ratio of active workers to total population. High worker presence signifies a strong audience for pension planning (APY).
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/20">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Harvest Calendar Season</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                  {loadingAgri ? "Loading..." : agriData ? `${agriData.crop} (${agriData.harvesting?.join(" - ")})` : "No harvest data"}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
                  Identified crop harvest interval. Matches periods of high liquidity when savings accounts (POSA) can be promoted.
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/20 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Campaign Recommendation Heuristic</span>
                  <div className="text-xs font-bold text-foreground mt-2 leading-relaxed">
                    {loadingAgri ? "Computing campaign heuristic..." : getHeuristicText()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-bold mt-4 uppercase tracking-widest">
                  Deterministic Heuristic Index {agriData ? `#V${agriData.crop.slice(0, 2).toUpperCase()}` : "N/A"}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              {village ? (
                <Button
                  onClick={askAIAboutVillage}
                  className="w-full py-5 text-xs font-bold flex items-center justify-center gap-2 rounded-lg"
                  disabled={loadingAgri}
                >
                  <Sparkles size={14} />
                  <span>Ask AI About This Village</span>
                </Button>
              ) : (
                <div className="text-center text-muted-foreground py-6 text-xs font-bold border border-dashed border-border rounded-xl">
                  Choose a village from the search bar to generate AI insights.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ErrorBoundary>
  );
}
