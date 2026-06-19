"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Check, Award, ArrowLeft, Loader2, HelpCircle
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useSearchParams } from "next/navigation";

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
    digitalUsage: "Medium"
  });

  useEffect(() => {
    if (searchParams) {
      const qName = searchParams.get("name") || "";
      const qAadhaar = searchParams.get("aadhaarId") || "";
      if (qName || qAadhaar) {
        setForm(prev => ({
          ...prev,
          name: qName || prev.name,
          aadhaarId: qAadhaar || prev.aadhaarId
        }));
      }
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
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
        monthlyIncome: Number(form.monthlyIncome || 0)
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
    <div className="page-container max-w-[900px] mx-auto w-full space-y-6">
      
      {/* Navigation Breadcrumbs */}
      <Breadcrumb className="text-xs">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-extrabold text-secondary">DSS Recommender</BreadcrumbPage>
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
          DSS Recommender
        </Badge>
      </div>

      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Quick Beneficiary Recommender
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Calculate suitability scores and evaluate eligibility parameters dynamically.
          </p>
        </div>
        <Badge className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full text-xs font-semibold">
          Scheme Finder
        </Badge>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form Side (40% width) */}
        <Card className="md:col-span-2 border border-border bg-card shadow-sm h-fit rounded-xl p-5">
          <CardHeader className="p-0 pb-4 border-b border-border mb-4">
            <CardTitle className="flex items-center gap-2 text-xs text-foreground font-bold uppercase tracking-wider">
              <User className="text-primary h-4 w-4" /> Beneficiary Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
            
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Aadhaar ID</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Full Name</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Phone Number</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Age</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Gender</label>
                  <Select
                    value={form.gender}
                    onValueChange={(val) => handleSelectChange("gender", val)}
                  >
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Monthly Income (₹)</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Occupation</label>
                  <Select
                    value={form.occupation}
                    onValueChange={(val) => handleSelectChange("occupation", val)}
                  >
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Land Owned (Acres)</label>
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Digital Usage</label>
                  <Select
                    value={form.digitalUsage}
                    onValueChange={(val) => handleSelectChange("digitalUsage", val)}
                  >
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
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Children Count</label>
                  <Input 
                    type="number" 
                    name="numberOfChildren" 
                    value={form.numberOfChildren} 
                    onChange={handleInputChange}
                    className="border-border text-xs rounded-lg h-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Girl Children (&lt;10 Yrs)</label>
                  <Input 
                    type="number" 
                    name="numberOfGirlChildrenUnder10" 
                    value={form.numberOfGirlChildrenUnder10} 
                    onChange={handleInputChange}
                    className="border-border text-xs rounded-lg h-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg transition shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-3.5 w-3.5" /> Evaluating...
                  </>                   
                ) : (
                  "Evaluate Eligibility"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Side (60% width) */}
        <div className="md:col-span-3 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {!result && !error && !loading && (
            <Card className="flex flex-col justify-center items-center text-center p-12 text-muted-foreground min-h-[500px] border border-border bg-card shadow-sm rounded-xl">
              <HelpCircle size={48} className="text-muted-foreground/30 mb-4" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Ready for Eligibility Evaluation</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm font-semibold">
                Fill in the beneficiary details on the left and submit to process suitability metrics.
              </p>
            </Card>
          )}

          {loading && (
            <Card className="flex flex-col justify-center items-center text-center p-12 space-y-4 min-h-[500px] border border-border bg-card shadow-sm rounded-xl">
              <Loader2 size={48} className="text-primary animate-spin" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Generating DSS Fit Matrix</h3>
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
                            <CardTitle className="font-extrabold text-secondary mt-3 text-base leading-snug">{scheme.name}</CardTitle>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xl font-extrabold text-primary block">
                              {scheme.score}
                            </span>
                            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">Fit Score</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4 p-0">
                          {/* Progress Bar Fit Score */}
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${scheme.score}%` }}
                            />
                          </div>

                          {/* Match Factors */}
                          <div className="space-y-2 pt-2 border-t border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Match Factors</span>
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

                          {/* Explanation text */}
                          {scheme.explanation && (
                            <div className="text-xs text-muted-foreground italic mt-3 bg-muted/30 p-3 rounded-lg border border-border">
                              💡 {scheme.explanation}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center space-x-3 text-primary text-xs">
                  <Check size={16} className="text-primary shrink-0" />
                  <span>
                    <strong>Audit Log:</strong> Evaluation logged and indexed in `postal_service.personal_info`.
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
        <Suspense fallback={
          <div className="w-full max-w-[1200px] mx-auto p-12 text-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Loading DSS Recommender...
          </div>
        }>
          <RecommenderForm />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
