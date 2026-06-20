"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  Building2,
  MapPin,
  FileText,
  RefreshCw,
  Map,
  Users,
  Award,
  BarChart2,
  TrendingUp,
  Target,
  Layers,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Tooltip as ShadTooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Header from "../components/postalHeadData/header";
import useheaddata from "@/store/headpostdata";
import axios from "axios";
import { toast } from "sonner";
import useDashboardStore from "@/store/dashboardStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Donut chart color tokens using design system vars (resolved values)
const CHART_COLORS = {
  registered: "#1A2B4A",   // --color-secondary (dark navy)
  pending: "#E2E8F0",      // --color-border (neutral light)
};

// Centered label overlay for the donut chart
function DonutCenter({ pct, count, total }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-lg font-extrabold text-foreground leading-none" style={{ letterSpacing: "-0.04em" }}>
        {pct}%
      </span>
      <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
        {count}/{total}
      </span>
    </div>
  );
}

const PostOfficeDashboard = () => {
  const { headData } = useDashboardStore();
  const { Sta, Dis, sub, sch, loa, selectedScheme, setSelectedScheme, fetchHeadData } = useheaddata();
  const [isAfterMela, setIsAfterMela] = useState(false);

  const data = sch;

  const handleAfterMela = () => {
    setIsAfterMela(true);
  };

  useEffect(() => {
    setIsAfterMela(false);
  }, [selectedScheme, sch]);

  // Fetch head post data dynamically when selection changes
  useEffect(() => {
    if (sub && Sta && Dis) {
      fetchHeadData();
    }
  }, [selectedScheme, sub, Sta, Dis]);

  const donutChartData = sch && data?.resultLengths
    ? Object.entries(data.resultLengths).map(([branch, count]) => {
        const value = Number(count);
        const registeredCount = data.schemeCount[branch] || 0;
        const basePct = value > 0 ? Math.round((registeredCount / value) * 100) : 0;
        const probability = isAfterMela ? Math.min(basePct + 25, 95) : basePct;
        const displayRegistered = isAfterMela 
          ? Math.min(Math.round(value * (probability / 100)), value)
          : registeredCount;
        
        return {
          name: branch,
          value: value,
          registeredCount: displayRegistered,
          probability: probability,
        };
      })
    : [];

  const totalEligiblePersons = donutChartData.reduce((sum, b) => sum + b.value, 0);
  const totalSchemesRegistered = donutChartData.reduce((sum, b) => sum + b.registeredCount, 0);
  const totalUnregistered = totalEligiblePersons - totalSchemesRegistered;
  const overallPct = totalEligiblePersons > 0
    ? Math.round((totalSchemesRegistered / totalEligiblePersons) * 100)
    : 0;

  const branchCount = donutChartData.length;

  // KPI summary cards
  const kpiCards = [
    {
      label: "Campaign Reach",
      value: totalEligiblePersons || "—",
      sub: "Total eligible persons",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      tooltip: "Total number of eligible persons identified for campaign targeting across all branch areas."
    },
    {
      label: "Enrollment Conversion",
      value: `${overallPct}%`,
      sub: `${totalSchemesRegistered} enrolled`,
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      tooltip: "Percentage of eligible citizens enrolled out of total campaign reach."
    },
    {
      label: "Branch Readiness",
      value: branchCount || "—",
      sub: "Active branch offices",
      icon: <Layers className="h-4 w-4 text-muted-foreground" />,
      tooltip: "Number of active branch offices under the selected Sub-Post Office."
    },
    {
      label: "Opportunity Potential",
      value: totalUnregistered || "—",
      sub: "Pending registrations",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      tooltip: "Number of citizens matching eligibility criteria who remain unregistered."
    },
  ];

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-background text-foreground py-6">
        <div className="page-container max-w-[1440px] mx-auto w-full space-y-6">

          {/* ── Page Title Row ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>
                Head Office Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                Branch Performance &amp; Campaign Readiness
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* ShadCN Scheme Select */}
              <Select value={selectedScheme} onValueChange={(val) => setSelectedScheme(val)}>
                <SelectTrigger className="w-[220px] h-9 border-border text-xs rounded-lg bg-card text-foreground font-semibold">
                  <SelectValue placeholder="Select Scheme" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground z-50">
                  <SelectItem value="Sukanya Samriddhi Account (SSA)" className="text-xs">Sukanya Samriddhi Account (SSA)</SelectItem>
                  <SelectItem value="Post Office Savings Account (SB)" className="text-xs">Post Office Savings Account (SB)</SelectItem>
                  <SelectItem value="National Savings Recurring Deposit (RD)" className="text-xs">National Savings Recurring Deposit (RD)</SelectItem>
                  <SelectItem value="National Savings Time Deposit (TD)" className="text-xs">National Savings Time Deposit (TD)</SelectItem>
                  <SelectItem value="Monthly Income Scheme (MIS)" className="text-xs">Monthly Income Scheme (MIS)</SelectItem>
                  <SelectItem value="Public Provident Fund (PPF)" className="text-xs">Public Provident Fund (PPF)</SelectItem>
                  <SelectItem value="Senior Citizens Savings Scheme (SCSS)" className="text-xs">Senior Citizens Savings Scheme (SCSS)</SelectItem>
                  <SelectItem value="National Savings Certificate (NSC)" className="text-xs">National Savings Certificate (NSC)</SelectItem>
                  <SelectItem value="Kisan Vikas Patra (KVP)" className="text-xs">Kisan Vikas Patra (KVP)</SelectItem>
                  <SelectItem value="Mahila Samman Savings Certificate (MSSC)" className="text-xs">Mahila Samman Savings Certificate (MSSC)</SelectItem>
                  <SelectItem value="PM CARES for Children Scheme" className="text-xs">PM CARES for Children Scheme</SelectItem>
                  <SelectItem value="Regular Savings Account (IPPB)" className="text-xs">Regular Savings Account (IPPB)</SelectItem>
                  <SelectItem value="Basic Savings Account (IPPB)" className="text-xs">Basic Savings Account (IPPB)</SelectItem>
                  <SelectItem value="DigiSmart Savings Account (IPPB)" className="text-xs">DigiSmart Savings Account (IPPB)</SelectItem>
                  <SelectItem value="Premium Savings Account (IPPB)" className="text-xs">Premium Savings Account (IPPB)</SelectItem>
                  <SelectItem value="Premium Aarogya Savings Account (IPPB)" className="text-xs">Premium Aarogya Savings Account (IPPB)</SelectItem>
                  <SelectItem value="SHG Savings Account (IPPB)" className="text-xs">SHG Savings Account (IPPB)</SelectItem>
                  <SelectItem value="Current Account (IPPB)" className="text-xs">Current Account (IPPB)</SelectItem>
                  <SelectItem value="Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)" className="text-xs">Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)</SelectItem>
                  <SelectItem value="Pradhan Mantri Suraksha Bima Yojana (PMSBY)" className="text-xs">Pradhan Mantri Suraksha Bima Yojana (PMSBY)</SelectItem>
                  <SelectItem value="Atal Pension Yojana (APY)" className="text-xs">Atal Pension Yojana (APY)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleAfterMela}
                disabled={loa}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg font-bold text-xs"
              >
                {loa ? (
                  <>
                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    <span>After Mela</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ── KPI Cards Row ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpiCards.map((kpi, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    {kpi.label}
                    {kpi.tooltip && (
                      <ShadTooltip>
                        <TooltipTrigger className="cursor-help hover:opacity-80 border-none bg-transparent p-0" aria-label={`${kpi.label} explanation`}>
                          <HelpCircle size={10} className="text-muted-foreground/60" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-0 text-xs p-2.5 max-w-xs shadow-md z-[100]">
                          <p className="font-bold mb-1">{kpi.label} ⓘ</p>
                          <p className="text-[10px] text-slate-300">{kpi.tooltip}</p>
                        </TooltipContent>
                      </ShadTooltip>
                    )}
                  </span>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground leading-none" style={{ letterSpacing: "-0.04em" }}>
                    {kpi.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-1">{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Post Office Location Card ──────────────────────────────── */}
          <div className="border border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <div className="bg-secondary/5 border-b border-border px-5 py-3 flex items-center gap-2">
              <MapPin className="text-primary h-4 w-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Post Office Details</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border rounded-xl overflow-hidden text-xs">
                <div className="p-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
                  <Package className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span><strong className="text-foreground">Post Office:</strong> <span className="text-muted-foreground">{sub?.name || "Sub Post Office"}</span></span>
                </div>
                <div className="p-4 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
                  <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span><strong className="text-foreground">Pin Code:</strong> <span className="text-muted-foreground">{sub?.pincode || "—"}</span></span>
                </div>
                <div className="p-4 flex items-center gap-3 border-b sm:border-b-0 border-border">
                  <Map className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span><strong className="text-foreground">District:</strong> <span className="text-muted-foreground">{Dis || "—"}</span></span>
                </div>
                <div className="p-4 flex items-center gap-3 sm:border-r border-t border-border col-span-1 sm:col-span-2 bg-muted/5">
                  <MapPin className="text-primary h-4 w-4 shrink-0" />
                  <span><strong className="text-foreground">State:</strong> <span className="text-muted-foreground">{Sta?.name || "—"}</span></span>
                </div>
                <div className="p-4 flex items-center gap-3 border-t border-border bg-muted/5">
                  <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span><strong className="text-foreground">Type:</strong> <span className="text-muted-foreground">{sub ? "Sub PostOffice Branch" : "—"}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Branch Donut Grid ──────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch Performance</h2>
              {branchCount > 0 && (
                <span className="text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-2 py-0.5">
                  {branchCount} Branches
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {donutChartData.length > 0 ? (
                donutChartData.map((branchData, index) => {
                  const registrationProbability = branchData.probability;
                  const pendingRegistrations = branchData.value - branchData.registeredCount;
                  const pct = branchData.value > 0
                    ? Math.round((branchData.registeredCount / branchData.value) * 100)
                    : 0;

                  return (
                    <div
                      key={`branch-${index}`}
                      className="bg-card border border-border flex flex-col rounded-xl shadow-sm p-5 h-full"
                    >
                      {/* Branch header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-foreground text-xs flex items-center gap-1.5">
                          <MapPin className="text-primary h-3.5 w-3.5 shrink-0" />
                          BO {index + 1}: {branchData.name}
                        </h3>
                        <span
                          className="text-[10px] font-bold rounded-full px-2 py-0.5"
                          style={{
                            background: registrationProbability >= 50 ? "rgba(26,43,74,0.08)" : "rgba(226,232,240,0.6)",
                            color: registrationProbability >= 50 ? "#1A2B4A" : "#64748B",
                            border: registrationProbability >= 50 ? "1px solid rgba(26,43,74,0.2)" : "1px solid #E2E8F0",
                          }}
                        >
                          {registrationProbability >= 50 ? "Active" : "Low Reach"}
                        </span>
                      </div>

                      {/* Donut Chart with centered overlay */}
                      <div className="flex justify-center my-2">
                        <div className="relative w-[180px] h-[180px]">
                          <PieChart width={180} height={180}>
                            <Pie
                              data={[
                                { name: "Enrolled", value: branchData.registeredCount },
                                { name: "Pending", value: Math.max(pendingRegistrations, 0) },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={52}
                              outerRadius={72}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              <Cell fill={CHART_COLORS.registered} />
                              <Cell fill={CHART_COLORS.pending} />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                fontSize: "11px",
                                fontFamily: "Inter, sans-serif",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                background: "hsl(var(--card))",
                                color: "hsl(var(--foreground))",
                              }}
                            />
                          </PieChart>
                          <DonutCenter
                            pct={pct}
                            count={branchData.registeredCount}
                            total={branchData.value}
                          />
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex justify-center gap-4 text-[10px] font-semibold text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS.registered }} />
                          Enrolled
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS.pending }} />
                          Pending
                        </div>
                      </div>

                      {/* Metric grid */}
                      <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-border text-xs mt-auto">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>Total: <strong className="text-foreground">{branchData.value}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Award className="text-primary h-3.5 w-3.5 shrink-0" />
                          <span>Enrolled: <strong className="text-foreground">{branchData.registeredCount}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>Pending: <strong className="text-foreground">{pendingRegistrations}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <BarChart2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Success: <strong className="text-foreground">{registrationProbability}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2 border-t border-dashed border-border pt-2 mt-1">
                          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                          <span>Reason: <strong className="text-foreground">{headData?.negativeFeedback || "General low awareness"}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-muted-foreground font-bold border border-border bg-card shadow-sm rounded-xl text-xs uppercase tracking-widest">
                  Select a scheme to view branch performance data.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PostOfficeDashboard;
