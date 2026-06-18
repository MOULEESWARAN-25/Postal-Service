"use client";
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import useDashboardStore from '@/store/dashboardStore';
import ErrorBoundary from "@/components/ErrorBoundary";

const options = {
  chart: {
    type: 'bar',
    height: '100%',
    width: "100%",
    toolbar: {
      show: false,
    },
    stacked: false,
  },
  series: [
    {
      name: 'Main Workers',
      data: [], // To be filled dynamically
    },
    {
      name: 'Marginalized Workers',
      data: [], // To be filled dynamically
    },
  ],
  xaxis: {
    categories: ['Cultivators', 'Agricultural Laborers', 'Household Industries', 'Other Workers'],
  },
  yaxis: {
    title: {
      text: 'Percentage of Workers (%)',
    },
    min: 0,
    max: 100,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%',
      borderRadiusApplication: "end",
      borderRadius: 10,
    },
  },
  colors: ['#1A2B4A', '#C8102E'],
  legend: {
    position: 'top',
  },
  dataLabels: {
    enabled: false,
    formatter: (val) => `${val}%`, // Format as percentage
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    y: {
      formatter: (val) => `${val}%`, // Show percentage in tooltip
    },
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    padding: {
      left: 20,
      right: 20,
      top: 10,
      bottom: 10,
    },
  },
};

const calculatePercentage = (part, total) => {
  return total > 0 ? Math.round((part / total) * 100) : 0;
};

export default function WorkerClassification() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();

  useEffect(() => {
    const totalMainWorkers = demographicData?.mainworkP || 0;
    const mainCultivators = demographicData?.mainClP || 0;
    const mainAgriculturalLaborers = demographicData?.mainAlP || 0;
    const mainHouseholdIndustries = demographicData?.mainHhP || 0;
    const mainOtherWorkers = demographicData?.mainOtP || 0;

    const totalMarginalizedWorkers = demographicData?.margworkP || 0;
    const marginalizedCultivators = demographicData?.margClP || 0;
    const marginalizedAgriculturalLaborers = demographicData?.margAlP || 0;
    const marginalizedHouseholdIndustries = demographicData?.margHhP || 0;
    const marginalizedOtherWorkers = demographicData?.margOtP || 0;

    // Calculate the percentages
    const mainWorkersPercentage = [
      calculatePercentage(mainCultivators, totalMainWorkers),
      calculatePercentage(mainAgriculturalLaborers, totalMainWorkers),
      calculatePercentage(mainHouseholdIndustries, totalMainWorkers),
      calculatePercentage(mainOtherWorkers, totalMainWorkers),
    ];

    const marginalizedWorkersPercentage = [
      calculatePercentage(marginalizedCultivators, totalMarginalizedWorkers),
      calculatePercentage(marginalizedAgriculturalLaborers, totalMarginalizedWorkers),
      calculatePercentage(marginalizedHouseholdIndustries, totalMarginalizedWorkers),
      calculatePercentage(marginalizedOtherWorkers, totalMarginalizedWorkers),
    ];

    // Update the chart data dynamically
    options.series[0].data = mainWorkersPercentage;
    options.series[1].data = marginalizedWorkersPercentage;

    let chart;
    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [demographicData]);

  return (
    <ErrorBoundary>
      <div className="w-full h-full flex items-center justify-center p-2">
        <div ref={chartRef} id="bar-chart" className="w-full h-full text-black"></div>
      </div>
    </ErrorBoundary>
  );
}
