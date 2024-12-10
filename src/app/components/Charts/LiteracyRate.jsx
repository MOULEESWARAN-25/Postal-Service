import React,{useRef,useEffect} from 'react'
import ApexCharts from 'apexcharts'


const options = {
      series: [64.23,36.07],
      colors: ["#0077B6", "#90E0EF"],
      chart: {
        height:250,
        width: "80%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontsize:"12px",
                fontFamily: "Poppins, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Literacy Rate",
                fontFamily: "Poppins, sans-serif",
              },
              value: {
                show: false,
                fontFamily: "Poppins, sans-serif",
              },
            },
            size: "75%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Male", "Female"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "%"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "%"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
    
    export default function LiteracyRate() {
        const chartRef = useRef(null);
        
        useEffect(() => {
          let chart; // Declare chart here for access in cleanup
          
          if (chartRef.current) {
            chart = new ApexCharts(chartRef.current, options);
            chart.render();
          }
          
          return () => {
            if (chart) {
              chart.destroy();
            }
          };
        }, []); 
      
        return (
          <div className="flex flex-col justify-between">
            <div ref={chartRef} id="donut-chart"></div>
          </div>
        );
    }
    
      