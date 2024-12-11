"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, ArrowRight, Search, Proportions, Download } from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import { useRouter } from "next/navigation";

const PublicInfo = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [villagesVisible, setVillagesVisible] = useState(false);
  const [schemesVisible, setSchemesVisible] = useState(false);
  const itemsPerPage = 10;




  const downloadCSV = async () => {
    try {
      setLoading(true);
      // Fetch all data without pagination
      const response = await axios.get(`/api/publicInfo`, {
        params: {
          page: 1,
          limit: 100000, // Large number to fetch all records
          search: searchQuery,
          villages: selectedVillages.join(","),
          schemes: selectedSchemes.join(","),
        },
      });
  
      const dataToDownload = response.data.data;
  
      const keys = [
        "aadharId", 
        "name", 
        "area", 
        "recommendedScheme1", 
        "scheme1", 
        "recommendedScheme2", 
        "scheme2", 
        "recommendedScheme3", 
        "scheme3"
      ];
  
      const header = keys.join(",");
      const rows = dataToDownload.map((obj) => 
        keys
          .map((key) => {
            let value = obj[key];
            // Convert boolean to Yes/No
            if (typeof value === 'boolean') {
              value = value ? 'Yes' : 'No';
            }
            // Escape commas and quotes
            return value !== null && value !== undefined 
              ? `"${String(value).replace(/"/g, '""')}"` 
              : '""';
          })
          .join(",")
      );
  
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "public_information.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Optionally show an error message to the user
      setError("Unable to download data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  console.log(data)
  const schemes = [
    "Post Office Savings Account",
    "Recurring Deposit Scheme (RD)",
    "Time Deposit (TD)",
    "Public Provident Fund (PPF)",
    "National Savings Certificate (NSC)",
    "Kisan Vikas Patra (KVP)",
    "Sukanya Samriddhi Yojana (SSA)",
    "Senior Citizen Savings Scheme (SCSS)",
    "Atal Pension Yojana (APY)",
    "Postal Life Insurance (PLI)",
    "Rural Postal Life Insurance (RPLI)",
    "India Post Payments Bank (IPPB)",
    "Money Transfer Service Scheme (MTSS)",
    "Direct Benefit Transfer (DBT)",
    "Mahila Samman Savings Certificate",
    "Kisan Credit Card (KCC)",
    "Loan Against NSC/KVP",
    "Loan Against RD/TD",
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/publicInfo`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            villages: selectedVillages.join(","),
            schemes: selectedSchemes.join(","),
          },
        });

        setData(response.data.data);
        console.log(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError("Unable to retrieve data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, selectedVillages, selectedSchemes]);

  // Get unique villages from data
  const availableVillages = [...new Set(data.map((item) => item.Area))];

  // Toggle village selection
  const toggleVillage = (village) => {
    setSelectedVillages((prev) =>
      prev.includes(village)
        ? prev.filter((v) => v !== village)
        : [...prev, village]
    );
    setCurrentPage(1);
  };

  // Toggle scheme selection
  const toggleScheme = (scheme) => {
    setSelectedSchemes((prev) =>
      prev.includes(scheme)
        ? prev.filter((s) => s !== scheme)
        : [...prev, scheme]
    );
    setCurrentPage(1);
  };
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVillages([]);
    setSelectedSchemes([]);
    setCurrentPage(1);
  };
  const toggleVillagesVisibility = () => {
    setVillagesVisible(!villagesVisible);
  };

  // Toggle schemes visibility
  const toggleSchemesVisibility = () => {
    setSchemesVisible(!schemesVisible);
  };

  const { setindividualProfile } = useDashboardStore();
  const handleclick = (item) => {
    setindividualProfile(item);
    router.push("/personalDetails");
    console.log(item);
  };

  return (
    <div className="bg-gray-50  ">
      <div className="w-full border bg-white  rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Public Information Portal
          </h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Proportions className="h-5 w-5" />
            <span>{isFilterOpen ? "Close" : "Filters"}</span>
          </button>
        </div>

        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg  mb-6"
          >
            {/* Header with Close and Clear Buttons */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-blue-500 hover:underline text-sm"
              >
                Clear All
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, Aadhaar ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            {/* Schemes Filter */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">
                  Filter by Schemes
                </h3>
                <button
                  onClick={toggleSchemesVisibility}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {schemesVisible ? "Hide" : "Show"}
                </button>
              </div>
              {schemesVisible && (
                <div className="grid grid-cols-4 gap-2 mt-3 max-h-36 overflow-y-auto">
                  {schemes.map((scheme) => (
                    <button
                      key={scheme}
                      onClick={() => toggleScheme(scheme)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedSchemes.includes(scheme)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {scheme}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center my-3 bg-gray-100 p-2 rounded-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-2 rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs">Previous</span>
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>


          



<button
  className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-2 rounded-md hover:bg-blue-700 transition"
  onClick={downloadCSV}
  disabled={loading}
>
  <Download className="h-4 w-4" />
  <span className="text-xs">
    {loading ? "Downloading..." : "Download CSV"}
  </span>
</button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-2 rounded-md disabled:opacity-50 hover:bg-blue-700 transition"
          >
            <span className="text-xs">Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No data available matching your criteria.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white  rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aadhaar ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheme 1
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheme 2
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheme 3
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => {
                        handleclick(item);
                      }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.aadharId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.area}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.recommendedScheme1}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.scheme1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.scheme1 ? "Enrolled" : "Not Enrolled"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.recommendedScheme2}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.scheme2
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.scheme2 ? "Enrolled" : "Not Enrolled"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.recommendedScheme3}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.scheme3
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.scheme3 ? "Enrolled" : "Not Enrolled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicInfo;







