"use client";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import useDemographicsStore from "@/store/demographicsStore";
import useDashboardStore from "@/store/dashboardStore";

const getLiteracyChartOptions = (seriesData) => {
  return {
    series: seriesData,
    colors: ["#FF7F50", "#FFB6C1", "#9370DB", "#BA55D3"],
    chart: {
      height: 320, // Adjust height to match Occupation chart
      width: "110%", // Maintain width 100% within container
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
    labels: ["Literate Men", "Illiterate Men", "Literate Women", "Illiterate Women"],
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
      const totalpopulation = demographicData.totP;
      const literate_men = (totalpopulation * demographicData.mLit) / 100;
      const illiterate_men = (totalpopulation * demographicData.mIll) / 100;
      const literate_women = (totalpopulation * demographicData.fLit) / 100;
      const illiterate_women = (totalpopulation * demographicData.fIll) / 100;

      // Update the chart data
      setChartData([literate_men, illiterate_men, literate_women, illiterate_women]);
    }
  }, [demographicData]);

  return (
    <div className="flex-col items-center p-4">
      <h2 className="text-[18px] items-center text-blue-800 text-center">Literate/Illiterate Men and Women</h2>
      <div id="literacy-chart" style={{ height: "320px", width: "100%" }}></div>
    </div>
  );
}
