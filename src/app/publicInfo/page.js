"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Proportions, 
  Download, 
  ChevronDown, 
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const SCHEMES = [
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

const PublicInfo = () => {
  const router = useRouter();
  const { setindividualProfile, triggerChatbot } = useDashboardStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [schemesVisible, setSchemesVisible] = useState(false);
  const [sorting, setSorting] = useState([]);
  const itemsPerPage = 10;

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

        if (response.data && response.data.success) {
          setData(response.data.data || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setError(response.data?.error || "Failed to retrieve beneficiaries.");
        }
      } catch (err) {
        setError("Unable to retrieve data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, selectedVillages, selectedSchemes]);

  const toggleScheme = (scheme) => {
    setSelectedSchemes((prev) =>
      prev.includes(scheme)
        ? prev.filter((s) => s !== scheme)
        : [...prev, scheme]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVillages([]);
    setSelectedSchemes([]);
    setCurrentPage(1);
  };

  const handleclick = (item) => {
    setindividualProfile(item);
    router.push("/personalDetails");
  };

  const downloadCSV = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/publicInfo`, {
        params: {
          page: 1,
          limit: 100000,
          search: searchQuery,
          villages: selectedVillages.join(","),
          schemes: selectedSchemes.join(","),
        },
      });
  
      const dataToDownload = response.data.data || [];
      const keys = [
        "aadhaar_id", 
        "Name", 
        "Area", 
        "RecommendedScheme1", 
        "Scheme1", 
        "RecommendedScheme2", 
        "Scheme2", 
        "RecommendedScheme3", 
        "Scheme3"
      ];
  
      const header = keys.join(",");
      const rows = dataToDownload.map((obj) => 
        keys
          .map((key) => {
            let value = obj[key];
            if (typeof value === 'boolean') {
              value = value ? 'Yes' : 'No';
            }
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
      console.warn("Error downloading CSV:", error);
      setError("Unable to download data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Define columns for TanStack Table
  const columns = [
    {
      accessorKey: "aadhaar_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-2 h-8 text-xs font-semibold text-foreground hover:bg-muted"
        >
          Aadhaar ID
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs text-foreground/85">{row.getValue("aadhaar_id")}</span>
    },
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-2 h-8 text-xs font-semibold text-foreground hover:bg-muted"
        >
          Name
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue("Name")}</span>
    },
    {
      accessorKey: "Area",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-2 h-8 text-xs font-semibold text-foreground hover:bg-muted"
        >
          Area
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-foreground/80">{row.getValue("Area")}</span>
    },
    {
      accessorKey: "RecommendedScheme1",
      header: "Scheme 1",
      cell: ({ row }) => <span className="text-xs text-foreground/80">{row.getValue("RecommendedScheme1")}</span>
    },
    {
      accessorKey: "Scheme1",
      header: "Enrollment 1",
      cell: ({ row }) => {
        const isEnrolled = row.getValue("Scheme1");
        return (
          <Badge 
            variant="outline" 
            className={isEnrolled 
              ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" 
              : "border-destructive bg-destructive/10 text-destructive"
            }
          >
            {isEnrolled ? "Enrolled" : "Not Enrolled"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "RecommendedScheme2",
      header: "Scheme 2",
      cell: ({ row }) => <span className="text-xs text-foreground/80">{row.getValue("RecommendedScheme2")}</span>
    },
    {
      accessorKey: "Scheme2",
      header: "Enrollment 2",
      cell: ({ row }) => {
        const isEnrolled = row.getValue("Scheme2");
        return (
          <Badge 
            variant="outline" 
            className={isEnrolled 
              ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" 
              : "border-destructive bg-destructive/10 text-destructive"
            }
          >
            {isEnrolled ? "Enrolled" : "Not Enrolled"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "RecommendedScheme3",
      header: "Scheme 3",
      cell: ({ row }) => <span className="text-xs text-foreground/80">{row.getValue("RecommendedScheme3")}</span>
    },
    {
      accessorKey: "Scheme3",
      header: "Enrollment 3",
      cell: ({ row }) => {
        const isEnrolled = row.getValue("Scheme3");
        return (
          <Badge 
            variant="outline" 
            className={isEnrolled 
              ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" 
              : "border-destructive bg-destructive/10 text-destructive"
            }
          >
            {isEnrolled ? "Enrolled" : "Not Enrolled"}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-white text-slate-800 border border-slate-200">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleclick(item); }} className="text-xs cursor-pointer">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); triggerChatbot(`Explain why schemes like ${item.RecommendedScheme1} or ${item.RecommendedScheme2} are highly suitable for beneficiary ${item.Name}.`); }} className="text-xs cursor-pointer">
                  Explain Fit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/recommender?name=${encodeURIComponent(item.Name)}&aadhaarId=${encodeURIComponent(item.aadhaar_id)}`); }} className="text-xs cursor-pointer">
                  Recommend Scheme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ];

  return (
    <ErrorBoundary>
      <div className="bg-[#F8F9FB] min-h-screen">
        <div className="page-container space-y-5">
          
          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-slate-500 hover:text-[#C8102E]">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-[#1A2B4A]">Public Information Portal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Public Information Portal
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                DSS Portal verifying beneficiary details, active enrollments, and recommended savings schemes.
              </p>
            </div>
            <Badge className="bg-[#1A2B4A] text-white py-1 px-3 rounded-full text-xs font-semibold">
              Who should I target?
            </Badge>
          </div>

          {/* Horizontal Filters Toolbar Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-slate-200 bg-white rounded-xl shadow-sm">
            <div className="flex flex-1 flex-col md:flex-row items-center gap-3 w-full">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or Aadhaar ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 border-border bg-transparent text-xs text-foreground"
                />
              </div>

              {/* Dynamic Scheme Selector dropdown */}
              <Select
                value={selectedSchemes[0] || "ALL"}
                onValueChange={(val) => {
                  if (val === "ALL") {
                    setSelectedSchemes([]);
                  } else {
                    setSelectedSchemes([val]);
                  }
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[220px] h-9 text-xs border-border rounded-xl">
                  <SelectValue placeholder="Filter Scheme" />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-800 border border-slate-100 max-h-60">
                  <SelectItem value="ALL" className="text-xs">All Schemes</SelectItem>
                  {SCHEMES.map((scheme) => (
                    <SelectItem key={scheme} value={scheme} className="text-xs">
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear filters */}
              {(searchQuery || selectedSchemes.length > 0) && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-[#C8102E] hover:text-[#A00D24] hover:bg-red-50 px-3 rounded-xl shrink-0"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Actions button */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <Button
                onClick={downloadCSV}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-9 text-xs font-semibold px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          {/* Main Data Table View */}
          <div className="border border-slate-200 rounded-2xl bg-white p-0 overflow-hidden shadow-sm">
            {error ? (
              <div className="p-6 text-center text-destructive">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                loading={loading}
                manualPagination={true}
                pageCount={totalPages}
                pageIndex={currentPage - 1}
                onPageChange={(idx) => setCurrentPage(idx + 1)}
                onRowClick={handleclick}
                emptyMessage="No Beneficiaries Found. Try adjusting your filters or search query to locate records."
                showColumnsToggle={true}
              />
            )}
          </div>

        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PublicInfo;
