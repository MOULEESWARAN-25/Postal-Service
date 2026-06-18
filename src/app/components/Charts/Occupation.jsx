import React, { useEffect, useMemo } from "react";
import ApexCharts from "apexcharts";
import useDashboardStore from "@/store/dashboardStore";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Occupation() {
  const { demographicData } = useDashboardStore();

  // Calculate percentages
  const chartData = useMemo(() => {
    const workingMale = demographicData?.totWorkM || 0;
    const workingFemale = demographicData?.totWorkF || 0;
    const nonWorkingMale = demographicData?.nonWorkM || 0;
    const nonWorkingFemale = demographicData?.nonWorkF || 0;
    
    const totalPopulation = workingMale + workingFemale + nonWorkingMale + nonWorkingFemale;

    // Prevent division by zero
    if (totalPopulation === 0) {
      return {
        series: [25, 25, 25, 25],
        labels: ['Working Men', 'Non-Working Men', 'Working Women', 'Non-Working Women']
      };
    }

    // Calculate percentages
    const series = [
      ((workingMale / totalPopulation) * 100).toFixed(1),
      ((nonWorkingMale / totalPopulation) * 100).toFixed(1),
      ((workingFemale / totalPopulation) * 100).toFixed(1),
      ((nonWorkingFemale / totalPopulation) * 100).toFixed(1)
    ].map(Number);

    return {
      series,
      labels: ['Working Men', 'Non-Working Men', 'Working Women', 'Non-Working Women']
    };
  }, [demographicData]);

  const getChartOptions = () => {
    return {
      series: chartData.series,
      colors: ["#1A2B4A", "#475569", "#C8102E", "#94A3B8"],
      chart: {
        height: 320,
        width: "100%",
        type: "pie",
      },
      stroke: {
        colors: ["white"],
        width: 3,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -25,
          },
        },
      },
      labels: chartData.labels,
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          fontFamily: "Poppins, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Poppins, sans-serif",
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(1)}%`,
        },
      },
    };
  };

  useEffect(() => {
    let chart;
    if (document.getElementById("pie-chart") && typeof ApexCharts !== "undefined") {
      chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions());
      chart.render();
    }
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartData]); // Depend on chartData to re-render when data changes

  return (
    <ErrorBoundary>
      <div className="w-full h-full flex items-center justify-center">
        <div id="pie-chart" style={{ height: "320px", width: "100%" }}></div>
      </div>
    </ErrorBoundary>
  );
}