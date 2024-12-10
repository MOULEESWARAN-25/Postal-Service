"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingUp, Target } from "lucide-react";
import axios from "axios";
import SuccessRateChart from "../components/Charts/SuccessRateChart";
import Location from "../components/shemeTime/location";

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
        console.error("Error sending data:", error);
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

  // Schemes data remains the same as in the original component
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" bg-gradient-to-br p-3 flex gap-3 from-blue-50 to-indigo-100 w-screen h-screen"
    >
          
             <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex w-[40%] flex-col gap-3 rounded-xl  overflow-hidden"
          >
              <SuccessRateChart scheme={selectedSchemeName} />  
              <Location timingData={responseData} scheme={selectedSchemeName} areaType={type}/>
              </motion.div> 
           
           

          {/* Right Side - Schemes Table */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-[60%] bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-indigo-50 border-b">
              <h3 className="text-2xl font-bold text-indigo-800">Available Schemes</h3>
              <motion.button
                onClick={() => setIsTableExpanded(!isTableExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ChevronDown 
                  className={`mr-2 transition-transform ${isTableExpanded ? 'rotate-180' : ''}`} 
                />
                {isTableExpanded ? 'Collapse' : 'Expand'}
              </motion.button>
            </div>

            <AnimatePresence>
              {isTableExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto max-h-[500px]"
                >
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="sticky top-0 bg-indigo-100 text-indigo-800 z-10">
                      <tr>
                        <th className="p-4 w-16">Select</th>
                        <th className="px-6 py-3">Scheme</th>
                        <th className="px-6 py-3">Target Audience</th>
                        <th className="px-6 py-3">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map((scheme) => (
                        <motion.tr
                          key={scheme.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`border-b hover:bg-indigo-50 transition-colors ${
                            selectedScheme === scheme.id 
                              ? 'bg-indigo-100' 
                              : 'bg-white'
                          }`}
                        >
                          <td className="p-4">
                            <input
                              type="radio"
                              checked={selectedScheme === scheme.id}
                              onChange={() => handleSchemeSelect(scheme.id)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {scheme.name}
                          </td>
                          <td className="px-6 py-4">{scheme.targetAudience}</td>
                          <td className="px-6 py-4">{scheme.purpose}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
    </motion.div>
  );
}