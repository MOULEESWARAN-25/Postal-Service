"use client";

import React, { useState, useEffect } from "react";
import { Layers, ArrowLeft } from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import axios from "axios";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CompareView() {
  const { village } = useDashboardStore();
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [compVillages, setCompVillages] = useState(["Arasur", "Bannari"]);
  const [loading, setLoading] = useState(true);

  // Village list for comparison
  const villagesList = ["Arasur", "Bannari", "Komarapalayam", "Bhavani Village A", "Thingalur Village", "Thoppampalayam"];

  const fetchRecommendationsAndEnrollments = async () => {
    try {
      setLoading(true);
      const [recRes, enrolRes] = await Promise.all([
        axios.get("/api/campaign-recommendations"),
        axios.get("/api/enrollments")
      ]);

      if (recRes.data.success) {
        setRecommendations(recRes.data.data || []);
      }
      if (enrolRes.data.success) {
        setComparisonData(enrolRes.data.stats?.byVillage || []);
      }
    } catch (err) {
      console.warn("Error loading comparison data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendationsAndEnrollments();
  }, []);

  const handleCompSelect = (index, val) => {
    setCompVillages(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // Prepare table data for TanStack
  const tableData = [
    {
      metric: "Literacy Index",
      v0: "78.5%",
      v1: "82.1%"
    },
    {
      metric: "Logged Scheme Enrollments",
      v0: comparisonData.find(v => v.village === compVillages[0])?.count ?? 34,
      v1: comparisonData.find(v => v.village === compVillages[1])?.count ?? 22,
      isEnrollment: true
    },
    {
      metric: "APY Adoption Rank",
      v0: "High",
      v1: "Medium"
    },
    {
      metric: "AI Priority Opportunity Score",
      v0: recommendations.find(r => r.village === compVillages[0])?.opportunityScore ?? 90,
      v1: recommendations.find(r => r.village === compVillages[1])?.opportunityScore ?? 88,
      isOpportunity: true
    }
  ];

  const columns = [
    {
      accessorKey: "metric",
      header: "Demographic metrics",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("metric")}</span>
    },
    {
      accessorKey: "v0",
      header: compVillages[0],
      cell: ({ row }) => {
        const val = row.getValue("v0");
        if (row.original.isEnrollment) {
          return (
            <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
              {val} Enrolled
            </Badge>
          );
        }
        if (row.original.isOpportunity) {
          return (
            <Badge variant="secondary" className="font-bold text-xs">
              {val}/100
            </Badge>
          );
        }
        return <span className="font-semibold text-foreground">{val}</span>;
      }
    },
    {
      accessorKey: "v1",
      header: compVillages[1],
      cell: ({ row }) => {
        const val = row.getValue("v1");
        if (row.original.isEnrollment) {
          return (
            <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
              {val} Enrolled
            </Badge>
          );
        }
        if (row.original.isOpportunity) {
          return (
            <Badge variant="secondary" className="font-bold text-xs">
              {val}/100
            </Badge>
          );
        }
        return <span className="font-semibold text-foreground">{val}</span>;
      }
    }
  ];

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
                <BreadcrumbPage>Regional Comparison Engine</BreadcrumbPage>
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
              Comparison Engine
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="text-[#C8102E] h-8 w-8" /> Regional Comparison Engine
            </h1>
            <p className="text-muted-foreground text-xs font-semibold mt-1">
              Compare target village metrics side-by-side to understand relative suitability scores, adoption levels, and active enrollments.
            </p>
          </div>

          {/* Winner Recommendation Banner */}
          {!loading && (
            <div className="bg-[#DCFCE7] border border-green-200 rounded-xl p-4 flex items-center justify-between text-green-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-950">Priority Recommendation Winner</h4>
                  <p className="text-xs font-semibold mt-0.5">
                    The system recommends prioritizing <strong className="text-green-950 font-extrabold">{
                      (recommendations.find(r => r.village === compVillages[0])?.opportunityScore ?? 90) >=
                      (recommendations.find(r => r.village === compVillages[1])?.opportunityScore ?? 88)
                        ? compVillages[0]
                        : compVillages[1]
                    }</strong> for active campaign placement based on target suitability metrics.
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Badge className="bg-green-700 text-white font-bold hover:bg-green-800">Winner Pick</Badge>
              </div>
            </div>
          )}

          {loading ? (
            <Card className="border-border bg-card">
              <CardContent className="py-20 space-y-4 flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="flex justify-between items-center border-b border-slate-100 pb-4 flex-row flex-wrap gap-4 p-5">
                <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">Select Villages for Comparison:</CardTitle>
                <div className="flex items-center gap-4">
                  <Select
                    value={compVillages[0]}
                    onValueChange={(val) => handleCompSelect(0, val)}
                  >
                    <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl">
                      <SelectValue placeholder="Select Village 1" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-white text-slate-800">
                      {villagesList.map((v) => (
                        <SelectItem key={v} value={v} className="text-xs">
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">VS</span>

                  <Select
                    value={compVillages[1]}
                    onValueChange={(val) => handleCompSelect(1, val)}
                  >
                    <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl">
                      <SelectValue placeholder="Select Village 2" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-white text-slate-800">
                      {villagesList.map((v) => (
                        <SelectItem key={v} value={v} className="text-xs">
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={tableData}
                  loading={false}
                  showPagination={false}
                  showColumnsToggle={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
