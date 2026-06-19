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
      <div className="min-h-screen bg-[#F8F9FB]">
        <div className="page-container space-y-5">
          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-slate-500 hover:text-[#C8102E]">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-[#1A2B4A]">Schemes Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back link */}
          <div className="flex justify-between items-center border-b pb-4 border-slate-100">
            <Link href="/" className="flex items-center space-x-2 text-[#C8102E] hover:underline font-bold transition">
              <ArrowLeft size={16} />
              <span className="text-xs">Back to Regional Intelligence</span>
            </Link>
            <span className="text-[10px] font-bold text-[#C8102E] uppercase tracking-wider bg-red-50 border border-red-100 px-3 py-1 rounded-full">
              Harvest Calendar
            </span>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Target className="text-[#C8102E]" /> Schemes Harvest & Sowing Heuristics
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
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
            <Card className="lg:col-span-7 bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
              <CardHeader className="flex justify-between items-center flex-row bg-slate-50 border-b border-slate-100 p-4">
                <div>
                  <CardTitle className="text-lg font-bold text-[#1A2B4A]">Available Schemes</CardTitle>
                </div>
                <button
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className="flex items-center text-slate-600 hover:text-slate-800 text-xs font-semibold"
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
                      <table className="w-full text-xs text-left text-slate-600">
                        <thead className="sticky top-0 bg-slate-100 text-[#1A2B4A] z-10 border-b border-slate-200">
                          <tr>
                            <th className="p-4 w-12 text-center">Select</th>
                            <th className="px-4 py-3 font-bold">Scheme</th>
                            <th className="px-4 py-3 font-bold">Target Audience</th>
                            <th className="px-4 py-3 font-bold">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {schemes.map((scheme) => (
                            <tr
                              key={scheme.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                selectedScheme === scheme.id 
                                  ? 'bg-slate-50/80' 
                                  : 'bg-white'
                              }`}
                            >
                              <td className="p-4 text-center">
                                <input
                                  type="radio"
                                  checked={selectedScheme === scheme.id}
                                  onChange={() => handleSchemeSelect(scheme.id)}
                                  className="text-[#C8102E] focus:ring-[#C8102E] h-4 w-4 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 font-bold text-[#1A2B4A]">
                                {scheme.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-medium">{scheme.targetAudience}</td>
                              <td className="px-4 py-3 text-slate-500 font-medium">{scheme.purpose}</td>
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
