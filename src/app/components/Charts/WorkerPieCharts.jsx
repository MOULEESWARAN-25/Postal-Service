// WorkingChart.js
import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

const getWorkingChartOptions = () => {
  return {
    series: [30, 20, 25, 25],
    colors: ["#023E8A", "#0077B6", "#00B4D8", "#48CAE4"],
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
    <div className="flex-col items-center">
      <h2 className="text-[18px] text-blue-800 p-2">Working/Non-Working Men and Women</h2>
      <div id="working-chart"></div>
    </div>
  );
}
