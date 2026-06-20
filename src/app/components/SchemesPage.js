"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, Target, ArrowLeft, Sparkles } from "lucide-react";
import axios from "axios";
import SuccessRateChart from "./Charts/SuccessRateChart";
import Location from "./shemeTime/location";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ErrorBoundary from "@/components/ErrorBoundary";

import useDashboardStore from "@/store/dashboardStore";

export default function SchemesPage() {
  const { village } = useDashboardStore();
  const [responseData, setResponseData] = useState(" ");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [type, setType] = useState("Urban");
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  const activeVillage = village || "bhavani";

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await axios.post("/api/schemeTime", { village: activeVillage });
        console.log("Response from server:", response.data);
        setResponseData(response.data);
      } catch (error) {
        console.warn("Error sending data:", error);
      }
    };

    sendData();
  }, [activeVillage]);

  const [selectedSchemeName, setSelectedSchemeName] = useState({
    id: 1,
    name: "Post Office Savings Account",
    targetAudience: "General public, rural/semi-urban areas",
    purpose: "Encourage savings with easy access to banking",
    successRate: 65,
    urbanAvailability: ["January to March", "September to December"],
    ruralAvailability: ["jan"],
  });

  // Schemes data
  const schemes = [
    {
      id: 1,
      name: "Post Office Savings Account (SB)",
      targetAudience: "General public, rural/semi-urban areas",
      purpose: "Encourage basic savings with easy liquidity and banking access.",
      successRate: 65,
      urbanAvailability: ["January to March", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["April to June", ...responseData.result.harvesting] : ["April to June"],
    },
    {
      id: 2,
      name: "National Savings Recurring Deposit (RD)",
      targetAudience: "Middle/lower-income groups, daily/monthly wage earners",
      purpose: "Help save small amounts monthly and receive a lump sum at maturity.",
      successRate: 72,
      urbanAvailability: ["January to March", "April to June", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["April to June", ...responseData.result.harvesting] : ["April to June"],
    },
    {
      id: 3,
      name: "National Savings Time Deposit (TD)",
      targetAudience: "Salaried individuals, pensioners, risk-averse investors",
      purpose: "Offer fixed-income returns with multiple tenure options (1 to 5 years).",
      successRate: 58,
      urbanAvailability: ["January to March", "April to June", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["April to June", ...responseData.result.harvesting] : ["April to June"],
    },
    {
      id: 4,
      name: "Monthly Income Scheme (MIS)",
      targetAudience: "Retirees, senior citizens seeking regular monthly cash flows",
      purpose: "Offer guaranteed monthly interest payouts on capital deposits.",
      successRate: 70,
      urbanAvailability: ["January to March", "April to June", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["October to December", ...responseData.result.harvesting] : ["October to December"],
    },
    {
      id: 5,
      name: "Public Provident Fund (PPF)",
      targetAudience: "Salaried/self-employed individuals, taxpayers seeking long-term corpus",
      purpose: "Promote long-term compounding wealth creation with EEE tax benefits.",
      successRate: 79,
      urbanAvailability: ["January to March", "April to June", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["April to June", ...responseData.result.harvesting] : ["April to June"],
    },
    {
      id: 6,
      name: "Senior Citizens Savings Scheme (SCSS)",
      targetAudience: "Retirees and senior citizens aged 60+",
      purpose: "Secure post-retirement funds with high interest yield and regular payouts.",
      successRate: 82,
      urbanAvailability: ["January to March", "April to June", "July to August", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["October to February", ...responseData.result.harvesting] : ["October to February"],
    },
    {
      id: 7,
      name: "Sukanya Samriddhi Account (SSA)",
      targetAudience: "Parents/guardians of girl children under 10 years of age",
      purpose: "Secure funds for the education and marriage expenses of girl children.",
      successRate: 85,
      urbanAvailability: ["January to March", "April to June"],
      ruralAvailability: responseData?.result?.harvesting ? ["October to December", ...responseData.result.harvesting] : ["October to December"],
    },
    {
      id: 8,
      name: "National Savings Certificate (NSC)",
      targetAudience: "Small-scale investors, middle-class taxpayers",
      purpose: "Provide secure, guaranteed returns over a fixed 5-year tenure with Section 80C deductions.",
      successRate: 60,
      urbanAvailability: ["January to March", "April to June", "July to August", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? [...responseData.result.harvesting] : ["None"],
    },
    {
      id: 9,
      name: "Kisan Vikas Patra (KVP)",
      targetAudience: "Farmers, rural populations, long-term investors",
      purpose: "Double the principal deposit over a fixed tenure with sovereign security.",
      successRate: 68,
      urbanAvailability: ["January to March", "April to June", "July to August", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["September to December", ...responseData.result.harvesting] : ["September to December"],
    },
    {
      id: 10,
      name: "Mahila Samman Savings Certificate (MSSC)",
      targetAudience: "Women of all ages, parents of minor girls",
      purpose: "Encourage financial savings and independence for women with fixed high-yield 2-year terms.",
      successRate: 78,
      urbanAvailability: ["January to March", "April to June", "September to October"],
      ruralAvailability: responseData?.result?.harvesting ? ["October to December", ...responseData.result.harvesting] : ["October to December"],
    },
    {
      id: 11,
      name: "PM CARES for Children Scheme",
      targetAudience: "Minors orphaned during the COVID-19 pandemic",
      purpose: "Provide comprehensive rehabilitation, educational support, and financial corpus.",
      successRate: 90,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 12,
      name: "Regular Savings Account (IPPB)",
      targetAudience: "Tech-savvy individuals, rural citizens needing digital banking",
      purpose: "Provide digital-first doorstep banking, transaction facility, and utility links.",
      successRate: 64,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 13,
      name: "Basic Savings Account (IPPB)",
      targetAudience: "Low-income segments, DBT subsidy beneficiaries",
      purpose: "Offer zero-minimum balance accounts for secure payment receipt and DBT sweeps.",
      successRate: 62,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 14,
      name: "DigiSmart Savings Account (IPPB)",
      targetAudience: "Mobile-first young adults (18+)",
      purpose: "Quick app-based self-onboarding with cashbacks and virtual debit cards.",
      successRate: 70,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 15,
      name: "Premium Savings Account (IPPB)",
      targetAudience: "Frequent transactors seeking premium services",
      purpose: "Doorstep banking benefits, zero sweep fees, and custom cashback structures.",
      successRate: 66,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 16,
      name: "Premium Aarogya Savings Account (IPPB)",
      targetAudience: "Families and health-conscious individuals",
      purpose: "Combine regular digital transaction banking with telehealth consultations and wellness discounts.",
      successRate: 68,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 17,
      name: "SHG Savings Account (IPPB)",
      targetAudience: "Registered Self-Help Groups (SHGs) and rural micro-entrepreneurs",
      purpose: "Facilitate micro-enterprise transactions, group deposits, and credit link management.",
      successRate: 74,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 18,
      name: "Current Account (IPPB)",
      targetAudience: "Small merchants, traders, self-employed business owners",
      purpose: "Assist business owners with unlimited transactions and merchant payment solutions.",
      successRate: 63,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 19,
      name: "PMJJBY (Third-Party Insurance)",
      targetAudience: "Earning adults aged 18 to 50",
      purpose: "Provide affordable ₹2 Lakh term life insurance cover for low-income families.",
      successRate: 71,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 20,
      name: "PMSBY (Third-Party Insurance)",
      targetAudience: "Individuals aged 18 to 70",
      purpose: "High-value accidental death and disability insurance cover at a minimal premium of ₹20/year.",
      successRate: 75,
      urbanAvailability: ["Ongoing"],
      ruralAvailability: ["Ongoing"],
    },
    {
      id: 21,
      name: "Atal Pension Yojana (APY)",
      targetAudience: "Workers in unorganized sectors aged 18 to 40",
      purpose: "Ensure pension and social security after retirement.",
      successRate: 73,
      urbanAvailability: ["January to March", "April to June", "September to December"],
      ruralAvailability: responseData?.result?.harvesting ? ["October to December", "April to June", ...responseData.result.harvesting] : ["October to December", "April to June"],
    }
  ];

  // Handle radio button selection
  const handleSchemeSelect = (schemeId) => {
    setSelectedScheme(schemeId);

    // Find the scheme name based on the ID
    const schemenames = schemes.find((scheme) => scheme.id === schemeId);
    setSelectedSchemeName(schemenames);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground py-6">
        <div className="page-container max-w-[1440px] mx-auto w-full space-y-6">
          {/* Breadcrumbs */}
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-secondary">Schemes Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back link */}
          <div className="flex justify-between items-center border-b pb-4 border-border">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 font-bold transition">
              <ArrowLeft size={16} />
              <span className="text-xs">Back to Regional Intelligence</span>
            </Link>
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full px-3 py-1">
              Harvest Calendar
            </Badge>
          </div>

          <div className="border-b border-border pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Target className="text-primary h-6 w-6" /> Schemes Harvest & Sowing Heuristics
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Synchronize scheme campaigns with local agricultural harvest and sowing patterns for Erode region.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side info: SuccessRateChart & Location details */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              <SuccessRateChart scheme={selectedSchemeName} />
              <Location timingData={responseData} scheme={selectedSchemeName} areaType={type}/>
            </div>

            {/* Right side info: Available Schemes Table */}
            <Card className="lg:col-span-7 bg-card shadow-sm rounded-xl overflow-hidden border border-border">
              <CardHeader className="flex justify-between items-center flex-row bg-muted/40 border-b border-border p-4">
                <div>
                  <CardTitle className="text-lg font-bold text-secondary">Available Schemes</CardTitle>
                </div>
                <button
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className="flex items-center text-muted-foreground hover:text-foreground text-xs font-semibold"
                >
                  <ChevronDown 
                    className={`mr-1 transition-transform h-4 w-4 ${isTableExpanded ? 'rotate-180' : ''}`} 
                  />
                  {isTableExpanded ? 'Collapse' : 'Expand'}
                </button>
              </CardHeader>

              <AnimatePresence>
                {isTableExpanded && (
                  <CardContent className="p-0">
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-xs text-left text-muted-foreground">
                        <thead className="sticky top-0 bg-muted/30 text-secondary z-10 border-b border-border">
                          <tr>
                            <th className="p-4 w-12 text-center">Select</th>
                            <th className="px-4 py-3 font-bold">Scheme</th>
                            <th className="px-4 py-3 font-bold">Target Audience</th>
                            <th className="px-4 py-3 font-bold">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {schemes.map((scheme) => (
                            <tr
                              key={scheme.id}
                              className={`hover:bg-muted/30 transition-colors ${
                                selectedScheme === scheme.id 
                                  ? 'bg-muted/40' 
                                  : 'bg-card'
                              }`}
                            >
                              <td className="p-4 text-center">
                                <input
                                  type="radio"
                                  checked={selectedScheme === scheme.id}
                                  onChange={() => handleSchemeSelect(scheme.id)}
                                  className="text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 font-bold text-secondary">
                                {scheme.name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground font-medium">{scheme.targetAudience}</td>
                              <td className="px-4 py-3 text-muted-foreground font-medium">{scheme.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
