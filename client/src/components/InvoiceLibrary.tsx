import React, { useEffect, useState } from "react";
import { fetchInvoices } from "../services/invoiceService";
import { InvoiceType } from "./common/types";


const InvoiceLibrary = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      const result = await fetchInvoices();
      setInvoices(result);
      setFilteredInvoices(result);
    };

    loadInvoices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = invoices.filter((invoice) =>
      invoice.clientNumber.includes(value)
    );
    setFilteredInvoices(filtered);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">Invoices</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Client Number"
          className="border rounded p-2 mr-4"
        />
        {/* Filters can be added here */}
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Client Number</th>
            <th className="px-4 py-2 border">Month</th>
            <th className="px-4 py-2 border">Amount (R$)</th>
            <th className="px-4 py-2 border">Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{invoice.clientNumber}</td>
              <td className="px-4 py-2 border">{invoice.referenceMonth}</td>
              <td className="px-4 py-2 border">R$ {invoice.amountToPay}</td>
              <td className="px-4 py-2 border">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceLibrary;
