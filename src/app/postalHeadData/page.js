"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  Building2,
  MapPin,
  FileText,
  RefreshCw,
  Map,
  Users,
  Award,
  BarChart2,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Header from "../components/postalHeadData/header";
import useheaddata from "@/store/headpostdata";
import axios from "axios";
import { toast } from "sonner";
import useDashboardStore from "@/store/dashboardStore";
const PostOfficeDashboard = () => {
  const{headData}=useDashboardStore();
  console.log(headData)
  const { Sta, Dis, sub, sch, loa, setsch, fetchHeadData } = useheaddata();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [probabilities, setProbabilities] = useState({});

  const data = sch;

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to generate initial probabilities (below 30%)
  const generateInitialProbabilities = () => {
    if (!data?.resultLengths) return {};

    const initialProbs = {};
    Object.keys(data.resultLengths).forEach(branch => {
      // Generate a random probability between 5% and 25%
      initialProbs[branch] = Number((Math.random() * 20 + 5).toFixed(2));
    });

    return initialProbs;
  };

  // Function to generate post-mela probabilities (10-30%)
  const generatePostMelaProbabilities = () => {
    if (!data?.resultLengths) return {};

    const postMelaProbs = {};
    Object.keys(data.resultLengths).forEach(branch => {
      // Generate a random probability between 20% and 50%
      postMelaProbs[branch] = Number((Math.random() * 10 + 60).toFixed(2));
    });

    return postMelaProbs;
  };

  // Handle the randomize/After Mela update
  const handleRandomizeUpdate = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post("/api/headPostData/randomizeUpdate");
  
      fetchHeadData();
    } catch (error) {
      console.error("Error randomizing data:", error);
      toast.error("Failed to randomize data");
    } finally {
      setIsLoading(false);
    }
  };

  const click=()=>{
    const newProbabilities = generatePostMelaProbabilities();
      setProbabilities(newProbabilities);
  }

  // Handle probability increment
  // const handleProbabilityIncrement = (branch) => {
  //   setProbabilities(prev => {
  //     const currentProb = prev[branch] || 0;
  //     const newProb = Math.min(currentProb + 35, 100); // Cap at 100%
      
  //     return {
  //       ...prev,
  //       [branch]: Number(newProb.toFixed(2))
  //     };
  //   });
  // };

  // Initialize probabilities on component mount
  useEffect(() => {
    if (data?.resultLengths) {
      const initialProbs = generateInitialProbabilities();
      setProbabilities(initialProbs);
    }
  }, [data]);

  const totalSchemesRegistered =
    sch && data?.schemeCount
      ? Object.values(data.schemeCount).reduce(
          (sum, count) => sum + Number(count),
          0
        )
      : 0;

  const totalEligiblePersons =
    sch && data?.resultLengths
      ? Object.values(data.resultLengths).reduce(
          (sum, count) => sum + Number(count),
          0
        )
      : 0;

  const totalUnregistered = totalEligiblePersons - totalSchemesRegistered;

  // Prepare data for donut chart
  const donutChartData = sch && data?.resultLengths 
    ? Object.entries(data.resultLengths).map(([branch, count]) => ({
        name: branch,
        value: Number(count),
        registeredCount: data.schemeCount[branch] || 0,
        probability: probabilities[branch] || 0
      }))
    : [];

  return (
    <div>
      <Header />
      <div className="min-h-screen overflow-hidden bg-neutral-100 py-8">
        <div className="mx-auto px-4">
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm mb-6">
            <div className="bg-[#ef4444] text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center">
                <Building2 className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Head Office Details</h2>
              </div>

              <button
                onClick={click}
                disabled={isLoading}
                className="flex items-center bg-[#952929] text-white px-4 py-2 rounded-lg hover:bg-[#ff0000] transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <RefreshCw className="mr-2 animate-spin" size={16} />
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <RefreshCw className="mr-2" size={16} />
                    After Mela
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  className="flex items-center bg-white justify-center w-full text-black text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                  onChange={(e) => setsch(e.target.value)}
                >
                  <option value="">Select Scheme</option>
                  <option value="Sukanya Samriddhi Yojana (SSA)">
                    Sukanya Samriddhi Yojana (SSA)
                  </option>
                </select>
              </div>
            </div>

            {/* Post Office Details Section */}
            <div className="p-3 grid md:grid-cols-2 gap-4">
              <h3 className="font-semibold text-neutral-800 flex items-center">
                <MapPin className="mr-2" size={30} />
                Post Office Details
              </h3>
              <div className="bg-white text-md text-black grid md:grid-cols-3 border w-full col-span-2 rounded-md border-neutral-200  shadow-sm ">
                <li className=" p-5 flex items-center justify-center">
                  <Package className="mr-2 text-blue-500" size={30} />
                  Post Office: {sub?.name || "Sub Post Office"}
                </li>
                <li className="border p-5 flex items-center justify-center">
                  <FileText className="mr-2 text-green-500" size={30} />
                  Pin Code: {sub?.pincode || "Sub Post Pincode"}
                </li>
                <li className=" p-5 flex items-center justify-center">
                  <Map className="mr-2 text-yellow-500" size={30} />
                  District: {Dis || "District"}
                </li>
                <li className="border p-5 flex items-center justify-center">
                  <MapPin className="mr-2 text-red-500" size={30} />
                  State: {Sta?.name || "State"}
                </li>
                <li className=" p-5 flex items-center justify-center">
                  <RefreshCw className="mr-2 text-purple-500" size={30} />
                  Type: {sub ? "Sub PostOffice Branch" : "Branch Type"}
                </li>
                
              </div>
            </div>
          </div>

          {/* Branch Offices Section with Donut Chart */}
          <div className="grid md:grid-cols-3 gap-6">
            {donutChartData.length > 0 ? (
              donutChartData.map((branchData, index) => {
                const registrationProbability = branchData.probability;
                const pendingRegistrations = branchData.value - branchData.registeredCount;

                return (
                  <div
                    key={`branch-${index}`}
                    className="bg-white border  flex flex-col items-center border-neutral-200 rounded-lg shadow-sm p-4"
                  >
                    <h3 className="font-semibold text-neutral-800 flex items-center mb-4">
                      <MapPin className="mr-2 text-blue-500" size={24} />
                      Branch PostOffice {index + 1}: {branchData.name}
                    </h3>

                    {/* Donut Chart with Click Handler */}
                    <div 
                      className="cursor-pointer" 
                    >
                      <PieChart width={200} height={200}>
                        <Pie
                          data={[
                            { 
                              name: 'Registered', 
                              value: branchData.registeredCount 
                            },
                            { 
                              name: 'Pending', 
                              value: pendingRegistrations 
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Registered', value: branchData.registeredCount },
                            { name: 'Pending', value: pendingRegistrations }
                          ].map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? '#00C49F' : '#FF8042'} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="w-full grid grid-cols-2 gap-2 mt-4 text-sm">
                      <p className="text-neutral-600 flex items-center">
                        <Users className="mr-2 text-green-500" size={20} />
                        Total Persons: {branchData.value}
                      </p>
                      <p className="text-neutral-600 flex items-center">
                        <Award className="mr-2 text-blue-500" size={20} />
                        Registered: {branchData.registeredCount}
                      </p>
                      <p className="text-neutral-600 flex items-center">
                        <Award className="mr-2 text-red-500" size={20} />
                        Pending: {pendingRegistrations}
                      </p>
                      <p className="text-neutral-600 flex items-center">
                        <Award className="mr-2 text-purple-500" size={20} />
                        Probability: {registrationProbability}%
                      </p>
                      <p className="text-neutral-600 flex items-center">
                        <BarChart2 className="mr-2 text-orange-500" size={20} />
                        Failure Probaility: {(100 - Number(registrationProbability)).toFixed(2)}%
                      </p>
                      <p className="text-neutral-600 flex items-center">
                        <Award className="mr-2 text-cyan-500" size={20} />
                        Total: {branchData.registeredCount + pendingRegistrations}
                      </p>
                      <p className="text-neutral-600 flex items-center">
                  <BarChart2 className="mr-2 text-cyan-500" size={30} />
                  Reason: {headData?.negativeFeedback|| "Reason"}
                  </p>
                  </div>
                  </div>
                );
              })
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOfficeDashboard;