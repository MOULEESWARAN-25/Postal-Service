"use client";
import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

export default function CreditScore({ creditScore }) {
  const getChartOptions = (score) => {
    return {
      series: [score, 1000 - score], 
      colors: ["#1A56DB", "#E0E0E0"], 
      chart: {
        height: 200,
        width: "100%",
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
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Credit Score",
                fontFamily: "Poppins, sans-serif",
                formatter: function () {
                  return `${score}`; // Display score out of 1000
                },
              },
              value: {
                show: true,
                fontFamily: "Poppins, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value + " / 1000"; // Show score out of 1000
                },
              },
            },
            size: "75%",
            
          },
        },
      },
      labels: [`Score: ${score}`, "Remaining"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show:false,
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + " / 1000";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + " / 1000";
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
  };

  // Initialize and clean up donut chart
  useEffect(() => {
    const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions(creditScore));
    chart.render();

    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      chart.destroy();
    };
  }, [creditScore]); // Re-render and clean up when creditScore changes/

  return (
<div className="p-3 flex flex-col items-center" style={{ width: '200px', height: '200px' }}>
  {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Credit Score</h2> */}
  <div id="donut-chart" style={{ width: '100%', height: '200px' }}></div>
</div>

  );
}

