import React, { useEffect, useState } from "react";
import { fetchInvoices } from "../services/invoiceService";
import { InvoiceType } from "../components/common/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import Container from "@mui/material/Container";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const Invoices = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const result = await fetchInvoices();
        setInvoices(result);
        setFilteredInvoices(result);
      } catch (error) {
        console.error("Erro ao buscar faturas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = invoices.filter((invoice) =>
      invoice.clientNumber.includes(value)
    );
    setFilteredInvoices(filtered);
  };

  if (loading) {
    return <p>Carregando faturas...</p>;
  }

  const groupByClientNumber = (invoices: InvoiceType[]) => {
    const grouped = invoices.reduce((acc, curr) => {
      if (!acc[curr.clientNumber]) {
        acc[curr.clientNumber] = Array(12).fill(null);
      }
      const monthIndex = new Date(curr.referenceMonth).getMonth();
      acc[curr.clientNumber][monthIndex] = curr;
      return acc;
    }, {} as { [key: string]: (InvoiceType | null)[] });

    return grouped;
  };

  const groupedInvoices = groupByClientNumber(filteredInvoices);

  return (
    <Container sx={{ marginTop: "6rem" }}>
      <h2>Faturas</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <TextField
          label="Buscar por Número do Cliente"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número do Cliente</TableCell>
              <TableCell align="center">Jan</TableCell>
              <TableCell align="center">Fev</TableCell>
              <TableCell align="center">Mar</TableCell>
              <TableCell align="center">Abr</TableCell>
              <TableCell align="center">Mai</TableCell>
              <TableCell align="center">Jun</TableCell>
              <TableCell align="center">Jul</TableCell>
              <TableCell align="center">Ago</TableCell>
              <TableCell align="center">Set</TableCell>
              <TableCell align="center">Out</TableCell>
              <TableCell align="center">Nov</TableCell>
              <TableCell align="center">Dez</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedInvoices).map((clientNumber) => (
              <TableRow key={clientNumber}>
                <TableCell>{clientNumber}</TableCell>
                {groupedInvoices[clientNumber].map((invoice, index) => (
                  <TableCell align="center" key={index}>
                    {invoice ? (
                      <IconButton
                        href={`http://localhost:3000/api/download/${invoice.clientNumber}/${invoice.referenceMonth}`}
                        aria-label="Baixar Fatura"
                        color="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InsertDriveFileIcon />
                      </IconButton>
                    ) : (
                      <InsertDriveFileIcon style={{ opacity: 0.2 }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Invoices;
