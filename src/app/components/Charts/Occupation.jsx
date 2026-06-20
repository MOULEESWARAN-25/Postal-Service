import React, { useEffect, useMemo } from "react";
import ApexCharts from "apexcharts";
import useDashboardStore from "@/store/dashboardStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import { APEX_CHART_THEME } from "@/components/ui/chart-custom";

const getChartOptions = (chartData) => {
  return {
    ...APEX_CHART_THEME,
    series: chartData.series,
    chart: {
      ...APEX_CHART_THEME.chart,
      height: 250, // Standard height matching other cards
      width: "100%",
      type: "pie",
    },
    stroke: {
      colors: ["var(--color-surface)"],
      width: 2,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -15,
        },
      },
    },
    labels: chartData.labels,
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "10px",
        fontFamily: "Inter, sans-serif",
      },
    },
    tooltip: {
      ...APEX_CHART_THEME.tooltip,
      y: {
        formatter: (val) => `${val.toFixed(1)}%`,
      },
    },
  };
};

export default function Occupation() {
  const { demographicData } = useDashboardStore();

  // Calculate percentages
  const chartData = useMemo(() => {
    const workingMale = demographicData?.totWorkM || 0;
    const workingFemale = demographicData?.totWorkF || 0;
    const nonWorkingMale = demographicData?.nonWorkM || 0;
    const nonWorkingFemale = demographicData?.nonWorkF || 0;
    
    const totalPopulation = workingMale + workingFemale + nonWorkingMale + nonWorkingFemale;

    // Prevent division by zero
    if (totalPopulation === 0) {
      return {
        series: [25, 25, 25, 25],
        labels: ['Working Men', 'Non-Working Men', 'Working Women', 'Non-Working Women']
      };
    }

    // Calculate percentages
    const series = [
      ((workingMale / totalPopulation) * 100).toFixed(1),
      ((nonWorkingMale / totalPopulation) * 100).toFixed(1),
      ((workingFemale / totalPopulation) * 100).toFixed(1),
      ((nonWorkingFemale / totalPopulation) * 100).toFixed(1)
    ].map(Number);

    return {
      series,
      labels: ['Working Men', 'Non-Working Men', 'Working Women', 'Non-Working Women']
    };
  }, [demographicData]);

  useEffect(() => {
    let chart;
    if (document.getElementById("pie-chart") && typeof ApexCharts !== "undefined") {
      chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions(chartData));
      chart.render();
    }
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartData]); // Depend on chartData to re-render when data changes

  return (
    <ErrorBoundary>
      <div className="w-full h-full flex items-center justify-center">
        <div id="pie-chart" style={{ height: "320px", width: "100%" }}></div>
      </div>
    </ErrorBoundary>
  );
}