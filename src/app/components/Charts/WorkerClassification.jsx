"use client";
import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import useDashboardStore from '@/store/dashboardStore';

const options = {
  chart: {
    type: 'bar',
    height: '100%',
    width: "110%",
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
  colors: ['#1C64F2', '#E74694'],
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
    borderColor: '#e0e0e0',
    strokeDashArray: 4,
  },
};

export default function WorkerClassification() {
  const chartRef = useRef(null);
  const { demographicData } = useDashboardStore();

  const totalworkingPopulation = demographicData?.totWorkP || 0;
  
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

  // Helper function to calculate percentages
  const calculatePercentage = (part, total) => {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  };

  useEffect(() => {
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
    <div className="flex-col w-full h-full  items-center justify-between p-2">
      <div ref={chartRef} id="bar-chart" className='w-full border h-full text-black'></div>
    </div>
  );
}
