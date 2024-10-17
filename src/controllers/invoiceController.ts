import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

const prisma = new PrismaClient();

export const createInvoice = async (request: FastifyRequest, reply: FastifyReply) => {
  const { clientNumber, referenceMonth, energyKwh, energySCEE, compensatedEnergy } = request.body as any;

  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        clientNumber,
        referenceMonth,
        energyKwh,
        energySCEE,
        compensatedEnergy,
      },
    });

    reply.status(201).send(newInvoice);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create invoice' });
  }
};

export const getInvoices = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const invoices = await prisma.invoice.findMany();
    reply.status(200).send(invoices);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch invoices' });
  }
};
