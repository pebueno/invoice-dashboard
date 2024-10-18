import { FastifyInstance } from 'fastify';
import { createInvoice, getInvoices, uploadInvoice } from '../controllers/invoiceController';

async function invoiceRoutes(fastify: FastifyInstance) {
  fastify.post('/invoices', createInvoice);
  fastify.get('/invoices', getInvoices);
  fastify.post('/upload-invoice', uploadInvoice);
}

export default invoiceRoutes;
