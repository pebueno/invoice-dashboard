import { FastifyInstance } from 'fastify';
import { createInvoice, getInvoices, uploadInvoice, getEnergyConsumption, getFinancialResults } from '../controllers/invoiceController';

async function invoiceRoutes(fastify: FastifyInstance) {
  fastify.post('/invoices', createInvoice);
  fastify.get('/invoices', getInvoices);
  fastify.post('/upload-invoice', uploadInvoice);
  fastify.get('/invoices/energy-consumption', getEnergyConsumption);
  fastify.get('/invoices/financial-results', getFinancialResults);
}

export default invoiceRoutes;
