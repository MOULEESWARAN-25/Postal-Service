import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const BubbleChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new ApexCharts(chartRef.current, {
      chart: {
        height: '100%',
        type: 'bubble',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      series: [
        { data: [[5, 6, 70]] },
        { data: [[10, 9, 65]] }
      ],
      dataLabels: {
        style: {
          fontSize: '20px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: '400',
          colors: ['#fff', '#1f2937']
        },
        formatter: (value) => (value ? `${value}` : '')
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false
      },
      stroke: {
        width: 5
      },
      plotOptions: {
        bubble: {
          zScaling: false,
          minBubbleRadius: 40
        }
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      },
      xaxis: {
        min: 0,
        max: 15,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        max: 15,
        labels: {
          show: false
        }
      },
      tooltip: {
        enabled: false
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        }
      },
      colors: ['#22d3ee', '#e5e7eb'],
      markers: {
        strokeColors: ['rgb(255, 255, 255)', 'rgb(38, 38, 38)']
      }
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 "></h2>
      <div ref={chartRef} id="hs-bubble-chart" style={{ height: '320px', width: '100%' }}></div>
    </div>
  );
};

export default BubbleChart;
