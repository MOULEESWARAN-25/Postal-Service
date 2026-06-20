"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Download, 
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react";
import useDashboardStore from "@/store/dashboardStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  "Post Office Savings Account (SB)",
  "National Savings Recurring Deposit (RD)",
  "National Savings Time Deposit (TD)",
  "Monthly Income Scheme (MIS)",
  "Public Provident Fund (PPF)",
  "Senior Citizens Savings Scheme (SCSS)",
  "Sukanya Samriddhi Account (SSA)",
  "National Savings Certificate (NSC)",
  "Kisan Vikas Patra (KVP)",
  "Mahila Samman Savings Certificate (MSSC)",
  "PM CARES for Children Scheme",
  "Regular Savings Account (IPPB)",
  "Basic Savings Account (IPPB)",
  "DigiSmart Savings Account (IPPB)",
  "Premium Savings Account (IPPB)",
  "Premium Aarogya Savings Account (IPPB)",
  "SHG Savings Account (IPPB)",
  "Current Account (IPPB)",
  "PMJJBY (Third-Party Insurance)",
  "PMSBY (Third-Party Insurance)",
  "Atal Pension Yojana (APY)"
];

const PublicInfo = () => {
  const router = useRouter();
  const { setindividualProfile, triggerChatbot } = useDashboardStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillages] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const clearFilters = () => {
    setSearchQuery("");
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

  // 5-column user-oriented table — replaces the 10-column database design
  const columns = [
    {
      accessorKey: "aadhaar_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-2 h-8 text-xs font-bold text-foreground hover:bg-muted"
        >
          Aadhaar ID <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-foreground/70 tracking-tight">{row.getValue("aadhaar_id")}</span>
      ),
    },
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-2 h-8 text-xs font-bold text-foreground hover:bg-muted"
        >
          Beneficiary <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-xs text-foreground">{row.getValue("Name")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{row.original.Area}</p>
        </div>
      ),
    },
    {
      id: "schemes",
      header: () => <span className="text-xs font-bold text-foreground">Recommended Schemes</span>,
      cell: ({ row }) => {
        const schemes = [
          row.original.RecommendedScheme1,
          row.original.RecommendedScheme2,
          row.original.RecommendedScheme3,
        ].filter(Boolean);
        return (
          <div className="flex flex-col gap-1 py-1">
            {schemes.map((s, i) => (
              <span
                key={i}
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md truncate max-w-[220px]"
                style={{ background: "#EEF1F8", color: "#1A2B4A" }}
                title={s}
              >
                {s}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "enrollment_status",
      header: () => <span className="text-xs font-bold text-foreground">Enrollment</span>,
      cell: ({ row }) => {
        const enrolled = [
          row.original.Scheme1,
          row.original.Scheme2,
          row.original.Scheme3,
        ].filter(Boolean).length;
        const total = [
          row.original.RecommendedScheme1,
          row.original.RecommendedScheme2,
          row.original.RecommendedScheme3,
        ].filter(Boolean).length;
        const isFullyEnrolled = enrolled === total && total > 0;
        const isPartial = enrolled > 0 && enrolled < total;
        return (
          <Badge
            variant="outline"
            className={`text-xs font-bold rounded-full px-2.5 py-0.5 border ${
              isFullyEnrolled
                ? "bg-primary/10 text-primary border-primary/20"
                : isPartial
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {enrolled}/{total} Enrolled
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right text-xs font-bold text-foreground">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-muted rounded-full flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-card text-foreground border border-border z-50 shadow-md">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleclick(item); }} className="text-xs cursor-pointer">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); triggerChatbot(`Explain why schemes like ${item.RecommendedScheme1} or ${item.RecommendedScheme2} are highly suitable for beneficiary ${item.Name}.`); }} className="text-xs cursor-pointer">
                  Explain Fit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (typeof window !== 'undefined') { sessionStorage.setItem('selectedBeneficiary', JSON.stringify({ name: item.Name, aadhaarId: item.aadhaar_id })); } router.push('/recommender'); }} className="text-xs cursor-pointer">
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
      <div className="bg-background min-h-screen text-foreground">
        <div className="page-container max-w-[1600px] mx-auto w-full space-y-6">
          
          {/* Breadcrumbs */}
          <Breadcrumb className="text-xs">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="font-semibold text-muted-foreground hover:text-primary">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-extrabold text-secondary">Public Information Portal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Public Information Portal
              </h1>
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                DSS Portal verifying beneficiary details, active enrollments, and recommended savings schemes.
              </p>
            </div>
            <Badge className="bg-secondary text-secondary-foreground py-1 px-3 rounded-full text-xs font-semibold">
              Target Candidates
            </Badge>
          </div>

          {/* Horizontal Filters Toolbar Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-border bg-card rounded-xl shadow-sm">
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
                  className="pl-9 h-10 border-border bg-transparent text-xs text-foreground"
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
                <SelectTrigger className="w-full md:w-[220px] h-10 text-xs border-border rounded-lg bg-card text-foreground">
                  <SelectValue placeholder="Filter Scheme" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground border border-border max-h-60 z-50">
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
                  className="h-10 text-xs text-primary hover:text-primary hover:bg-muted px-3 rounded-lg shrink-0"
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
                className="flex items-center gap-2 h-10 text-xs font-semibold px-4 rounded-lg border-border text-foreground hover:bg-muted"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          {/* Main Data Table View */}
          <div className="border border-border rounded-xl bg-card p-0 overflow-x-auto shadow-sm">
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
