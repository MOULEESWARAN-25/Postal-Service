"use client";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import useDashboardStore from "@/store/dashboardStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import { APEX_CHART_THEME } from "@/components/ui/chart-custom";

const getLiteracyChartOptions = (seriesData) => {
  return {
    ...APEX_CHART_THEME,
    series: seriesData,
    chart: {
      ...APEX_CHART_THEME.chart,
      height: 250, // Standard height matching other cards
      width: "100%",
      type: "pie",
    },
    stroke: {
      colors: ["var(--color-surface)"],
      width: 2,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -15,
        },
      },
    },
    labels: ["Literate Men", "Illiterate Men", "Literate Women", "Illiterate Women"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "10px",
        fontFamily: "Inter, sans-serif",
      },
    },
  };
};

export default function LiteracyPieChart() {
  const { demographicData } = useDashboardStore();
  const [chartData, setChartData] = useState([0, 0, 0, 0]); // To store series data

  useEffect(() => {
    let literacyChart;
    if (document.getElementById("literacy-chart") && typeof ApexCharts !== "undefined") {
      literacyChart = new ApexCharts(
        document.getElementById("literacy-chart"),
        getLiteracyChartOptions(chartData)
      );
      literacyChart.render();
    }
    return () => {
      if (literacyChart) literacyChart.destroy();
    };
  }, [chartData]);

  useEffect(() => {
    if (demographicData) {
      const totM = demographicData.totM || 0;
      const totF = demographicData.totF || 0;
      const literate_men = (totM * (demographicData.mLit || 0)) / 100;
      const illiterate_men = (totM * (demographicData.mIll || 0)) / 100;
      const literate_women = (totF * (demographicData.fLit || 0)) / 100;
      const illiterate_women = (totF * (demographicData.fIll || 0)) / 100;

      // Update the chart data
      setChartData([literate_men, illiterate_men, literate_women, illiterate_women]);
    }
  }, [demographicData]);

  return (
    <ErrorBoundary>
      <div className="w-full h-full flex items-center justify-center">
        <div id="literacy-chart" style={{ height: "320px", width: "100%" }}></div>
      </div>
    </ErrorBoundary>
  );
}
