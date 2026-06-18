import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import useDashboardStore from '@/store/dashboardStore';
import ErrorBoundary from "@/components/ErrorBoundary";

export default function PopulationSpike() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();
  const totalPopulation = demographicData?.totP || 5000; // Default value if not available

  useEffect(() => {
    // Define the spike values for each year
    const spike2025 = 1;
    const spike2026 = 2;
    const spike2027 = 3;
    const spike2028 = 4;
    const spike2029 = 5;
    const spike2030 = 6;

    // Calculate the population for each year using the formula
    const formula2025 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2025));
    const formula2026 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2026));
    const formula2027 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2027));
    const formula2028 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2028));
    const formula2029 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2029));
    const formula2030 = Math.round(totalPopulation * Math.pow(1.012, 13 + spike2030));

    // Prepare the years and population data
    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);
    const populationData = [
      formula2025, formula2026, formula2027, formula2028, formula2029, formula2030
    ];

    const options = {
      chart: {
        height: 300,
        width: "100%",
        type: "area",
        fontFamily: "Poppins, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1A2B4A",
          gradientToColors: ["#1A2B4A"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: true,
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        padding: {
          left: 30,
          right: 20,
          top: 10,
          bottom: 10,
        },
      },
      series: [
        {
          name: "Population",
          data: populationData, // Use the calculated population data
          color: "#1A2B4A",
        },
      ],
      xaxis: {
        categories: years, // Use dynamically generated years
        labels: {
          show: true,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        show: false,
      },
      
    };

    // Initialize the chart and render it
    let chart;
    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }

    // Cleanup on unmount
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [totalPopulation]);

  return (
    <ErrorBoundary>
      <div className="w-full h-full">
        <div ref={chartRef} id="area-chart" className="w-full text-black"></div>
      </div>
    </ErrorBoundary>
  );
}
