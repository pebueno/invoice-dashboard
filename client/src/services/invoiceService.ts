import axios from 'axios';

export const fetchInvoices = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const uploadInvoices = async (formData: FormData) => {
  try {
    const response = await axios.post('http://localhost:3000/api/upload-invoice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading invoices:', error);
    return null;
  }
};
