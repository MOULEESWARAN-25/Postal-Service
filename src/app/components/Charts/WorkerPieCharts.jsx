// WorkingChart.js
import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import ErrorBoundary from "@/components/ErrorBoundary";

const getWorkingChartOptions = () => {
  return {
    series: [30, 20, 25, 25],
    colors: ["#1A2B4A", "#475569", "#C8102E", "#94A3B8"],
    chart: {
      height: 300,
      width: "75%",
      type: "pie",
    },
    stroke: {
      colors: ["white"],
      width: 3,
    },
    labels: ["Working Men", "Non-Working Men", "Working Women", "Non-Working Women"],
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Poppins, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Poppins, sans-serif",
    },
  };
};

export default function WorkerPieChart() {
  useEffect(() => {
    let workingChart;
    if (document.getElementById("working-chart") && typeof ApexCharts !== "undefined") {
      workingChart = new ApexCharts(document.getElementById("working-chart"), getWorkingChartOptions());
      workingChart.render();
    }
    return () => {
      if (workingChart) workingChart.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-semibold text-foreground text-center mb-4">Working/Non-Working Men and Women</h2>
        <div id="working-chart"></div>
      </div>
    </ErrorBoundary>
  );
}
