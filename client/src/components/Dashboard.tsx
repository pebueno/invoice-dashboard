import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { useEffect } from 'react';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const Dashboard = () => {
    const data = {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'Energy Consumption (kWh)',
          data: [120, 100, 30, 50],
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
        {
          label: 'Amount Paid (R$)',
          data: [400, 500, 200, 300],
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    useEffect(() => {
      return () => {
        const chart = ChartJS.getChart('chartId'); 
        if (chart) {
          chart.destroy();
        }
      };
    }, []);
  
    return (
      <div>
        <Line data={data} options={options} id="chartId" />
      </div>
    );
  };
  
  export default Dashboard;
  