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
import { Button } from "@/components/ui/button";
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
      console.warn("Error randomizing data:", error);
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
      <div className="min-h-screen bg-background text-foreground py-6">
        <div className="page-container max-w-[1440px] mx-auto w-full space-y-6">
          <div className="border border-border bg-card shadow-sm rounded-xl overflow-hidden mb-6">
            <div className="bg-secondary text-secondary-foreground p-5 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="text-primary h-6 w-6" />
                <h2 className="text-xl font-extrabold tracking-tight">Head Office Details</h2>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={click}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-lg font-bold"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-1 h-3.5 w-3.5" />
                      <span>After Mela</span>
                    </>
                  )}
                </Button>

                <div className="relative">
                  <select
                    className="flex items-center bg-card border border-border text-foreground text-xs px-3 py-2 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-[220px] font-semibold"
                    onChange={(e) => setsch(e.target.value)}
                  >
                    <option value="" className="text-xs">Select Scheme</option>
                    <option value="Sukanya Samriddhi Yojana (SSA)" className="text-xs">
                      Sukanya Samriddhi Yojana (SSA)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Post Office Details Section */}
            <div className="p-5 space-y-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <MapPin className="text-primary h-5 w-5" />
                Post Office Details
              </h3>
              <div className="bg-muted/10 text-xs text-foreground grid grid-cols-1 sm:grid-cols-3 border border-border w-full rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 flex items-center justify-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
                  <Package className="text-muted-foreground h-5 w-5 shrink-0" />
                  <span><strong>Post Office:</strong> {sub?.name || "Sub Post Office"}</span>
                </div>
                <div className="p-5 flex items-center justify-center gap-3 border-b sm:border-b-0 sm:border-r border-border">
                  <FileText className="text-muted-foreground h-5 w-5 shrink-0" />
                  <span><strong>Pin Code:</strong> {sub?.pincode || "Sub Post Pincode"}</span>
                </div>
                <div className="p-5 flex items-center justify-center gap-3 border-b sm:border-b-0 border-border">
                  <Map className="text-muted-foreground h-5 w-5 shrink-0" />
                  <span><strong>District:</strong> {Dis || "District"}</span>
                </div>
                <div className="p-5 flex items-center justify-center gap-3 border-t border-b sm:border-b-0 sm:border-r border-border col-span-1 sm:col-span-2 bg-muted/5">
                  <MapPin className="text-primary h-5 w-5 shrink-0" />
                  <span><strong>State:</strong> {Sta?.name || "State"}</span>
                </div>
                <div className="p-5 flex items-center justify-center gap-3 border-t border-border bg-muted/5">
                  <RefreshCw className="text-muted-foreground h-5 w-5 shrink-0" />
                  <span><strong>Type:</strong> {sub ? "Sub PostOffice Branch" : "Branch Type"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Offices Section with Donut Chart */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {donutChartData.length > 0 ? (
              donutChartData.map((branchData, index) => {
                const registrationProbability = branchData.probability;
                const pendingRegistrations = branchData.value - branchData.registeredCount;

                return (
                  <div
                    key={`branch-${index}`}
                    className="bg-card border border-border flex flex-col justify-between items-center rounded-xl shadow-sm p-5 h-full"
                  >
                    <div className="w-full flex flex-col items-center">
                      <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 mb-4 text-center justify-center">
                        <MapPin className="text-primary h-4 w-4 shrink-0" />
                        BO {index + 1}: {branchData.name}
                      </h3>

                      {/* Donut Chart with Click Handler */}
                      <div className="cursor-pointer my-2">
                        <PieChart width={180} height={180}>
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
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {[
                              { name: 'Registered', value: branchData.registeredCount },
                              { name: 'Pending', value: pendingRegistrations }
                            ].map((entry, idx) => (
                              <Cell 
                                key={`cell-${idx}`} 
                                fill={idx === 0 ? '#10B981' : '#F59E0B'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-border text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span>Total: <strong className="text-foreground">{branchData.value}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="text-primary h-4 w-4 shrink-0" />
                        <span>Enrolled: <strong className="text-foreground">{branchData.registeredCount}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span>Pending: <strong className="text-foreground">{pendingRegistrations}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span>Success %: <strong className="text-foreground">{registrationProbability}%</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <BarChart2 className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span>Failure Prob: <strong className="text-foreground">{(100 - Number(registrationProbability)).toFixed(2)}%</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2 border-t border-dashed border-border pt-2 mt-1">
                        <BarChart2 className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span>Reason: <span className="text-foreground font-bold">{headData?.negativeFeedback || "General low awareness"}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-muted-foreground font-bold border border-border bg-card shadow-sm rounded-xl">
                No branch office data available for this selection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOfficeDashboard;
