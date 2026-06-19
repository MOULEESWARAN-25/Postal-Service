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

  const askAIAboutVillage = () => {
    const regionName = demographicData?.name || village || "Erode";
    const promptText = `Analyze the demographics of the village "${regionName}". Total population: ${demographicData?.totP?.toLocaleString() || 'N/A'}, Female Literacy: ${demographicData?.fLit || 'N/A'}%, Workforce Mix: ${demographicData?.totWorkP ? ((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(0) : 'N/A'}% workers. Harvest season is Turmeric (Jan - Feb). Suggest which post office schemes are best to promote here and provide an outreach recommendation.`;
    triggerChatbot(promptText);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8F9FB]">
        <div className="page-container space-y-5">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Village Intelligence</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Link and Badge */}
        <div className="flex justify-between items-center border-b pb-4 border-border">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:underline font-bold transition">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Regional Intelligence</span>
          </Link>
          <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Village Intelligence Module
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="text-primary h-8 w-8" /> Village Intelligence
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Detailed demographic insights, local agricultural harvest seasons, and dynamic campaign heuristics for the currently selected village.
          </p>
        </div>

        <Card className="overflow-hidden border-border bg-card">
          <div className="bg-secondary text-secondary-foreground p-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-secondary-foreground/75 uppercase tracking-widest">Active Target</span>
              <h2 className="text-2xl font-bold mt-1 text-secondary-foreground">{village || "No Village Selected"}</h2>
            </div>
            <Badge variant="outline" className="border-secondary-foreground/20 text-secondary-foreground">
              {demographicData?.district || "Erode Region"}
            </Badge>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-border rounded-xl p-5 bg-muted/10">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Female Literacy Index</span>
                <div className="text-3xl font-extrabold text-foreground mt-2">
                  {demographicData?.fLit ? `${demographicData.fLit}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Percentage of literate females in the village. Indicates potential outreach scope for female education savings (SSA).
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/10">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workforce Participation Rate</span>
                <div className="text-3xl font-extrabold text-foreground mt-2">
                  {demographicData?.totWorkP ? `${((demographicData.totWorkP / (demographicData.totP || 1)) * 100).toFixed(1)}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Ratio of active workers to total population. High worker presence signifies a strong audience for pension planning (APY).
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/10">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Harvest Calendar Season</span>
                <div className="text-3xl font-extrabold text-green-600 dark:text-green-400 mt-2">
                  Turmeric (Jan - Feb)
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Identified crop harvest interval. Matches periods of high liquidity when savings accounts (POSA) can be promoted.
                </p>
              </div>

              <div className="border border-border rounded-xl p-5 bg-muted/10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Campaign Recommendation Heuristic</span>
                  <div className="text-xs font-semibold text-foreground mt-2 leading-relaxed">
                    Sowing starts in July for cotton. Setup Kisan Credit Card (KCC) kiosks at local village centers.
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-4">
                  Deterministic Heuristic Index #V04
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              {village ? (
                <Button
                  onClick={askAIAboutVillage}
                  className="w-full py-6 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Ask AI About This Village</span>
                </Button>
              ) : (
                <div className="text-center text-muted-foreground py-6 text-sm font-semibold border border-dashed border-border rounded-xl">
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
