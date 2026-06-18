"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Check, Award, ArrowLeft, Loader2, HelpCircle
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <div className="w-full max-w-[1200px] mx-auto space-y-6 px-4 md:px-6">
      
      {/* Navigation Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="font-semibold text-slate-500 hover:text-[#C8102E]">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-extrabold text-[#1A2B4A]">Beneficiary DSS Recommender</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Link and Badge */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <Link href="/" className="flex items-center space-x-2 text-[#C8102E] hover:underline font-bold transition">
          <ArrowLeft size={16} />
          <span className="text-xs">Back to Regional Intelligence</span>
        </Link>
        <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider bg-red-50 border border-red-100 px-3 py-1 rounded-full">
          DSS Recommender
        </span>
      </div>

      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Quick Beneficiary Recommender
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Calculate suitability scores and evaluate eligibility parameters dynamically.
          </p>
        </div>
        <Badge className="bg-[#1A2B4A] text-white py-1 px-3 rounded-full text-xs font-semibold">
          Which scheme fits best?
        </Badge>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form Side (40% width) */}
        <Card className="md:col-span-2 border border-slate-200 bg-white shadow-sm h-fit rounded-2xl p-5">
          <CardHeader className="p-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-800 font-bold uppercase tracking-wider">
              <User className="text-[#C8102E] h-4 w-4" /> Beneficiary Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
            
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aadhaar ID</label>
                <Input 
                  type="text" 
                  name="aadhaarId" 
                  value={form.aadhaarId} 
                  onChange={handleInputChange}
                  placeholder="Enter 12-digit Aadhaar"
                  className="border-border text-xs rounded-xl h-9 animate-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <Input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleInputChange}
                    placeholder="Beneficiary Name"
                    className="border-border text-xs rounded-xl h-9"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                  <Input 
                    type="text" 
                    name="phoneNumber" 
                    value={form.phoneNumber} 
                    onChange={handleInputChange}
                    placeholder="10-digit Phone"
                    className="border-border text-xs rounded-xl h-9"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Age</label>
                  <Input 
                    type="number" 
                    name="age" 
                    value={form.age} 
                    onChange={handleInputChange}
                    placeholder="Age"
                    required
                    className="border-border text-xs rounded-xl h-9"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</label>
                  <Select
                    value={form.gender}
                    onValueChange={(val) => handleSelectChange("gender", val)}
                  >
                    <SelectTrigger className="w-full text-xs border-border rounded-xl h-9 bg-white text-slate-800">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-white text-slate-800">
                      <SelectItem value="Female" className="text-xs">Female</SelectItem>
                      <SelectItem value="Male" className="text-xs">Male</SelectItem>
                      <SelectItem value="Other" className="text-xs">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Income (₹)</label>
                  <Input 
                    type="number" 
                    name="monthlyIncome" 
                    value={form.monthlyIncome} 
                    onChange={handleInputChange}
                    placeholder="Monthly income"
                    required
                    className="border-border text-xs rounded-xl h-9"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Occupation</label>
                  <Select
                    value={form.occupation}
                    onValueChange={(val) => handleSelectChange("occupation", val)}
                  >
                    <SelectTrigger className="w-full text-xs border-border rounded-xl h-9 bg-white text-slate-800">
                      <SelectValue placeholder="Select Occupation" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-white text-slate-800">
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Land Owned (Acres)</label>
                  <Input 
                    type="number" 
                    name="landOwnershipAcres" 
                    value={form.landOwnershipAcres} 
                    onChange={handleInputChange}
                    placeholder="Acres"
                    className="border-border text-xs rounded-xl h-9"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Usage</label>
                  <Select
                    value={form.digitalUsage}
                    onValueChange={(val) => handleSelectChange("digitalUsage", val)}
                  >
                    <SelectTrigger className="w-full text-xs border-border rounded-xl h-9 bg-white text-slate-800">
                      <SelectValue placeholder="Digital Usage" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-white text-slate-800">
                      <SelectItem value="Low" className="text-xs">Low</SelectItem>
                      <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                      <SelectItem value="High" className="text-xs">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Children Count</label>
                  <Input 
                    type="number" 
                    name="numberOfChildren" 
                    value={form.numberOfChildren} 
                    onChange={handleInputChange}
                    className="border-border text-xs rounded-xl h-9"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Girl Children (&lt;10 Yrs)</label>
                  <Input 
                    type="number" 
                    name="numberOfGirlChildrenUnder10" 
                    value={form.numberOfGirlChildrenUnder10} 
                    onChange={handleInputChange}
                    className="border-border text-xs rounded-xl h-9"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold bg-[#C8102E] hover:bg-[#A00D24] text-white rounded-full transition shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" /> Evaluating...
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
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {!result && !error && !loading && (
            <Card className="flex flex-col justify-center items-center text-center p-12 text-slate-400 min-h-[500px] border border-slate-200 bg-white shadow-sm rounded-2xl">
              <HelpCircle size={48} className="text-slate-200 mb-4" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ready for Eligibility Evaluation</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm font-medium">
                Fill in the beneficiary details on the left and submit to process suitability metrics.
              </p>
            </Card>
          )}

          {loading && (
            <Card className="flex flex-col justify-center items-center text-center p-12 space-y-4 min-h-[500px] border border-slate-200 bg-white shadow-sm rounded-2xl">
              <Loader2 size={48} className="text-[#C8102E] animate-spin" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Generating DSS Fit Matrix</h3>
              <p className="text-xs text-slate-400 max-w-sm font-medium">
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
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Award className="text-green-600 h-5 w-5" /> Optimal Scheme Fits
                </h2>

                <div className="space-y-4">
                  {result.map((scheme, index) => (
                    <motion.div
                      key={scheme.schemeCode || index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden pl-5 pr-5 py-5 border border-slate-200 bg-white hover:shadow-sm transition rounded-2xl">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C8102E]" />
                        
                        <div className="flex justify-between items-start pl-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-widest block">
                              Rank {index + 1}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 mt-1">{scheme.name}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-extrabold text-[#C8102E]">
                              {scheme.score}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Suitability Score</span>
                          </div>
                        </div>

                        {/* Progress Bar Score Dominance */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 pl-2 overflow-hidden">
                          <div 
                            className="bg-[#C8102E] h-full rounded-full transition-all duration-500"
                            style={{ width: `${scheme.score}%` }}
                          />
                        </div>

                        {/* Match Factors */}
                        <div className="mt-4 flex flex-wrap gap-1.5 pl-2">
                          {scheme.drivers?.map((drv, i) => (
                            <Badge key={i} variant="outline" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 text-[10px]">
                              {drv}
                            </Badge>
                          ))}
                        </div>

                        {/* Explanation text */}
                        <div className="mt-4 border-t pt-3 border-slate-100 text-xs text-slate-500 italic pl-2">
                          💡 {scheme.explanation}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-green-50/50 border border-green-200 p-4 rounded-xl flex items-center space-x-3 text-green-800 text-xs">
                  <Check size={18} className="text-green-600 shrink-0" />
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
      <div className="min-h-screen bg-[#F8F9FB] py-6 text-slate-800">
        <Suspense fallback={
          <div className="w-full max-w-[1200px] mx-auto p-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Loading DSS Recommender...
          </div>
        }>
          <RecommenderForm />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
