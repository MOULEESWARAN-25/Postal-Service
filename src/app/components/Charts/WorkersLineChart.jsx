import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

export default function WorkersLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      chart: {
        height: '300',
        width: '400',
        type: 'line',
        fontFamily: 'Inter, sans-serif',
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
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
        curve: 'smooth',
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -26,
        },
      },
      xaxis: {
        categories: ['Cultivators', 'Household Industries', 'Other Workers'],
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
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
        labels: {
          style: {
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      series: [
        {
          name: 'Males',
          data: [300, 120, 500],
          color: '#1A56DB',
        },
        {
          name: 'Females',
          data: [150, 200, 450],
          color: '#7E3AF2',
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div ref={chartRef} style={{ height: '100%' }} />;
}
