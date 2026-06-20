"use client";

import React, { useState, useEffect } from "react";
import { Layers, ArrowLeft, TrendingUp, Users, Star, Target, HelpCircle } from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import { calculateVillageRecommendations } from "@/lib/recommendationEngine";
import axios from "axios";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [compVillages, setCompVillages] = useState(["A.Sembulichampalayam", "Bannari"]);
  const [loading, setLoading] = useState(true);

  const villagesList = [
    "A.Sembulichampalayam",
    "Bannari",
    "Komarapalayam",
    "Bhavani Village A",
    "Thingalur Village",
    "Thoppampalayam",
  ];

  const fetchRecommendationsAndEnrollments = async () => {
    try {
      setLoading(true);
      const [recRes, enrolRes] = await Promise.all([
        axios.get("/api/campaign-recommendations"),
        axios.get("/api/enrollments"),
      ]);
      if (recRes.data.success) setRecommendations(recRes.data.data || []);
      if (enrolRes.data.success)
        setComparisonData(enrolRes.data.stats?.byVillage || []);
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
    setCompVillages((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const [demographics, setDemographics] = useState({});

  useEffect(() => {
    const fetchCompareDemographics = async () => {
      try {
        const [res0, res1] = await Promise.all([
          axios.post("/api/demographics", {
            address: { State: "Tamil Nadu", District: "Erode", Village: compVillages[0] }
          }),
          axios.post("/api/demographics", {
            address: { State: "Tamil Nadu", District: "Erode", Village: compVillages[1] }
          })
        ]);
        setDemographics({
          [compVillages[0]]: res0.data[0] || {},
          [compVillages[1]]: res1.data[0] || {},
        });
      } catch (err) {
        console.warn("Error fetching comparison demographics:", err);
      }
    };
    fetchCompareDemographics();
  }, [compVillages]);

  const getLiteracy = (villageName) => {
    const data = demographics[villageName];
    if (!data) return "80.0%";
    const totM = data.totM || 0;
    const totF = data.totF || 0;
    const totP = data.totP || 1;
    const mLit = data.mLit || 82.1;
    const fLit = data.fLit || 65.5;
    const litPop = totM * (mLit / 100) + totF * (fLit / 100);
    return ((litPop / totP) * 100).toFixed(1) + "%";
  };

  const lit0 = getLiteracy(compVillages[0]);
  const lit1 = getLiteracy(compVillages[1]);

  // Derive scores dynamically using shared recommendation engine
  const rec0 = demographics[compVillages[0]] ? calculateVillageRecommendations(demographics[compVillages[0]])[0] : null;
  const rec1 = demographics[compVillages[1]] ? calculateVillageRecommendations(demographics[compVillages[1]])[0] : null;

  const score0 = rec0 ? rec0.score : (recommendations.find((r) => r.village === compVillages[0])?.opportunityScore ?? 85);
  const score1 = rec1 ? rec1.score : (recommendations.find((r) => r.village === compVillages[1])?.opportunityScore ?? 80);
  const winnerIdx = score0 >= score1 ? 0 : 1;
  const winnerVillage = compVillages[winnerIdx];
  const loserVillage = compVillages[winnerIdx === 0 ? 1 : 0];

  const enrollCount0 =
    comparisonData.find((v) => v.village === compVillages[0])?.count ?? 34;
  const enrollCount1 =
    comparisonData.find((v) => v.village === compVillages[1])?.count ?? 22;

  const rank0 = enrollCount0 > 30 ? "High" : (enrollCount0 > 15 ? "Medium" : "Low");
  const rank1 = enrollCount1 > 30 ? "High" : (enrollCount1 > 15 ? "Medium" : "Low");

  const lastLoggedComp = React.useRef(null);

  useEffect(() => {
    if (compVillages && compVillages.length === 2 && demographics[compVillages[0]] && demographics[compVillages[1]]) {
      const compKey = compVillages.join("-");
      if (lastLoggedComp.current !== compKey) {
        lastLoggedComp.current = compKey;
        axios.post("/api/audit-logs", {
          actionType: "COMPARE_VILLAGES",
          location: compKey,
          recommendation: `Comparing ${compVillages[0]} (DSS Opportunity Index: ${score0}) vs ${compVillages[1]} (DSS Opportunity Index: ${score1})`,
          opportunityIndex: Math.max(score0, score1),
          userActionTime: new Date()
        }).catch(err => console.warn("Failed to write audit log:", err));
      }
    }
  }, [compVillages, demographics, score0, score1]);

  const metrics = [
    {
      label: "Literacy Index",
      v0: lit0,
      v1: lit1,
      winner: parseFloat(lit0) >= parseFloat(lit1) ? 0 : 1,
      description: "Census-measured literacy rate",
      icon: <TrendingUp size={14} />,
      tooltip: "Calculated as: ((Male Literate + Female Literate) / Total Population) * 100. Sourced from Census 2011."
    },
    {
      label: "Scheme Enrollments",
      v0: enrollCount0,
      v1: enrollCount1,
      winner: enrollCount0 >= enrollCount1 ? 0 : 1,
      description: "Active registered scheme enrollments",
      icon: <Users size={14} />,
      tooltip: "The count of active policies registered for the selected scheme. Sourced from the live head office database."
    },
    {
      label: "APY Adoption Rank",
      v0: rank0,
      v1: rank1,
      winner: enrollCount0 >= enrollCount1 ? 0 : 1,
      description: "Atal Pension Yojana adoption category",
      icon: <Star size={14} />,
      tooltip: "Adoption classification categories (High/Medium/Low) based on pension enrollment penetration levels."
    },
    {
      label: "DSS Opportunity Index",
      v0: score0,
      v1: score1,
      winner: winnerIdx,
      description: "DSS-computed campaign priority index (0–100)",
      icon: <Target size={14} />,
      tooltip: "Weighted suitability priority index (0-100) calculated from demographic density and segment ratios."
    },
  ];

  // Scorecard: count wins per village
  const wins0 = metrics.filter((m) => m.winner === 0).length;
  const wins1 = metrics.filter((m) => m.winner === 1).length;

  const winnerRec = winnerIdx === 0 ? rec0 : rec1;
  const recommendedScheme = winnerRec ? winnerRec.name : (recommendations.find((r) => r.village === winnerVillage)?.recommendedScheme || "Atal Pension Yojana (APY)");
  const campaignWindow = winnerRec ? winnerRec.campaignWindow : (recommendations.find((r) => r.village === winnerVillage)?.campaignWindow || "July 10 - July 20");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <div className="page-container max-w-[1400px] mx-auto w-full space-y-6">

          {/* Breadcrumbs */}
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-secondary">
                  Comparison Engine
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero Banner */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1A2B4A 55%, #1E3A5F 100%)",
              padding: "1.5rem 2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)",
                transform: "translate(20%, -40%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(200,16,46,0.15)",
                    border: "1px solid rgba(200,16,46,0.25)",
                  }}
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
                  <p
                    className="text-xs font-medium mt-0.5"
                    style={{ color: "rgba(148,163,184,0.85)" }}
                  >
                    Side-by-side village intelligence to identify the highest-priority campaign
                    target.
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

          {/* Village Selector Row */}
          <div
            className="rounded-xl p-4 flex items-center gap-4 flex-wrap"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Compare:
            </span>
            <Select value={compVillages[0]} onValueChange={(val) => handleCompSelect(0, val)}>
              <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl bg-card text-foreground">
                <SelectValue placeholder="Village 1" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {villagesList.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
            >
              VS
            </div>

            <Select value={compVillages[1]} onValueChange={(val) => handleCompSelect(1, val)}>
              <SelectTrigger className="w-[180px] h-9 border-border text-xs rounded-xl bg-card text-foreground">
                <SelectValue placeholder="Village 2" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card text-foreground">
                {villagesList.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">
                    {v}
                  </SelectItem>
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
                    style={{
                      background: "rgba(200,16,46,0.15)",
                      border: "1px solid rgba(200,16,46,0.25)",
                    }}
                  >
                    🏆
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "rgba(148,163,184,0.7)" }}
                    >
                      DSS Recommendation
                    </p>
                    <p
                      className="text-sm font-extrabold text-white mt-0.5"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      Prioritize{" "}
                      <span style={{ color: "#F87171" }}>{winnerVillage}</span>
                      {" "}for the next campaign window
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold"
                  style={{
                    background: "linear-gradient(135deg, #C8102E 0%, #A00D24 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(200,16,46,0.3)",
                  }}
                >
                  Score: {score0 >= score1 ? score0 : score1}/100
                </div>
              </div>

              {/* Metric Comparison Cards */}
              <div className="grid grid-cols-1 gap-3">
                {/* Column headers */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-1">
                  <div className="col-span-4" />
                  <div className="col-span-4 text-center">
                    <span
                      className="text-sm font-extrabold"
                      style={{
                        letterSpacing: "-0.02em",
                        color: winnerIdx === 0 ? "#C8102E" : "#1A2B4A",
                      }}
                    >
                      {compVillages[0]}
                    </span>
                    {winnerIdx === 0 && (
                      <span className="ml-2 text-xs font-bold" style={{ color: "#C8102E" }}>
                        ✓ Winner
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 text-center">
                    <span
                      className="text-sm font-extrabold"
                      style={{
                        letterSpacing: "-0.02em",
                        color: winnerIdx === 1 ? "#C8102E" : "#1A2B4A",
                      }}
                    >
                      {compVillages[1]}
                    </span>
                    {winnerIdx === 1 && (
                      <span className="ml-2 text-xs font-bold" style={{ color: "#C8102E" }}>
                        ✓ Winner
                      </span>
                    )}
                  </div>
                </div>

                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-xl p-4"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Metric label */}
                    <div className="col-span-1 sm:col-span-4 flex items-start gap-2 border-b sm:border-b-0 pb-3 sm:pb-0">
                      <span className="text-muted-foreground mt-0.5">{m.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-foreground">{m.label}</p>
                          {m.tooltip && (
                            <Tooltip>
                              <TooltipTrigger className="cursor-help hover:opacity-80" aria-label={`${m.label} explanation`}>
                                <HelpCircle size={12} className="text-muted-foreground/60" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-900 text-white border-0 text-xs p-2.5 max-w-xs shadow-md z-[100]">
                                <p className="font-bold mb-1">{m.label} ⓘ</p>
                                <p className="text-[10px] text-slate-300">{m.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-xs mt-0.5 text-muted-foreground">{m.description}</p>
                      </div>
                    </div>

                    {/* Village 0 value */}
                    <div className="col-span-1 sm:col-span-4 flex items-center justify-between sm:justify-center w-full">
                      <span className="sm:hidden text-xs font-bold text-muted-foreground">
                        {compVillages[0]} {winnerIdx === 0 && <span className="text-[#C8102E]">✓</span>}
                      </span>
                      <div
                        className="px-4 py-2 rounded-xl text-center min-w-[100px] transition-all"
                        style={{
                          background:
                            m.winner === 0
                              ? "rgba(26,43,74,0.08)"
                              : "hsl(var(--muted)/0.3)",
                          border: `1px solid ${
                            m.winner === 0
                              ? "rgba(26,43,74,0.25)"
                              : "hsl(var(--border))"
                          }`,
                        }}
                      >
                        <p
                          className="text-base font-extrabold"
                          style={{
                            color: m.winner === 0 ? "#1A2B4A" : "hsl(var(--muted-foreground))",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {m.v0}
                        </p>
                        {m.winner === 0 && (
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: "#1A2B4A" }}>
                            Best
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Village 1 value */}
                    <div className="col-span-1 sm:col-span-4 flex items-center justify-between sm:justify-center w-full">
                      <span className="sm:hidden text-xs font-bold text-muted-foreground">
                        {compVillages[1]} {winnerIdx === 1 && <span className="text-[#C8102E]">✓</span>}
                      </span>
                      <div
                        className="px-4 py-2 rounded-xl text-center min-w-[100px] transition-all"
                        style={{
                          background:
                            m.winner === 1
                              ? "rgba(26,43,74,0.08)"
                              : "hsl(var(--muted)/0.3)",
                          border: `1px solid ${
                            m.winner === 1
                              ? "rgba(26,43,74,0.25)"
                              : "hsl(var(--border))"
                          }`,
                        }}
                      >
                        <p
                          className="text-base font-extrabold"
                          style={{
                            color: m.winner === 1 ? "#1A2B4A" : "hsl(var(--muted-foreground))",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {m.v1}
                        </p>
                        {m.winner === 1 && (
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: "#1A2B4A" }}>
                            Best
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Comparison Scorecard ──────────────────────────────────── */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Comparison Scorecard
                </p>
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Village 0 */}
                  <div className="text-center">
                    <p
                      className="text-2xl font-extrabold"
                      style={{
                        letterSpacing: "-0.04em",
                        color: winnerIdx === 0 ? "#1A2B4A" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {wins0}
                    </p>
                    <p
                      className="text-xs font-bold mt-0.5 truncate"
                      style={{ color: winnerIdx === 0 ? "#1A2B4A" : "hsl(var(--muted-foreground))" }}
                    >
                      {compVillages[0]}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      metrics won
                    </p>
                  </div>

                  {/* VS divider */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-px w-full"
                      style={{ background: "hsl(var(--border))" }}
                    />
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{
                        background: "hsl(var(--muted))",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {metrics.length} Metrics
                    </span>
                    <div
                      className="h-px w-full"
                      style={{ background: "hsl(var(--border))" }}
                    />
                  </div>

                  {/* Village 1 */}
                  <div className="text-center">
                    <p
                      className="text-2xl font-extrabold"
                      style={{
                        letterSpacing: "-0.04em",
                        color: winnerIdx === 1 ? "#1A2B4A" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {wins1}
                    </p>
                    <p
                      className="text-xs font-bold mt-0.5 truncate"
                      style={{ color: winnerIdx === 1 ? "#1A2B4A" : "hsl(var(--muted-foreground))" }}
                    >
                      {compVillages[1]}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      metrics won
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Decision Summary ──────────────────────────────────────── */}
              <div
                className="rounded-xl p-5"
                style={{ background: "hsl(var(--muted)/0.3)", border: "1px solid hsl(var(--border))" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Decision Summary
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Prioritize
                    </p>
                    <p className="text-sm font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                      {winnerVillage}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Won {winnerIdx === 0 ? wins0 : wins1}/{metrics.length} metrics, DSS index{" "}
                      {score0 >= score1 ? score0 : score1}/100.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Recommended Scheme
                    </p>
                    <p className="text-sm font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                      {recommendedScheme}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Highest suitability index dynamically computed.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Campaign Window
                    </p>
                    <p className="text-sm font-extrabold text-foreground" style={{ letterSpacing: "-0.02em" }}>
                      {campaignWindow}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Optimal seasonal harvest outreach window.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      DSS Explainability Evidence
                    </p>
                    <p className="text-xs text-foreground font-semibold leading-normal">
                      <strong>Evid:</strong> {winnerRec?.evidence || "N/A"}<br />
                      <strong>Gap:</strong> {winnerRec?.gap || "N/A"}<br />
                      <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase">
                        Src: {winnerRec?.source || "Census DB"} | Upd: {winnerRec?.lastUpdated || "2026-06-20"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs font-semibold text-muted-foreground leading-relaxed max-w-xl">
                    Based on composite metrics, <strong className="text-foreground">{winnerVillage}</strong> demonstrates
                    higher campaign readiness than{" "}
                    <strong className="text-foreground">{loserVillage}</strong>. Enrollment drive targeting{" "}
                    <strong className="text-foreground">{recommendedScheme}</strong> is recommended during{" "}
                    <strong className="text-foreground">{campaignWindow}</strong>.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/calender")}
                    className="shrink-0 text-xs font-bold transition-colors"
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
