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
import { useEffect, useState } from 'react';

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

  // Summing up the total values for display
  const totalEnergy = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const totalAmountPaid = data.datasets[1].data.reduce((sum, value) => sum + value, 0);
  const averageCost = totalAmountPaid / totalEnergy;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-lg p-4">
          <h2 className="text-lg font-semibold">Total Energy (kWh)</h2>
          <p>{totalEnergy} kWh</p>
        </div>
        <div className="bg-white shadow-lg p-4">
          <h2 className="text-lg font-semibold">Total Amount Paid (R$)</h2>
          <p>R$ {totalAmountPaid}</p>
        </div>
        <div className="bg-white shadow-lg p-4">
          <h2 className="text-lg font-semibold">Average Cost (R$/kWh)</h2>
          <p>R$ {averageCost.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <Line data={data} options={options} id="chartId" />
      </div>
    </div>
  );
};

export default Dashboard;
