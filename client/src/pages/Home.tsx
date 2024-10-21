import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchInvoices } from "../services/invoiceService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = () => {
  const [energyData, setEnergyData] = useState<number[]>([]);
  const [amountData, setAmountData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]); // To store client numbers
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const invoices = await fetchInvoices();
        const energy = invoices.map((invoice: any) => invoice.energyKwh + invoice.energySCEE);
        const amount = invoices.map((invoice: any) => invoice.amountToPay);
        const months = invoices.map((invoice: any) => invoice.referenceMonth);
        const clientNumbers = invoices.map((invoice: any) => invoice.clientNumber);

        setEnergyData(energy);
        setAmountData(amount);
        setLabels(months);
        setClients(clientNumbers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Consumo de Energia (kWh)",
        data: energyData,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Valor Pago (R$)",
        data: amountData,
        borderColor: "rgba(153,102,255,1)",
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

  const totalEnergy = energyData.reduce((sum, value) => sum + value, 0);
  const totalAmountPaid = amountData.reduce((sum, value) => sum + value, 0);
  const averageCost = totalEnergy ? totalAmountPaid / totalEnergy : 0;

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <Container sx={{ marginTop: "6rem" }}>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-lg p-4">
            <h2 className="text-lg font-semibold">Energia Total (kWh)</h2>
            <p>{totalEnergy.toFixed(2)} kWh</p>
          </div>
          <div className="bg-white shadow-lg p-4">
            <h2 className="text-lg font-semibold">Valor Total Pago (R$)</h2>
            <p>R$ {totalAmountPaid.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow-lg p-4">
            <h2 className="text-lg font-semibold">Custo Médio (R$/kWh)</h2>
            <p>R$ {averageCost.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ marginBottom: "4rem" }}>
          <Line data={data} options={options} id="chartId" />
        </div>

        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número do Cliente</TableCell>
                <TableCell>Mês</TableCell>
                <TableCell align="right">Consumo de Energia (kWh)</TableCell>
                <TableCell align="right">Valor Pago (R$)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {labels.map((month, index) => (
                <TableRow key={month}>
                  <TableCell>{clients[index]}</TableCell>
                  <TableCell>{month}</TableCell>
                  <TableCell align="right">{energyData[index].toFixed(2)}</TableCell>
                  <TableCell align="right">R$ {amountData[index].toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default Home;
