import React, { useRef, useEffect } from "react";
import ApexCharts from "apexcharts";
import { APEX_CHART_THEME } from "@/components/ui/chart-custom";

export default function SuccessRateChart({ scheme }) {
  const generatedId = React.useId();
  const chartId = `donut-chart-${scheme.id || generatedId.replace(/:/g, "")}`;
  const series1 = scheme.successRate || 0;
  const series2 = 100 - series1;

  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    const series1 = scheme.successRate || 0;
    const series2 = 100 - series1;
    const options = {
      ...APEX_CHART_THEME,
      series: [series1, series2],
      chart: {
        ...APEX_CHART_THEME.chart,
        height: 200,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["var(--color-surface)"],
        width: 2,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: false,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    };

    if (chartRef.current) {
      chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [scheme]);

  return (
    <div className="w-full h-full  rounded-lg shadow-md flex items-center bg-white">
      <div
        ref={chartRef}
        id={chartId}
        aria-label="Success Rate Donut Chart"
      ></div>
      <div>
        <div className="flex flex-col   gap-4 mb-2">
          <h2 className="text-2xl font-semibold text-purple-800">Scheme</h2>
          <h6 className="text-xl font-bold text-black flex font-poppins ">
            {scheme.name}
          </h6>
        </div>
        <div className="flex flex-col  gap-5 ">
          <h2 className="text-2xl font-semibold text-purple-800">
            Success Rate
          </h2>
          <h1 className="text-4xl font-bold text-black flex font-poppins ">
            {scheme.successRate}%
          </h1>
        </div>
      </div>
    </div>
  );
}
