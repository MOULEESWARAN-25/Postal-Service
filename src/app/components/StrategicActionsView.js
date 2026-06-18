"use client";

import React, { useEffect, useState } from "react";
import { Award, Sparkles, ArrowLeft } from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function StrategicActionsView() {
  const { village, triggerChatbot } = useDashboardStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/campaign-recommendations");
      if (res.data.success) {
        let data = res.data.data || [];
        if (village) {
          data = data.filter(r => r.village.toLowerCase() === village.toLowerCase());
        }
        setRecommendations(data);
      }
    } catch (err) {
      console.warn("Error fetching campaign recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [village]);

  const askAIAboutAction = (action) => {
    const promptText = `Provide an operational outreach plan for conducting a campaign promoting ${action.recommendedScheme} in the village ${action.village} during the campaign window ${action.campaignWindow}. Key drivers: ${action.keyDrivers?.join(", ") || 'General interest'}. Explain how we can achieve maximum enrollments.`;
    triggerChatbot(promptText);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background py-6 text-foreground">
      <div className="w-full max-w-[1440px] mx-auto space-y-6 px-4 md:px-6">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Strategic Action Center</BreadcrumbPage>
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
            Strategic Actions
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="text-primary h-8 w-8" /> Strategic Action Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-generated campaign priorities, opportunity scores, and reach analysis based on regional census statistics and timing indexes.
          </p>
        </div>

        {village && (
          <div className="bg-primary/5 border border-primary/10 text-foreground rounded-lg px-4 py-3 text-xs flex items-center justify-between">
            <span>Filtering opportunities for active village: <strong>{village}</strong></span>
            <Button onClick={() => fetchRecommendations()} variant="outline" size="sm" className="text-xs font-bold">
              Clear Filter
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card className="border-border bg-card" key={idx}>
                <CardHeader className="flex justify-between items-center flex-row pb-3 border-b border-border mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map((action, i) => (
                <Card 
                  key={i} 
                  className="flex flex-col justify-between border-border bg-card hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex justify-between items-center flex-row border-b border-border pb-3 px-6 pt-6">
                    <Badge variant="secondary" className="font-bold text-xs">
                      Score: {action.opportunityScore}/100
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">{action.campaignWindow}</span>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 p-6">
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-tight">{action.village}</h3>
                      <p className="text-xs text-primary font-bold mt-1">🎯 {action.recommendedScheme}</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opportunity Drivers</h4>
                      <ul className="text-xs text-muted-foreground space-y-1.5">
                        {action.keyDrivers?.map((drv, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-primary font-bold">•</span>
                            <span className="text-xs font-medium text-foreground">{drv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <div className="p-6 pt-0 border-t border-border flex justify-between items-center text-xs mt-auto">
                    <span className="text-muted-foreground font-semibold">Reach: <strong className="text-foreground font-extrabold">{action.estimatedEligibleCitizens}</strong></span>
                    <Button 
                      onClick={() => askAIAboutAction(action)}
                      size="sm"
                      className="font-bold flex items-center gap-1.5 h-8"
                    >
                      <Sparkles size={12} />
                      <span>Action Plan</span>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-full py-16 text-center text-muted-foreground font-semibold border-border bg-card">
                No priority actions found for this selection. Try changing the active region in the search bar.
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
