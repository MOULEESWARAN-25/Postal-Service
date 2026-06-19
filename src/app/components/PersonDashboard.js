"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Smartphone,
  MapPin,
  Users,
  Briefcase,
  ChevronLeft,
  Sparkles,
  Banknote,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useDashboardStore from "@/store/dashboardStore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PersonDashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const { individualProfile, triggerChatbot } = useDashboardStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = individualProfile;

  useEffect(() => {
    if (!user) return;
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const payload = {
          name: user.Name || user.name || "Citizen",
          phoneNumber: user.PhoneNumber || user.phoneNumber || "N/A",
          aadhaarId: String(user.aadhaar_id || user.aadharId || ""),
          age: Number(user.Age || user.age || 30),
          gender: user.Gender || user.gender || "Female",
          occupation: user.Occupation || user.occupation || "Agriculture",
          education: user.EducationLevel || user.educationLevel || "Secondary",
          maritalStatus: user.MaritalStatus || user.maritalStatus || "Married",
          numberOfChildren: Number(user.NoOfChildrenInTheHouse || user.numberOfChildren || 0),
          numberOfGirlChildrenUnder10: Number(user.NoOfGirlChildrenUnder10 || user.numberOfGirlChildrenUnder10 || 0),
          landOwnershipAcres: user.OwnLandForAgriculture === 'Yes' ? 5 : 0,
          monthlyIncome: Number(user.MonthlyIncome || user.monthlyIncome || 10000),
          digitalUsage: user.DigitalUsage || user.digitalUsage || 'Medium'
        };

        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.warn("Error fetching dynamic fit scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleAskAI = (schemeName) => {
    if (!user) return;
    const q = `Explain in detail why ${user.Name || user.name || 'this citizen'} is recommended the scheme "${schemeName}". Highlight the eligibility checkmarks, age requirements, income brackets, and why this is a good fit.`;
    triggerChatbot(q);
  };

  const hasActiveLoan = user?.AlreadyInLoan === 'Yes' || user?.alreadyInLoan === 'Yes';

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-background text-foreground">
        <div className="page-container space-y-5">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/publicInfo">Beneficiaries</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{user?.Name || user?.name || "Active Profile"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back navigation button and label */}
          <div className="flex justify-between items-center border-b pb-4 border-border">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              size="sm"
              className="flex items-center gap-1.5 font-semibold text-primary hover:bg-muted"
            >
              <ChevronLeft size={16} />
              <span>Back to Public Directory</span>
            </Button>
            <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold px-3 py-1">
              Active Profile
            </Badge>
          </div>

          {/* Identity & Socio-Economic Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">👤 Personal Identity Card</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="grid sm:grid-cols-2 gap-4 text-sm pt-2">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Full Name:</strong> <span className="font-semibold text-foreground">{user.Name || user.name}</span>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Age / Gender:</strong> <span className="font-semibold text-foreground">{user.Age || user.age} Yrs / {user.Gender || user.gender}</span>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Phone Number:</strong> <span className="font-semibold text-foreground">{user.PhoneNumber || user.phoneNumber}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Address Area:</strong> <span className="font-semibold text-foreground">{user.Address || user.address || `${user.area || ""}, ${user.location || ""}`}</span>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Education Level:</strong> <span className="font-semibold text-foreground">{user.EducationLevel || user.educationLevel || "N/A"}</span>
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Aadhaar Card ID:</strong> <span className="font-semibold font-mono text-foreground">{user.aadhaar_id || user.aadharId}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No profile details selected.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Socio-Economic Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-1 text-sm">
                <div className="flex items-center space-x-3">
                  <Heart className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground">Marital:</span>
                  <span className="font-bold text-foreground">{user?.MaritalStatus || user?.maritalStatus || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="text-secondary h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground">Occupation:</span>
                  <span className="font-bold text-foreground">{user?.Occupation || user?.occupation || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-green-500 h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground">Village/Region:</span>
                  <span className="font-bold text-foreground">{user?.Area || user?.area || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Household, Banking and Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-md font-bold text-foreground flex items-center gap-1.5">
                <Users className="text-primary h-5 w-5" /> Family & Household
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Children in House:</span>
                  <span className="font-bold text-foreground">{user?.NoOfChildrenInTheHouse ?? user?.numberOfChildren ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Girl Children (&lt;10 Yrs):</span>
                  <span className="font-bold text-foreground">{user?.NoOfGirlChildrenUnder10 ?? user?.numberOfGirlChildrenUnder10 ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Owns Agricultural Land:</span>
                  <span className="font-bold text-foreground">{user?.OwnLandForAgriculture || "No"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Household Income:</span>
                  <span className="font-bold text-primary">₹{(user?.MonthlyIncome || user?.monthlyIncome || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-md font-bold text-foreground flex items-center gap-1.5">
                <Banknote className="text-primary h-5 w-5" /> Credit & Banking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Already in Loan:</span>
                  <Badge 
                    variant="outline"
                    className={hasActiveLoan 
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                    }
                  >
                    {user?.AlreadyInLoan || user?.alreadyInLoan || "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Need New Loan:</span>
                  <span className="font-semibold text-foreground">{user?.NeedNewLoan || user?.needNewLoan || "No"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Needs Education Loan:</span>
                  <span className="font-semibold text-foreground">{user?.NeedEducationLoan || user?.needEducationLoan || "No"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Income Taxpayer:</span>
                  <span className="font-semibold text-foreground">{user?.TaxPayer || "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-md font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="text-primary h-5 w-5" /> Digital Touchpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Has Bank Account:</span>
                  <span className="font-semibold text-foreground">{user?.BankAccount || "Yes"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Digital Usage:</span>
                  <span className="font-semibold text-foreground">{user?.DigitalUsage || user?.digitalUsage || "Medium"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setShowPopup(true)}
                className="w-full h-10 flex items-center justify-center gap-1.5"
              >
                <span>View Scheme Comparison</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Dynamic Scheme Fit Scores Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <Sparkles className="text-primary h-6 w-6" /> AI-Recommended Schemes & Fit Scores
            </h2>
            {loading && (
              <span className="text-xs text-primary font-bold animate-pulse flex items-center gap-1.5">
                <Sparkles className="animate-spin" size={14} /> Recomputing Scores...
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Card className="border-border bg-card" key={idx}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <Card
                  key={rec.schemeCode || index}
                  className="bg-card hover:shadow-md transition relative flex flex-col justify-between overflow-hidden"
                >
                  <CardHeader className="flex justify-between items-start flex-row pb-0">
                    <div>
                      <Badge className="bg-red-50 text-[#C8102E] hover:bg-red-50 border border-red-100 text-[10px] font-bold rounded-md px-2 py-0.5 uppercase tracking-wider">
                        Rank {index + 1}
                      </Badge>
                      <CardTitle className="font-extrabold text-[#1A2B4A] mt-3 text-base leading-snug">{rec.name}</CardTitle>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-0.5 justify-end">
                        <span className="text-2xl font-extrabold text-[#C8102E]">{rec.score}</span>
                        <Tooltip>
                          <TooltipTrigger className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:bg-muted rounded transition-colors" aria-label="Score Explanation Tooltip">
                            <HelpCircle className="h-3.5 w-3.5" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-card border border-border text-foreground text-xs p-2.5 max-w-xs shadow-md">
                            Suitability Score based on age, gender, occupation, income brackets, and household composition rules.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Fit Score</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4 flex-grow">
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Match Factors</span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.drivers?.map((drv, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md px-2 py-0.5"
                          >
                            {drv}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {rec.explanation && (
                      <div className="text-xs text-slate-600 italic mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        💡 {rec.explanation}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0 border-0 bg-transparent px-6 pb-6">
                    <Button
                      onClick={() => handleAskAI(rec.name)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full h-10 font-bold"
                    >
                      <Sparkles size={14} className="text-[#C8102E] animate-pulse" />
                      <span className="text-xs">Explain Recommendation</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground font-medium">
                No recommended schemes computed. Run eligibility check.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Comparison Dialog */}
      {user && (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-y-auto border-border bg-card">
            <DialogHeader className="border-b border-border pb-3">
              <DialogTitle className="text-2xl font-bold text-foreground">Recommended Schemes Comparison</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Socio-economic matching factors and benefit rules computed for <strong>{user.Name || user.name}</strong>:
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 md:grid-cols-3 pt-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-border bg-muted/20 p-5 space-y-4"
                >
                  <h5 className="text-lg font-bold text-foreground">
                    {rec.name}
                  </h5>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Fit Rationale</span>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {rec.explanation || "Suitable for the beneficiary's age profile and demographic factors."}
                    </p>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => setShowPopup(false)}
                className="w-full md:w-auto px-6 h-10 font-bold"
              >
                Close Comparison
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </ErrorBoundary>
  );
}
