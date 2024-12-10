import React, { useRef, useEffect } from "react";
import ApexCharts from "apexcharts";

const options = {
  series: [64.23, 36.07], // Data for Male and Female
  colors: ["#1C64F2", "#16BDCA"], // Color for Male and Female
  chart: {
    height: 250,
    width: "80%",
    type: "donut",
  },
  stroke: {
    colors: ["transparent"],
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontFamily: "Poppins, sans-serif",
            fontSize: "18px", // Larger font size for name
            fontWeight: 600,  // Bold font for name
            offsetY: -20,     // Adjusted for better position
          },
          total: {
            show: true,
            showAlways: true,
            label: "",
            fontFamily: "Poppins, sans-serif",
            fontSize: "16px", // Font size for the total label
            fontWeight: 600,  // Bold font for the total label
            color: "#333",
            offsetY: 0,       // Adjusted for better position
          },
          value: {
            show: false, // Hides the value/percentage
          },
        },
        size: "70%", // Adjust donut size for better visual balance
      },
    },
  },
  grid: {
    padding: {
      top: -10,
    },
  },
  labels: ["Male", "Female"],
  dataLabels: {
    enabled: false, // Disable external data labels
  },
  legend: {
    position: "bottom",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px", // Font size for the legend
    markers: {
      width: 12,
      height: 12,
      radius: 4,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 5,
    },
  },
  tooltip: {
    enabled: true,
    theme: "light", // Lighter tooltip theme for better visibility
    y: {
      formatter: (value) => `${value.toFixed(2)}%`,
    },
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

export default function EmploymentStatus() {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;

    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }

    return () => {
      if (chart) {
        chart.destroy();  // Ensure chart is properly destroyed on cleanup
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 align-text">Employment Status</h2>

      <div ref={chartRef} id="donut-chart"></div>
    </div>
  );
}
