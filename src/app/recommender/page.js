"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Check,
  Award,
  ArrowLeft,
  Loader2,
  Sparkles,
  FileText,
  BarChart2,
  Shield,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useSearchParams } from "next/navigation";

// Skeleton preview: shown before the user evaluates, gives a sense of what results look like
function ResultSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header hint */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-4 w-4 rounded bg-primary/15" />
        <div className="h-3.5 w-36 rounded bg-muted" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
          style={{ opacity: 1 - i * 0.2 }}
        >
          {/* Rank badge + title row */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-14 rounded-full bg-primary/15" />
              <div className="h-4 w-48 rounded bg-muted" />
            </div>
            <div className="text-right space-y-1">
              <div className="h-6 w-10 rounded bg-muted ml-auto" />
              <div className="h-3 w-14 rounded bg-muted/50 ml-auto" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/30 rounded-full"
              style={{ width: `${35 + i * 20}%` }}
            />
          </div>
          {/* Tags row */}
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-16 rounded-full bg-primary/10" />
            <div className="h-5 w-20 rounded-full bg-primary/10" />
            <div className="h-5 w-14 rounded-full bg-primary/10" />
          </div>
          {/* Explanation */}
          <div className="h-14 rounded-lg bg-muted/30" />
        </div>
      ))}
    </div>
  );
}

function RecommenderForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "9876543210",
    aadhaarId: "",
    age: "28",
    gender: "Female",
    occupation: "Agriculture",
    education: "Secondary",
    maritalStatus: "Married",
    numberOfChildren: "2",
    numberOfGirlChildrenUnder10: "1",
    landOwnershipAcres: "1",
    monthlyIncome: "12000",
    digitalUsage: "Medium",
  });

  useEffect(() => {
    if (searchParams) {
      const qName = searchParams.get("name") || "";
      const qAadhaar = searchParams.get("aadhaarId") || "";
      if (qName || qAadhaar) {
        setForm((prev) => ({
          ...prev,
          name: qName || prev.name,
          aadhaarId: qAadhaar || prev.aadhaarId,
        }));
      }
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        numberOfChildren: Number(form.numberOfChildren || 0),
        numberOfGirlChildrenUnder10: Number(form.numberOfGirlChildrenUnder10 || 0),
        landOwnershipAcres: Number(form.landOwnershipAcres || 0),
        monthlyIncome: Number(form.monthlyIncome || 0),
      };
      const response = await axios.post("/api/recommend", payload);
      if (response.data.success) {
        setResult(response.data.recommendations || []);
      } else {
        throw new Error(response.data.error || "Failed to retrieve recommendations");
      }
    } catch (err) {
      console.warn(err);
      setError(err.message || "An error occurred while generating recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-[1200px] mx-auto w-full space-y-6">

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
            <BreadcrumbPage className="font-extrabold text-secondary">DSS Recommender</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page header */}
      <div className="flex justify-between items-start gap-4 border-b border-border pb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition"
            >
              <ArrowLeft size={13} /> Back
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>
            Quick Beneficiary Recommender
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Calculate suitability scores and evaluate eligibility parameters dynamically.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full px-3 py-1 self-start mt-6">
          DSS · Scheme Finder
        </Badge>
      </div>

      {/* Main 45/55 grid */}
      <div className="grid md:grid-cols-[45%_55%] gap-6 items-start">

        {/* ── FORM SIDE (45%) — sticky ──────────────────────────────── */}
        <div className="md:sticky md:top-6">
          <Card className="border border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 pb-4 border-b border-border bg-secondary/5">
              <CardTitle className="flex items-center gap-2 text-xs text-foreground font-bold uppercase tracking-wider">
                <User className="text-primary h-4 w-4" /> Beneficiary Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Aadhaar ID
                  </label>
                  <Input
                    type="text"
                    name="aadhaarId"
                    value={form.aadhaarId}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit Aadhaar"
                    className="border-border text-xs rounded-lg h-10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Beneficiary Name"
                      className="border-border text-xs rounded-lg h-10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit Phone"
                      className="border-border text-xs rounded-lg h-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Age
                    </label>
                    <Input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      required
                      className="border-border text-xs rounded-lg h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Gender
                    </label>
                    <Select value={form.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                      <SelectTrigger className="w-full text-xs border-border rounded-lg h-10 bg-card text-foreground">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card text-foreground z-50">
                        <SelectItem value="Female" className="text-xs">Female</SelectItem>
                        <SelectItem value="Male" className="text-xs">Male</SelectItem>
                        <SelectItem value="Other" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Monthly Income (₹)
                    </label>
                    <Input
                      type="number"
                      name="monthlyIncome"
                      value={form.monthlyIncome}
                      onChange={handleInputChange}
                      placeholder="Monthly income"
                      required
                      className="border-border text-xs rounded-lg h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Occupation
                    </label>
                    <Select value={form.occupation} onValueChange={(val) => handleSelectChange("occupation", val)}>
                      <SelectTrigger className="w-full text-xs border-border rounded-lg h-10 bg-card text-foreground">
                        <SelectValue placeholder="Select Occupation" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card text-foreground z-50">
                        <SelectItem value="Agriculture" className="text-xs">Agriculture</SelectItem>
                        <SelectItem value="Salaried" className="text-xs">Salaried</SelectItem>
                        <SelectItem value="Self-Employed" className="text-xs">Self-Employed</SelectItem>
                        <SelectItem value="Housewife" className="text-xs">Housewife</SelectItem>
                        <SelectItem value="Student" className="text-xs">Student</SelectItem>
                        <SelectItem value="Other" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Land Owned (Acres)
                    </label>
                    <Input
                      type="number"
                      name="landOwnershipAcres"
                      value={form.landOwnershipAcres}
                      onChange={handleInputChange}
                      placeholder="Acres"
                      className="border-border text-xs rounded-lg h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Digital Usage
                    </label>
                    <Select value={form.digitalUsage} onValueChange={(val) => handleSelectChange("digitalUsage", val)}>
                      <SelectTrigger className="w-full text-xs border-border rounded-lg h-10 bg-card text-foreground">
                        <SelectValue placeholder="Digital Usage" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card text-foreground z-50">
                        <SelectItem value="Low" className="text-xs">Low</SelectItem>
                        <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                        <SelectItem value="High" className="text-xs">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Children Count
                    </label>
                    <Input
                      type="number"
                      name="numberOfChildren"
                      value={form.numberOfChildren}
                      onChange={handleInputChange}
                      className="border-border text-xs rounded-lg h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      Girl Children (&lt;10 Yrs)
                    </label>
                    <Input
                      type="number"
                      name="numberOfGirlChildrenUnder10"
                      value={form.numberOfGirlChildrenUnder10}
                      onChange={handleInputChange}
                      className="border-border text-xs rounded-lg h-10"
                    />
                  </div>
                </div>

                {/* Sticky CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/95 text-white rounded-lg transition shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" /> Evaluating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Evaluate Eligibility
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ── RESULTS SIDE (55%) ─────────────────────────────────────── */}
        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Empty state — skeleton preview instead of plain icon */}
          {!result && !error && !loading && <ResultSkeleton />}

          {/* Loading state */}
          {loading && (
            <Card className="flex flex-col justify-center items-center text-center p-12 space-y-4 min-h-[500px] border border-border bg-card shadow-sm rounded-xl">
              <Loader2 size={48} className="text-primary animate-spin" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Generating DSS Fit Matrix
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm font-semibold">
                Mapping rules and requesting context explanations.
              </p>
            </Card>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h2 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Award className="text-primary h-4 w-4" /> Optimal Scheme Fits
                </h2>

                <div className="space-y-4">
                  {result.map((scheme, index) => (
                    <motion.div
                      key={scheme.schemeCode || index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="relative overflow-hidden hover:shadow-md transition rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                        <CardHeader className="flex justify-between items-start flex-row pb-0 p-0">
                          <div>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 text-xs font-bold rounded px-2 py-0.5 uppercase tracking-wider">
                              Rank {index + 1}
                            </Badge>
                            <CardTitle className="font-extrabold text-secondary mt-3 text-base leading-snug">
                              {scheme.name}
                            </CardTitle>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xl font-extrabold text-primary block">
                              {scheme.score}
                            </span>
                            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
                              Fit Score
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4 p-0">
                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${scheme.score}%` }}
                            />
                          </div>

                          {/* Match Factors */}
                          <div className="space-y-2 pt-2 border-t border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                              Match Factors
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {scheme.drivers?.map((drv, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="border-primary/20 bg-primary/10 text-primary text-xs font-bold rounded"
                                >
                                  {drv}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Explanation */}
                          {scheme.explanation && (
                            <div className="text-xs text-muted-foreground italic mt-3 bg-muted/30 p-3 rounded-lg border border-border">
                              💡 {scheme.explanation}
                            </div>
                          )}

                          {/* DSS Metadata Panel */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            <div>
                              <span>Source:</span> <span className="text-foreground font-bold">{scheme.source || "Personal DB"}</span>
                            </div>
                            <div className="text-right">
                              <span>Last Updated:</span> <span className="text-foreground font-bold">{scheme.lastUpdated || "2026-06-20"}</span>
                            </div>
                            <div className="col-span-2">
                              <span>Expected Impact:</span> <span className="text-foreground normal-case font-bold">{scheme.expectedImpact || "N/A"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center space-x-3 text-primary text-xs">
                  <Check size={16} className="text-primary shrink-0" />
                  <span>
                    <strong>Audit Log:</strong> Evaluation logged and indexed in{" "}
                    <code className="font-mono text-[10px]">postal_service.personal_info</code>.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function QuickRecommender() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background py-6 text-foreground">
        <Suspense
          fallback={
            <div className="w-full max-w-[1200px] mx-auto p-12 text-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Loading DSS Recommender...
            </div>
          }
        >
          <RecommenderForm />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
