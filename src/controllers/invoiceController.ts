import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import pdfParse from 'pdf-parse';

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

export const uploadInvoice = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ error: 'No file uploaded' });
  }

  const buffer = await data.toBuffer();

  try {
    const parsedPDF = await pdfParse(buffer);
    const extractedText = parsedPDF.text;

    const clientNumber = extractClientNumber(extractedText);
    const referenceMonth = extractReferenceMonth(extractedText);
    const energyKwh = extractEnergyKwh(extractedText);
    const energySCEE = extractEnergySCEE(extractedText);
    const compensatedEnergy = extractCompensatedEnergy(extractedText);

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
    reply.status(500).send({ error: 'Failed to upload and process invoice' });
  }
};

const extractClientNumber = (text: string): string => {
  return '123456';
};

const extractReferenceMonth = (text: string): string => {
  return '2024-10';
};

const extractEnergyKwh = (text: string): number => {
  return 450.2;
};

const extractEnergySCEE = (text: string): number => {
  return 300.1;
};

const extractCompensatedEnergy = (text: string): number => {
  return 150.0;
};
