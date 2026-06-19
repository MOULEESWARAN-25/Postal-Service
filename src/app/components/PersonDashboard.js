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
        <div className="page-container space-y-6">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/publicInfo" className="font-semibold text-muted-foreground hover:text-primary">Beneficiaries</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-secondary">{user?.Name || user?.name || "Active Profile"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back navigation button and label */}
          <div className="flex justify-between items-center border-b pb-4 border-border">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              size="sm"
              className="flex items-center gap-1.5 font-bold text-primary hover:bg-muted h-8"
            >
              <ChevronLeft size={14} />
              <span>Back to Public Directory</span>
            </Button>
            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 font-bold px-3 py-1 text-xs rounded-full">
              Active Profile
            </Badge>
          </div>

          {/* Identity & Socio-Economic Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border border-border bg-card shadow-sm rounded-xl p-6">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">👤 Personal Identity Card</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {user ? (
                  <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
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
                  <p className="text-muted-foreground text-xs">No profile details selected.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm rounded-xl p-6 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Socio-Economic Factors</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 mt-1 text-xs">
                  <div className="flex items-center space-x-3">
                    <Heart className="text-primary h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground font-semibold">Marital:</span>
                    <span className="font-bold text-foreground">{user?.MaritalStatus || user?.maritalStatus || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="text-secondary h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground font-semibold">Occupation:</span>
                    <span className="font-bold text-foreground">{user?.Occupation || user?.occupation || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-emerald-600 h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground font-semibold">Village/Region:</span>
                    <span className="font-bold text-foreground">{user?.Area || user?.area || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Household, Banking and Actions Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-border bg-card shadow-sm rounded-xl p-6">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="text-primary h-4 w-4" /> Family & Household
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Children in House:</span>
                    <span className="font-bold text-foreground">{user?.NoOfChildrenInTheHouse ?? user?.numberOfChildren ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Girl Children (&lt;10 Yrs):</span>
                    <span className="font-bold text-foreground">{user?.NoOfGirlChildrenUnder10 ?? user?.numberOfGirlChildrenUnder10 ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Owns Agricultural Land:</span>
                    <span className="font-bold text-foreground">{user?.OwnLandForAgriculture || "No"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Monthly Household Income:</span>
                    <span className="font-bold text-primary">₹{(user?.MonthlyIncome || user?.monthlyIncome || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm rounded-xl p-6">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Banknote className="text-primary h-4 w-4" /> Credit & Banking Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Already in Loan:</span>
                    <Badge 
                      variant="outline"
                      className={hasActiveLoan 
                        ? "border-destructive/20 bg-destructive/10 text-destructive text-xs rounded"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs rounded"
                      }
                    >
                      {user?.AlreadyInLoan || user?.alreadyInLoan || "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Need New Loan:</span>
                    <span className="font-bold text-foreground">{user?.NeedNewLoan || user?.needNewLoan || "No"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Needs Education Loan:</span>
                    <span className="font-bold text-foreground">{user?.NeedEducationLoan || user?.needEducationLoan || "No"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Income Taxpayer:</span>
                    <span className="font-bold text-foreground">{user?.TaxPayer || "No"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm rounded-xl p-6 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border mb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Smartphone className="text-primary h-4 w-4" /> Digital Touchpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Has Bank Account:</span>
                    <span className="font-bold text-foreground">{user?.BankAccount || "Yes"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Digital Usage:</span>
                    <span className="font-bold text-foreground">{user?.DigitalUsage || user?.digitalUsage || "Medium"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-4">
                <Button
                  onClick={() => setShowPopup(true)}
                  className="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold"
                >
                  <span>View Scheme Comparison</span>
                  <ArrowRight size={14} />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Dynamic Scheme Fit Scores Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
                <Sparkles className="text-primary h-5 w-5" /> AI-Recommended Schemes & Fit Scores
              </h2>
              {loading && (
                <span className="text-xs text-primary font-bold animate-pulse flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="animate-spin" size={12} /> Recomputing...
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <Card className="border-border bg-card p-6" key={idx}>
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <Card
                    key={rec.schemeCode || index}
                    className="bg-card hover:shadow-md transition relative flex flex-col justify-between border border-border rounded-xl p-6"
                  >
                    <div>
                      <CardHeader className="flex justify-between items-start flex-row pb-0 p-0">
                        <div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 text-xs font-bold rounded px-2 py-0.5 uppercase tracking-wider">
                            Rank {index + 1}
                          </Badge>
                          <CardTitle className="font-extrabold text-secondary mt-3 text-sm leading-snug">{rec.name}</CardTitle>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-0.5 justify-end">
                            <span className="text-xl font-extrabold text-primary">{rec.score}</span>
                            <Tooltip>
                              <TooltipTrigger className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:bg-muted rounded transition-colors" aria-label="Score Explanation Tooltip">
                                <HelpCircle className="h-3.5 w-3.5" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-card border border-border text-foreground text-xs p-2.5 max-w-xs shadow-md">
                                Suitability Score based on age, gender, occupation, income brackets, and household composition rules.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Fit Score</span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-4 p-0">
                        <div className="space-y-2 pt-2 border-t border-border">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Match Factors</span>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.drivers?.map((drv, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs font-bold rounded"
                              >
                                {drv}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {rec.explanation && (
                          <div className="text-xs text-muted-foreground italic mt-3 bg-muted/30 p-3 rounded-lg border border-border leading-normal">
                            💡 {rec.explanation}
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <CardFooter className="pt-4 mt-6 border-t border-border p-0">
                      <Button
                        onClick={() => handleAskAI(rec.name)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-1.5 border-border text-foreground hover:bg-muted rounded-lg h-9 font-bold text-xs"
                      >
                        <Sparkles size={12} className="text-primary animate-pulse" />
                        <span>Explain Recommendation</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground font-bold border border-dashed border-border rounded-xl">
                  No recommended schemes computed. Run eligibility check.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Comparison Dialog */}
        {user && (
          <Dialog open={showPopup} onOpenChange={setShowPopup}>
            <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-border bg-card p-6 rounded-xl">
              <DialogHeader className="border-b border-border pb-3 mb-4">
                <DialogTitle className="text-lg font-bold text-foreground">Recommended Schemes Comparison</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Socio-economic matching factors and benefit rules computed for <strong>{user.Name || user.name}</strong>:
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-3 pt-2">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-border bg-muted/20 p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded px-1.5 py-0.5 uppercase tracking-wider mb-2">
                        Rank {index + 1}
                      </Badge>
                      <h5 className="text-sm font-extrabold text-secondary">
                        {rec.name}
                      </h5>
                      <div className="space-y-1 mt-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Fit Rationale</span>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          {rec.explanation || "Suitable for the beneficiary's age profile and demographic factors."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  onClick={() => setShowPopup(false)}
                  className="w-full md:w-auto px-6 h-9 font-bold text-xs rounded-lg"
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
