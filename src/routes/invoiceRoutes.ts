import { FastifyInstance } from 'fastify';
import { createInvoice, getInvoices } from '../controllers/invoiceController';

async function invoiceRoutes(fastify: FastifyInstance) {
  fastify.post('/invoices', createInvoice);
  fastify.get('/invoices', getInvoices);
}

export default invoiceRoutes;
