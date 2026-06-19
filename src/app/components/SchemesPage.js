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

export default function SchemesPage() {
  const [responseData, setResponseData] = useState(" ");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [type, setType] = useState("Urban");
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  const data = { village: "bhavani" };

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await axios.post("/api/schemeTime", data);
        console.log("Response from server:", response.data);
        setResponseData(response.data);
      } catch (error) {
        console.warn("Error sending data:", error);
      }
    };

    sendData();
  }, []);

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
      name: "Post Office Savings Account",
      targetAudience: "General public, rural/semi-urban areas",
      purpose: "Encourage savings with easy access to banking",
      successRate: 65,
      urbanAvailability: ["January to March", "September to December"],
      ruralAvailability: responseData?.result?.harvesting
        ? ["April to June", ...responseData.result.harvesting]
        : ["April to June"],
    },
    {
      id: 2,
      name: "Recurring Deposit (RD)",
      targetAudience: "Middle/lower-income groups",
      purpose:
        "Help save small amounts monthly and get a lump sum at maturity.",
      successRate: 72,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["April to June", ...responseData.result.harvesting]
        : ["April to June"],
    },
    {
      id: 3,
      name: "Time Deposit (TD)",
      targetAudience: "Salaried individuals, pensioners",
      purpose: "Offer fixed-income returns for short to long-term investments",
      successRate: 58,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["April to June", ...responseData.result.harvesting]
        : ["April to June"],
    },
    {
      id: 4,
      name: "Public Provident Fund (PPF)",
      targetAudience: "Salaried/self-employed individuals, taxpayers",
      purpose: "Promote long-term savings with tax benefits.",
      successRate: 79,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["April to June", ...responseData.result.harvesting]
        : ["April to June"],
    },
    {
      id: 5,
      name: "National Savings Certificate (NSC)",
      targetAudience: "Small-scale investors, taxpayers",
      purpose: "Provide guaranteed returns with tax-saving benefits",
      successRate: 60,
      urbanAvailability: [
        "January to March",
        "April to June",
        "July to August",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? [...responseData.result.harvesting]
        : ["None"],
    },
    {
      id: 6,
      name: "Kisan Vikas Patra (KVP)",
      targetAudience: "Rural/semi-urban populations, farmers",
      purpose: "Offer secure investment doubling deposits in a fixed period",
      successRate: 68,
      urbanAvailability: [
        "January to March",
        "April to June",
        "July to August",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["September to December", ...responseData.result.harvesting]
        : ["September to December"],
    },
    {
      id: 7,
      name: "Sukanya Samriddhi Yojana (SSY)",
      targetAudience: "Parents of girl children",
      purpose:
        "Secure girl children's future (education and marriage expenses)",
      successRate: 77,
      urbanAvailability: ["January to March", "April to June"],
      ruralAvailability: responseData?.result?.harvesting
        ? ["October to December", ...responseData.result.harvesting]
        : ["October to December"],
    },
    {
      id: 8,
      name: "Senior Citizen Savings Scheme (SCSS)",
      targetAudience: "Senior citizens aged 60+",
      purpose: "Provide regular income and secure investments post-retirement",
      successRate: 73,
      urbanAvailability: [
        "January to March",
        "April to June",
        "July to August",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["October to February", ...responseData.result.harvesting]
        : ["October to February"],
    },
    {
      id: 9,
      name: "Atal Pension Yojana (APY)",
      targetAudience: "Workers in unorganized sectors",
      purpose: "Ensure pension and social security after retirement",
      successRate: 70,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? [
            "October to December",
            "April to June",
            ...responseData.result.harvesting,
          ]
        : ["October to December", "April to June"],
    },
    {
      id: 10,
      name: "Postal Life Insurance (PLI)",
      targetAudience: "Government employees, salaried individuals",
      purpose: "Provide low-cost life insurance with high returns",
      successRate: 64,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to November",
      ],
      ruralAvailability: ["None"],
    },
    {
      id: 11,
      name: "Rural Postal Life Insurance (RPLI)",
      targetAudience: "Rural populations, farmers, small businesses",
      purpose: "Extend affordable life insurance to rural areas",
      successRate: 62,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to December",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["September", "April to June", ...responseData.result.harvesting]
        : ["September", "April to June"],
    },
    {
      id: 12,
      name: "Mahila Samman Savings Certificate",
      targetAudience: "Women in rural areas",
      purpose: "Empower women through savings and financial independence",
      successRate: 78,
      urbanAvailability: [
        "January to March",
        "April to June",
        "September to October",
      ],
      ruralAvailability: responseData?.result?.harvesting
        ? ["October to December", ...responseData.result.harvesting]
        : ["October to December"],
    },
    {
      id: 13,
      name: "Kisan Credit Card (KCC)",
      targetAudience: "Farmers, agricultural workers",
      purpose:
        "Provide short-term loans for agriculture, animal husbandry, and allied activities",
      successRate: 63,
      urbanAvailability: responseData?.result?.sowing
        ? [...responseData.result.sowing]
        : ["none"],
      ruralAvailability: responseData?.result?.sowing
        ? [...responseData.result.sowing]
        : ["none"],
    },
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
