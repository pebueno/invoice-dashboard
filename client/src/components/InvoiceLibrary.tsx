import React, { useEffect, useState } from "react";
import { fetchInvoices } from "../services/invoiceService";

interface Invoice {
  clientNumber: string;
  referenceMonth: string;
  amountToPay: number;
}

const InvoiceLibrary = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadInvoices = async () => {
      const result = await fetchInvoices();
      setInvoices(result);
    };

    loadInvoices();
  }, []);

  return (
    <div>
      <h2>Invoices</h2>
      <ul>
        {invoices.map((invoice, index) => (
          <li key={index}>
            {invoice.clientNumber} - {invoice.referenceMonth} - R$ {invoice.amountToPay}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceLibrary;
