"use client";
import {
  DollarSign,
  Landmark,
  MapPin,
  NotebookTabs,
  Pin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Loader } from "lucide-react"; // Loading icon from lucide-react
import PopulationSpike from "../components/Charts/PopulationSpike";
import LiteracyPieChart from "../components/Charts/LiteracyPieChart";
import Occupation from "../components/Charts/Occupation";
import WorkerClassification from "../components/Charts/WorkerClassification";
import GenderAge from "../components/Charts/GenderAge";
import { useEffect, useState } from "react";
import useDashboardStore from "@/store/dashboardStore";
import IncomeDistribution from "../components/Charts/IncomeDistribution";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();

  const {
    demographicData,
    totalDemographicData,
    setTotalDemographicData,
    filterDemographicData,
    setDemographicData,
    setLoading,
    loading,
    State,
    District,
    village,
    subpostoffice,
    postoffice,
    SchemePerformanceVisible,
  } = useDashboardStore();

  const [postOfficesCount, setPostOfficesCount] = useState(null);
  const [postofficesCount, setPostofficesCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to dashboard if already logged in
    }
  }, [router]);

  // name is not correct
  const fetchVillages = async () => {
    if (!District) return;

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/postoffice/${District}`
      );

      if (response.data[0]?.Status === "Success") {
        const count =
          response.data[0].PostOffice.filter(
            (office) => office.BranchType !== "Head Post Office"
          ) || [];
        console.log("count", count);
        setPostOfficesCount(count); // Update state
      } else {
        setError("No post offices found for this district");
      }
    } catch (error) {
      console.error("Error fetching post offices:", error);
      setError("Failed to fetch post offices");
    }
  };
  const fetchPostOffices = async () => {
    if (!subpostoffice) return;

    try {
      // If no specific pincode is provided, use a default or derive from subpostoffice
      const searchPincode = subpostoffice ? subpostoffice.pincode : 624001;

      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${searchPincode}`
      );

      if (response.data[0]?.Status === "Success") {
        const postOffices = response.data[0].PostOffice || [];
        setPostofficesCount(postOffices); // Update state
      } else {
        setError("No post offices found");
      }
    } catch (error) {
      console.error("Error fetching post offices:", error);
      setError("Failed to fetch post offices");
    }
  };
  // Fetch villages when District changes
  useEffect(() => {
    fetchVillages();
  }, [District]);

  useEffect(() => {
    fetchPostOffices();
  }, [subpostoffice]);

  const renderInfo = () => {
    if (!State && !District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Total number of post offices
          </p>
          <h2 className="text-[18px] font-bold text-blue-800">1.55+ lakhs</h2>
        </>
      );
    }
    if (State && !District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Number of post offices
          </p>
          <h2 className="text-[18px] font-bold text-blue-800"></h2>
        </>
      );
    }
    if (State && District && !subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Number of post offices in District
          </p>
          <h2 className="text-[18px] font-bold text-blue-800">
            {postOfficesCount ? postOfficesCount.length : "Loading..."}
          </h2>
        </>
      );
    }
    if (State && District && subpostoffice && !postoffice && !village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Number of branch post offices
          </p>
          <h2 className="text-[18px] font-bold text-blue-800">
            {postofficesCount ? postofficesCount.length : "Loading..."}
          </h2>
        </>
      );
    }
    if (State && District && subpostoffice && postoffice && !village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Branch post offices
          </p>
          <h2 className="text-[18px] font-bold text-blue-800">{postoffice}</h2>
        </>
      );
    }
    if (State && District && subpostoffice && postoffice && village) {
      return (
        <>
          <p className="text-sm font-medium text-blue-800">
            Branch post offices
          </p>
          <h2 className="text-[18px] font-bold text-blue-800">{postoffice}</h2>
        </>
      );
    }
    return "Invalid data";
  };

  useEffect(() => {
    const getDemographics = async () => {
      if (demographicData) return;
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch("/api/demographics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: { name: "INDIA" } }),
        });
        const data = await response.json();
        console.log("data", data);
        setTotalDemographicData(data);
        filterDemographicData();
      } catch (error) {
        console.error("Error fetching demographics:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    getDemographics();
  }, [setDemographicData, setLoading]);

  const [selectedData, setSelectedData] = useState(null);

  const handleRadioChange = (index) => {
    if (totalDemographicData && Array.isArray(totalDemographicData)) {
      const selected = totalDemographicData[index];
      setSelectedData(selected); // Update local state
      setDemographicData(selected); // Update global state
    }
  };
  return (
    <main className="flex-1 bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
          <Loader className="h-12 w-12 text-blue-600 animate-spin" />
          <span className="text-blue-600 ml-4 font-semibold">Loading...</span>
        </div>
      )}

      <div className="block bg-blue-50 pt-4 px-4">
        {totalDemographicData && Array.isArray(totalDemographicData) && (
          <div className="bg-white flex justify-between gap-3 items-center  p-4 rounded-lg shadow-md">
            <div className="flex gap-3">
              <h3 className="text-lg font-bold text-blue-800">
                select demographic{" "}
              </h3>
              <form className="flex  items-center gap-5">
                {totalDemographicData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      id={`radio-${index}`}
                      name="demographic"
                      value={index}
                      onChange={() => handleRadioChange(index)}
                      checked={
                        selectedData === item ||
                        (index === 0 && selectedData === null)
                      }
                      type="checkbox"
                      defaultChecked
                      className="checkbox border-blue-300 bg-white checked:[--chkbg:white] checked:[--chkfg:blue] "
                    />

                    <label
                      htmlFor={`radio-${index}`}
                      className="text-sm text-gray-700"
                    >
                      {item.tru || `Option ${index + 1}`}
                    </label>
                  </div>
                ))}
              </form>
            </div>
            <div className="flex gap-5 ">
              {SchemePerformanceVisible && (
                <Link
                  href="/SchemeMonth"
                  className=" border-t border-b border-blue-300 py-2 text-blue-500 hover:underline"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>View Scheme Performance</span>
                  </div>
                </Link>
              )}
              {SchemePerformanceVisible && (
                <Link
                  href="/publicInfo"
                  className=" border-t border-b border-blue-300 py-2 text-blue-500 hover:underline"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>View publicInfo</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Hero Section */}
      <section className="flex gap-4 py-4 border bg-blue-50 px-4">
        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow-md">
          <div className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-800" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-800">
                Total Population
              </p>
              <h2 className="text-[18px] font-bold text-blue-800">
                {demographicData?.totP}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow-md">
          <div className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <NotebookTabs className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Number of Scheme Enrollment
              </p>
              <h2 className="text-[18px] font-bold text-blue-800">7,802</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow-md">
          <div className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Landmark className="h-6 w-6 text-blue-800" />
            </div>
            <div>{renderInfo()}</div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] bg-white rounded-lg shadow-md">
          <div className="p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Pin className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Location</p>
              <h2 className="text-[18px] font-bold text-blue-800">
                {demographicData?.name}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="flex gap-4 bg-blue-50 px-4">
        <div className="flex-2 w-max bg-white rounded-lg shadow-md">
          <PopulationSpike />
        </div>
        <div className="flex min-w-[200px] bg-white rounded-lg shadow-md">
          <LiteracyPieChart />
        </div>
        <div className="flex min-w-[200px] bg-white rounded-lg shadow-md">
          <Occupation />
        </div>
      </section>
      <section className="flex gap-4 py-4 bg-blue-50 px-4">
        <div className="flex-1 flex flex-col justify-center items-center max-w-[370px] bg-white rounded-lg shadow-md ">
          {/* <AgeDistribution /> */}
          <h2 className="text-[18px] text-blue-800 my-4 align-text">
            Income Distribution
          </h2>
          <IncomeDistribution />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center max-w-[740px] bg-white rounded-lg shadow-md ">
          <h2 className="text-[18px] text-blue-800 my-4 align-text">
            Type of Work
          </h2>

          <WorkerClassification />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center max-w-[360px] bg-white rounded-lg shadow-md ">
          <h2 className="text-[18px] text-blue-800 my-4align-text">
            Gender-Age chart
          </h2>

          <GenderAge />
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
