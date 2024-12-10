import React, { useRef, useEffect } from "react";
import ApexCharts from "apexcharts";
import useDemographicsStore from "@/store/demographicsStore";
import useDashboardStore from "@/store/dashboardStore";

const options = {
  colors: ["#1A56DB", "#FDBA8C"],
  chart: {
    type: "bar",
    width: "100%",
    height: "350px",
    fontFamily: "Poppins, sans-serif",
    toolbar: {
      show: false,
    },
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%",
      borderRadiusApplication: "end",
      borderRadius: 4,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    style: {
      fontFamily: "Poppins, sans-serif",
      fontSize: '14px', // Adjust the font size
    },
    theme: "dark", // Dark theme for better contrast
    marker: {
      show: true, // Show the tooltip marker
    },
    x: {
      show: true, // Display the x-value
    },
    y: {
      formatter: (value) => {
        return `${value}`; // You can format the tooltip value as per your need
      },
    },
    fillSeriesColor: true, // Show series color in tooltip
    borderColor: "#333", // Dark border color for better visibility
    background: "#fff", // White background for contrast
    borderRadius: 4, // Rounded corners
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
  },
  states: {
    hover: {
      filter: {
        type: "darken",
        value: 1,
      },
    },
  },
  stroke: {
    show: true,
    width: 0,
    colors: ["transparent"],
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -14,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "bottom",
  },
  xaxis: {
    floating: false,
    labels: {
      show: true,
      style: {
        fontFamily: "Poppins, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
  },
  fill: {
    opacity: 1,
  },
};


export default function GenderAge() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();

  useEffect(() => {
    // Wait until chartRef.current is defined and demographicData is available
    if (chartRef.current && demographicData) {
      const femaleData = [
        { x: "0-6", y: demographicData.f06 },
        { x: "7-17", y: demographicData.women7_17 },
        { x: "18-24", y: demographicData.women18_24 },
        { x: "25-40", y: demographicData.women25_40 },
        { x: "41-60", y: demographicData.women40_60 },
        { x: "60+", y: demographicData.women60Plus },
      ];

      const maleData = [
        { x: "0-6", y: demographicData.m06 },
        { x: "7-17", y: demographicData.men7_17 },
        { x: "18-24", y: demographicData.men18_24 },
        { x: "25-40", y: demographicData.men25_40 },
        { x: "41-60", y: demographicData.men40_60 },
        { x: "60+", y: demographicData.men60Plus },
      ];

      // Update chart options dynamically with the new data
      const updatedOptions = {
        ...options,
        series: [
          {
            name: "Female",
            color: "#c8a2c8",
            data: femaleData,
          },
          {
            name: "Male",
            color: "#1A56DB",
            data: maleData,
          },
        ],
      };

      let chart = new ApexCharts(chartRef.current, updatedOptions);
      chart.render();

      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }
  }, [demographicData]); // Re-run effect when demographicData changes

  return (
    <div className="flex flex-col border justify-center">
      <div ref={chartRef} id="bar-chart"></div>
    </div>
  );
}
