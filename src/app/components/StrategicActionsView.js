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
              <BreadcrumbPage className="font-extrabold text-secondary">Strategic Action Center</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Link and Badge */}
        <div className="flex justify-between items-center border-b pb-4 border-border">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/95 font-bold transition text-xs">
            <ArrowLeft size={14} />
            <span>Back to Regional Intelligence</span>
          </Link>
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full px-3 py-1">
            Strategic Actions
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Award className="text-primary h-6 w-6" /> Strategic Action Center
          </h1>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            AI-generated campaign priorities, DSS Opportunity Indices, and reach analysis based on regional census statistics.
          </p>
        </div>

        {village && (
          <div className="bg-primary/5 border border-primary/10 text-foreground rounded-lg px-4 py-2 text-xs flex items-center justify-between">
            <span>Filtering opportunities for active village: <strong>{village}</strong></span>
            <Button onClick={() => fetchRecommendations()} variant="outline" size="sm" className="text-xs font-bold h-7 px-2.5">
              Clear Filter
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card className="border-border bg-card shadow-sm rounded-xl p-5" key={idx}>
                <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map((action, i) => (
                <Card 
                  key={i} 
                  className="flex flex-col justify-between border border-border bg-card shadow-sm rounded-xl p-6"
                >
                  <div>
                    <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
                      <Badge variant="secondary" className="font-extrabold text-xs rounded px-2 py-0.5">
                        DSS Opportunity Index: {action.opportunityScore}/100
                      </Badge>
                      <span className="text-xs text-muted-foreground font-bold">{action.campaignWindow}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-extrabold text-secondary text-base leading-tight">{action.village}</h3>
                        <p className="text-xs text-primary font-bold mt-1">🎯 {action.recommendedScheme}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opportunity Drivers</h4>
                        <ul className="text-xs space-y-1.5">
                          {action.keyDrivers?.map((drv, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-primary font-bold select-none">•</span>
                              <span className="text-xs font-semibold text-muted-foreground">{drv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-border flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-semibold">Reach: <strong className="text-foreground font-extrabold">{action.estimatedEligibleCitizens}</strong></span>
                    <Button 
                      onClick={() => askAIAboutAction(action)}
                      size="sm"
                      className="font-bold flex items-center gap-1.5 h-8 px-3 rounded-lg"
                    >
                      <Sparkles size={12} />
                      <span>Action Plan</span>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-full py-16 text-center text-muted-foreground font-bold border border-border bg-card shadow-sm rounded-xl">
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
