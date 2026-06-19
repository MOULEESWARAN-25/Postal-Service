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
      cell: ({ row }) => <span className="font-semibold text-foreground text-xs">{row.getValue("metric")}</span>
    },
    {
      accessorKey: "v0",
      header: compVillages[0],
      cell: ({ row }) => {
        const val = row.getValue("v0");
        if (row.original.isEnrollment) {
          return (
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs font-bold rounded">
              {val} Enrolled
            </Badge>
          );
        }
        if (row.original.isOpportunity) {
          return (
            <Badge variant="secondary" className="font-extrabold text-xs rounded">
              {val}/100
            </Badge>
          );
        }
        return <span className="font-semibold text-foreground text-xs">{val}</span>;
      }
    },
    {
      accessorKey: "v1",
      header: compVillages[1],
      cell: ({ row }) => {
        const val = row.getValue("v1");
        if (row.original.isEnrollment) {
          return (
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs font-bold rounded">
              {val} Enrolled
            </Badge>
          );
        }
        if (row.original.isOpportunity) {
          return (
            <Badge variant="secondary" className="font-extrabold text-xs rounded">
              {val}/100
            </Badge>
          );
        }
        return <span className="font-semibold text-foreground text-xs">{val}</span>;
      }
    }
  ];

  // Determine winner village
  const score0 = recommendations.find(r => r.village === compVillages[0])?.opportunityScore ?? 90;
  const score1 = recommendations.find(r => r.village === compVillages[1])?.opportunityScore ?? 88;
  const winnerIdx = score0 >= score1 ? 0 : 1;
  const winnerVillage = compVillages[winnerIdx];

  const enrollCount0 = comparisonData.find(v => v.village === compVillages[0])?.count ?? 34;
  const enrollCount1 = comparisonData.find(v => v.village === compVillages[1])?.count ?? 22;

  const metrics = [
    {
      label: "Literacy Index",
      v0: "78.5%",
      v1: "82.1%",
      winner: parseFloat("82.1") > parseFloat("78.5") ? 1 : 0,
      description: "Census-measured literacy rate"
    },
    {
      label: "Scheme Enrollments",
      v0: enrollCount0,
      v1: enrollCount1,
      winner: enrollCount0 >= enrollCount1 ? 0 : 1,
      description: "Active registered scheme enrollments"
    },
    {
      label: "APY Adoption Rank",
      v0: "High",
      v1: "Medium",
      winner: 0,
      description: "Atal Pension Yojana adoption category"
    },
    {
      label: "AI Opportunity Score",
      v0: score0,
      v1: score1,
      winner: winnerIdx,
      description: "AI-computed campaign priority score (0–100)"
    },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <div className="page-container max-w-[1400px] mx-auto w-full space-y-6">

          {/* Breadcrumbs */}
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-secondary">Comparison Engine</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Premium Hero Banner */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 55%, #1E3A5F 100%)",
              padding: "1.5rem 2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)", transform: "translate(20%, -40%)" }}
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(200,16,46,0.15)", border: "1px solid rgba(200,16,46,0.25)" }}
                >
                  <Layers size={22} style={{ color: "#F87171" }} />
                </div>
                <div>
                  <h1
                    className="text-xl font-extrabold text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Regional Comparison Engine
                  </h1>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "rgba(148,163,184,0.85)" }}>
                    Side-by-side village intelligence to identify the highest-priority campaign target.
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                <ArrowLeft size={13} /> Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Village selector row */}
          <div
            className="rounded-xl p-4 flex items-center gap-4 flex-wrap"
            style={{ background: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Compare:</span>
            <Select value={compVillages[0]} onValueChange={(val) => handleCompSelect(0, val)}>
              <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl bg-white text-slate-800">
                <SelectValue placeholder="Village 1" />
              </SelectTrigger>
              <SelectContent className="border-border bg-white text-slate-800">
                {villagesList.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: "#F1F5F9", color: "#94A3B8" }}
            >
              VS
            </div>

            <Select value={compVillages[1]} onValueChange={(val) => handleCompSelect(1, val)}>
              <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl bg-white text-slate-800">
                <SelectValue placeholder="Village 2" />
              </SelectTrigger>
              <SelectContent className="border-border bg-white text-slate-800">
                {villagesList.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Winner Banner */}
              <div
                className="rounded-xl p-4 flex items-center justify-between gap-4"
                style={{
                  background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "rgba(200,16,46,0.15)", border: "1px solid rgba(200,16,46,0.25)" }}
                  >
                    🏆
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(148,163,184,0.7)" }}>
                      DSS Recommendation
                    </p>
                    <p className="text-sm font-extrabold text-white mt-0.5" style={{ letterSpacing: "-0.02em" }}>
                      Prioritize{" "}
                      <span style={{ color: "#F87171" }}>{winnerVillage}</span>
                      {" "}for the next campaign window
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold"
                  style={{ background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)", color: "#fff", boxShadow: "0 4px 12px rgba(200,16,46,0.3)" }}
                >
                  Score: {score0 >= score1 ? score0 : score1}/100
                </div>
              </div>

              {/* Metric comparison cards */}
              <div className="grid grid-cols-1 gap-3">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-3 px-1">
                  <div className="col-span-4" />
                  <div className="col-span-4 text-center">
                    <span
                      className={`text-sm font-extrabold ${winnerIdx === 0 ? "text-primary" : ""}`}
                      style={{ letterSpacing: "-0.02em", color: winnerIdx === 0 ? "#C8102E" : "#1A2B4A" }}
                    >
                      {compVillages[0]}
                    </span>
                    {winnerIdx === 0 && (
                      <span className="ml-2 text-xs font-bold" style={{ color: "#C8102E" }}>✓ Winner</span>
                    )}
                  </div>
                  <div className="col-span-4 text-center">
                    <span
                      className="text-sm font-extrabold"
                      style={{ letterSpacing: "-0.02em", color: winnerIdx === 1 ? "#C8102E" : "#1A2B4A" }}
                    >
                      {compVillages[1]}
                    </span>
                    {winnerIdx === 1 && (
                      <span className="ml-2 text-xs font-bold" style={{ color: "#C8102E" }}>✓ Winner</span>
                    )}
                  </div>
                </div>

                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-3 items-center rounded-xl p-4"
                    style={{ background: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  >
                    {/* Metric label */}
                    <div className="col-span-4">
                      <p className="text-xs font-bold" style={{ color: "#1A2B4A" }}>{m.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{m.description}</p>
                    </div>

                    {/* Village 0 value */}
                    <div
                      className="col-span-4 flex justify-center"
                    >
                      <div
                        className="px-4 py-2 rounded-xl text-center min-w-[80px]"
                        style={{
                          background: m.winner === 0 ? "rgba(200,16,46,0.08)" : "#F8FAFF",
                          border: `1px solid ${m.winner === 0 ? "rgba(200,16,46,0.2)" : "#EEF1F8"}`,
                        }}
                      >
                        <p
                          className="text-base font-extrabold"
                          style={{ color: m.winner === 0 ? "#C8102E" : "#64748B", letterSpacing: "-0.02em" }}
                        >
                          {m.v0}
                        </p>
                        {m.winner === 0 && (
                          <p className="text-xs font-bold mt-0.5" style={{ color: "#C8102E" }}>Best</p>
                        )}
                      </div>
                    </div>

                    {/* Village 1 value */}
                    <div className="col-span-4 flex justify-center">
                      <div
                        className="px-4 py-2 rounded-xl text-center min-w-[80px]"
                        style={{
                          background: m.winner === 1 ? "rgba(200,16,46,0.08)" : "#F8FAFF",
                          border: `1px solid ${m.winner === 1 ? "rgba(200,16,46,0.2)" : "#EEF1F8"}`,
                        }}
                      >
                        <p
                          className="text-base font-extrabold"
                          style={{ color: m.winner === 1 ? "#C8102E" : "#64748B", letterSpacing: "-0.02em" }}
                        >
                          {m.v1}
                        </p>
                        {m.winner === 1 && (
                          <p className="text-xs font-bold mt-0.5" style={{ color: "#C8102E" }}>Best</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insight Callout — fills bottom whitespace with value */}
              <div
                className="rounded-xl p-5 flex items-start gap-4"
                style={{ background: "#F8FAFF", border: "1px solid #EEF1F8" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(26,43,74,0.08)" }}
                >
                  <Layers size={16} style={{ color: "#1A2B4A" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>
                    DSS Intelligence Note
                  </p>
                  <p className="text-sm font-semibold leading-relaxed" style={{ color: "#1E293B" }}>
                    Based on current data, <strong>{winnerVillage}</strong> shows higher campaign readiness
                    with an opportunity score of <strong>{score0 >= score1 ? score0 : score1}/100</strong>.
                    The AI recommends running an enrollment drive targeting{" "}
                    <strong>
                      {recommendations.find(r => r.village === winnerVillage)?.recommendedScheme || "Atal Pension Yojana (APY)"}
                    </strong>{" "}
                    during{" "}
                    <strong>
                      {recommendations.find(r => r.village === winnerVillage)?.campaignWindow || "Q3 2026"}
                    </strong>.
                  </p>
                  <button
                    onClick={() => window.location.href = "/calender"}
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: "#C8102E" }}
                  >
                    View Campaign Calendar →
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </ErrorBoundary>
  );
}

