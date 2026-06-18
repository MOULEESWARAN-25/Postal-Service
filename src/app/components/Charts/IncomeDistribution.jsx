import React, { useRef, useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import useDashboardStore from '@/store/dashboardStore';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function IncomeDistribution() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();
  const [chartData, setChartData] = useState([30.26, 61.52, 8.22]); // Default percentages

  // Function to calculate income distribution
  const calculateIncomeDistribution = (data) => {
    const totalPopulation = data?.totP || 1; // Prevent division by 0
    const lowIncome = (data?.margworkP / totalPopulation) * 100; // Marginal workers as low income
    const middleIncome = ((data?.mainworkP - data?.mainClP - data?.mainHhP) / totalPopulation) * 100; // Non-cultivators, non-household workers as middle
    const highIncome = (data?.mainClP / totalPopulation) * 100; // Cultivators as high income

    return [lowIncome.toFixed(2), middleIncome.toFixed(2), highIncome.toFixed(2)];
  };

  useEffect(() => {
    let chart;

    if (chartRef.current) {
      // Calculate new series data
      const updatedData = calculateIncomeDistribution(demographicData);
      setChartData(updatedData);

      // Chart options
      const options = {
        series: updatedData.map((value) => parseFloat(value)),
        colors: ["#C8102E", "#1A2B4A", "#94A3B8"],
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
              size: "55%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "12px",
                  fontFamily: "Poppins, sans-serif",
                  offsetY: 20,
                },
                total: {
                  showAlways: false,
                  show: true,
                  label: "Income",
                  fontSize: "28px",
                  fontFamily: "Poppins, sans-serif",
                },
                value: {
                  show: false,
                  fontFamily: "Poppins, sans-serif",
                },
              },
            },
          },
        },
        grid: {
          padding: {
            top: -2,
          },
        },
        labels: ["Low", "Middle", "High"], // Income groups
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "bottom",
          fontFamily: "Poppins, sans-serif",
        },
      };

      // Render or update chart
      chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [demographicData]); // Re-run effect if demographicData changes

  return (
    <ErrorBoundary>
      <div className="flex justify-center w-full h-full p-2 items-center">
        <div ref={chartRef} id="donut-chart" className="w-full"></div>
      </div>
    </ErrorBoundary>
  );
}
