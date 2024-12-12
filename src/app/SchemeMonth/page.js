"use client";
import React, { useState, useEffect } from "react";
import {
  Layers,
  CalendarCheck,
  Users,
  Zap,
  Award,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from 'next/navigation'

const schemeTime = [
  {
    month: "February",
    factor: "Tax Season",
    Schemes: [
      "Time Deposit",
      "Public Provident Fund (PPF)",
      "National Savings Certificate (NSC)",
      "Senior Citizen Savings Scheme (SCSS)",
      "Fixed Deposit (FD)",
    ],
  },
  {
    month: "March",
    factor: "Tax Season",
    Schemes: [
      "Time Deposit",
      "Public Provident Fund (PPF)",
      "National Savings Certificate (NSC)",
      "Senior Citizen Savings Scheme (SCSS)",
      "Fixed Deposit (FD)",
    ],
  },
  {
    month: "July",
    factor: "Farming Cycle(Pre Harvest)",
    Schemes: [
      "Rural Postal Life Insurance (RPLI)",
      "National Savings Certificate (NSC)",
      "Kisan Vikas Patra (KVP)",
      "Fixed Deposit (FD)",
      "Kisan Credit Card (KCC)",
    ],
  },
  {
    month: "August",
    factor: "Farming Cycle(Pre Harvest)",
    Schemes: [
      "Rural Postal Life Insurance (RPLI)",
      "National Savings Certificate (NSC)",
      "Kisan Vikas Patra (KVP)",
      "Fixed Deposit (FD)",
      "Kisan Credit Card (KCC)",
    ],
  },
  {
    month: "April",
    factor: "Farming cycle(Post Harvest) and (Start of Financial Year)",
    Schemes: [
      "Kisan Credit Card (KCC)",
      "Kisan Vikas Patra (KVP)",
      "Post Office Savings Account (POSA)",
      "Monthly Income Account (MIS)",
      "Recurring Deposit Scheme (RD)",
    ],
  },
  {
    month: "May",
    factor: "Farming cycle(Post Harvest) and (Start of Financial Year)",
    Schemes: [
      "Kisan Credit Card (KCC)",
      "Kisan Vikas Patra (KVP)",
      "Post Office Savings Account (POSA)",
      "Monthly Income Account (MIS)",
      "Recurring Deposit Scheme (RD)",
    ],
  },
  {
    month: "June",
    factor: "Farming cycle(Post Harvest) and (Start of Financial Year)",
    Schemes: [
      "Kisan Credit Card (KCC)",
      "Kisan Vikas Patra (KVP)",
      "Post Office Savings Account (POSA)",
      "Monthly Income Account (MIS)",
      "Recurring Deposit Scheme (RD)",
    ],
  },
  {
    month: "September",
    factor: "Festive  Season",
    Schemes: [
      "Recurring Deposit Scheme (RD)",
      "Public Provident Fund (PPF)",
      "Sukanya Samriddhi Account (SSA)",
      "Atal Pension Yojana",
      "Fixed Deposit (FD)",
    ],
  },
  {
    month: "October",
    factor: "Festive  Season",
    Schemes: [
      "Recurring Deposit Scheme (RD)",
      "Kisan Vikas Patra (KVP)",
      "Sukanya Samriddhi Account (SSA)",
      "Senior Citizen Savings Scheme (SCSS)",
      "Fixed Deposit (FD)",
    ],
  },
  {
    month: "December",
    factor: "Festive  Season and year end",
    Schemes: [
      "Recurring Deposit Scheme (RD)",
      "Public Provident Fund (PPF)",
      "Atal Pension Yojana",
      "Mahila Samman Savings Certificate",
      "Fixed Deposit (FD)",
    ],
  },
  {
    month: "November",
    factor: "Post Harvest and Festive Seasons",
    Schemes: [
      "Post Office Savings Account (POSA)",
      "Recurring Deposit Scheme (RD)",
      "Public Provident Fund (PPF)",
      "National Savings Certificate (NSC)",
      "Kisan Vikas Patra (KVP)",
      "Fixed Deposit (FD)",
      "Kisan Credit Card",
    ],
  },

  {
    month: "January",
    factor: "Post Harvest and Festive Seasons",
    Schemes: [
      "Post Office Savings Account (POSA)",
      "Recurring Deposit Scheme (RD)",
      "Time Deposit",
      "Public Provident Fund (PPF)",
      "National Savings Certificate (NSC)",
      "Kisan Vikas Patra (KVP)",
      "Fixed Deposit (FD)",
      "Kisan Credit Card (KCC)",
    ],
  },
];

// Extend schemeDetails to include age criteria
const schemeDetails = {
  "Time Deposit": {
    targetAudience: "Salaried individuals, pensioners",
    purpose: "Offer fixed-income returns for short to long-term investments",
    ageCriteria: "18+",
  },
  "Public Provident Fund (PPF)": {
    targetAudience: "Salaried/self-employed individuals, taxpayers",
    purpose: "Promote long-term savings with tax benefits.",
    ageCriteria: "18+",
  },
  "National Savings Certificate (NSC)": {
    targetAudience: "Small-scale investors, taxpayers",
    purpose: "Provide guaranteed returns with tax-saving benefits",
    ageCriteria: "18+",
  },
  "Senior Citizen Savings Scheme (SCSS)": {
    targetAudience: "Senior citizens aged 60+",
    purpose: "Provide regular income and secure investments post-retirement",
    ageCriteria: "60+",
  },
  "Fixed Deposit (FD)": {
    targetAudience: "Salaried individuals, investors",
    purpose: "Secure investment with fixed returns",
    ageCriteria: "18+",
  },
  "Rural Postal Life Insurance (RPLI)": {
    targetAudience: "Rural populations, farmers, small businesses",
    purpose: "Extend affordable life insurance to rural areas",
    ageCriteria: "18-60",
  },
  "Kisan Vikas Patra (KVP)": {
    targetAudience: "Rural/semi-urban populations, farmers",
    purpose: "Offer secure investment doubling deposits in a fixed period",
    ageCriteria: "18+",
  },
  "Kisan Credit Card (KCC)": {
    targetAudience: "Farmers, agricultural workers",
    purpose:
      "Provide short-term loans for agriculture, animal husbandry, and allied activities",
    ageCriteria: "18+",
  },
  "Post Office Savings Account (POSA)": {
    targetAudience: "General public, rural/semi-urban areas",
    purpose: "Encourage savings with easy access to banking",
    ageCriteria: "10+",
  },
  "Monthly Income Account (MIS)": {
    targetAudience: "Individuals seeking regular income",
    purpose: "Provide monthly income through savings",
    ageCriteria: "18+",
  },
  "Recurring Deposit Scheme (RD)": {
    targetAudience: "Middle/lower-income groups",
    purpose: "Help save small amounts monthly and get a lump sum at maturity",
    ageCriteria: "18+",
  },
  "Sukanya Samriddhi Account (SSA)": {
    targetAudience: "Parents of girl children",
    purpose: "Secure girl children's future (education and marriage expenses)",
    ageCriteria: "Up to 10 years (child's age)",
  },
  "Atal Pension Yojana": {
    targetAudience: "Workers in unorganized sectors",
    purpose: "Ensure pension and social security after retirement",
    ageCriteria: "18-40",
  },
  "Mahila Samman Savings Certificate": {
    targetAudience: "Women in rural areas",
    purpose: "Empower women through savings and financial independence",
    ageCriteria: "18+",
  },
};

export default function SchemesTimeline() {
    const router = useRouter();
  
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [schemes, setSchemes] = useState([]);
  const [factors, setFactors] = useState([]);
  const [animate, setAnimate] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    handleMonthSelect("Jan");
  }, []);

  const handleMonthSelect = (month) => {
    const fullMonthMap = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };

    const fullMonth = fullMonthMap[month];
    setSelectedMonth(month);
    setAnimate(false);

    const combinedSchemes = new Set();
    const combinedFactors = new Set();

    schemeTime.forEach((item) => {
      if (item.month === fullMonth) {
        item.Schemes.forEach((scheme) => combinedSchemes.add(scheme));
        combinedFactors.add(item.factor);
      }
    });

    setSchemes(Array.from(combinedSchemes));
    setFactors(Array.from(combinedFactors).join(", "));

    // Trigger animation
    setTimeout(() => setAnimate(true), 50);
  };

  // Color generator for scheme icons
  const getRandomColor = () => {
    const colors = [
      "bg-emerald-500",
      "bg-cyan-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-rose-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="w-full bg-white shadow-sm sticky top-0 z-50">

        <div className="w-full px-4 py-4 flex items-center justify-between">

          <div className="flex text-black items-center space-x-3">
        <ChevronLeft onClick={() => router.back()} className="cursor-pointer" />
            <Layers className="text-indigo-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">
              Scheme Navigator
            </h1>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="w-full  px-5 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(month)}
                className={`
                  px-4 py-2 rounded-full transition-all duration-300
                  flex items-center gap-2 text-base font-medium text-[18px]
                  ${
                    selectedMonth === month
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                  }
                `}
              >
                <CalendarCheck size={18} />
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Details */}
      <div className="w-full  px-3 mt-8 flex-grow overflow-auto">
        {selectedMonth && (
          <div
            className={`
              bg-white rounded-2xl shadow-lg p-6 w-full transition-all duration-700
              ${
                animate
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            <div className="w-full">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Award className="text-indigo-600" size={32} />
                    Schemes for {selectedMonth}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <Users size={20} className="mr-2 text-indigo-500" />
                    <span className="font-medium">{factors}</span>
                  </div>
                </div>

                {/* Enhanced Scheme List */}
                <div className="grid gap-4">
                  {schemes.map((scheme, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-2xl p-4 flex items-center hover:bg-gray-100 transition-colors group"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${getRandomColor()} 
                        flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}
                      >
                        <Zap className="text-white" size={24} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800 text-[18px]">
                          {scheme}
                        </p>
                        <div className="grid md:grid-cols-3 gap-2 mt-2 justify-between">
                        <div>
                            <p className="text-base text-gray-600 flex items-center">
                              <Users
                                size={14}
                                className="mr-2 text-indigo-500"
                              />
                              {schemeDetails[scheme]?.targetAudience ||
                                "Not available"}
                            </p>
                          </div>
                          <div>
                            <p className="text-base text-gray-600 flex items-center">
                              <ChevronRight
                                size={14}
                                className="mr-2 text-indigo-500"
                              />
                              {schemeDetails[scheme]?.purpose ||
                                "Not available"}
                            </p>
                          </div>
                          <div>
                            <p className="text-base text-gray-600 flex items-center">
                              <Award
                                size={14}
                                className="mr-2 text-indigo-500"
                              />
                              Age Criteria:{" "}
                              {schemeDetails[scheme]?.ageCriteria ||
                                "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
