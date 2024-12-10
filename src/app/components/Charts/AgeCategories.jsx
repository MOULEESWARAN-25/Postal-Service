import React, { useRef, useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';

import useDashboardStore from '@/store/dashboardStore';

const options = {
  series: [], // Start with an empty array
  colors: ["#00B4D8", "#0077B6", "#90E0EF", "#48CAE4", "#023E8A", "#1C64F2"], // Colors for each segment
  chart: {
    height: 250,
    width: "100%",
    type: "donut",
  },
  stroke: {
    colors: ["transparent"],
    lineCap: "",
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontsize: "12px",
            fontFamily: "Poppins, sans-serif",
            offsetY: 20,
          },
          total: {
            showAlways: true,
            show: true,
            label: "Age",
            size:"18px",
            fontFamily: "Poppins, sans-serif",
          },
          value: {
            show: false,
            fontFamily: "Poppins, sans-serif",
          },
        },
        size: "75%",
      },
    },
  },
  grid: {
    padding: {
      top: -2,
    },
  },
  labels: ["0-6", "7-17", "18-24", "25-40", "41-60", "60+"], // Age groups
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "bottom",
    fontFamily: "Inter, sans-serif",
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value + "%";
      },
    },
  },
  xaxis: {
    labels: {
      formatter: function (value) {
        return value + "%";
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
};

export default function AgeDistribution() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chartRef.current && !chart) {
      // Initialize the chart only once
      const newChart = new ApexCharts(chartRef.current, options);
      newChart.render();
      setChart(newChart);
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chart]); // Runs only once to initialize the chart

  useEffect(() => {
    if (demographicData && chart) {
      // Calculate the population for each age group
      const ageGroups = [
        demographicData.population717, 
        demographicData.population1824,
        demographicData.population2540,
        demographicData.population4060,
        demographicData.population60Plus
      ];

      // Update the series with calculated data
      chart.updateOptions({
        series: ageGroups
      });
    }
  }, [demographicData, chart]); // Update the chart when demographicData or chart changes

  return (
    <div className="flex flex-col justify-between">
      <h2 className="text-[18px] text-blue-800 mb-4 align-text">Age Distribution</h2>
      <div ref={chartRef} id="donut-chart"></div>
    </div>
  );
}
