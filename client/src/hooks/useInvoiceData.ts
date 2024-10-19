import { useState, useEffect } from 'react';
import { fetchInvoices } from '../services/invoiceService';

export const useInvoiceData = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      const result = await fetchInvoices();
      setInvoices(result);
      setLoading(false);
    };

    loadInvoices();
  }, []);

  return { invoices, loading };
};
