import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import pdfParse from "pdf-parse";

const prisma = new PrismaClient();

export const createInvoice = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    clientNumber,
    installationNumber,
    referenceMonth,
    dueDate,
    emissionDate,
    amountToPay,
    energyKwh,
    energySCEE,
    compensatedEnergy,
  } = request.body as any;

  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        clientNumber,
        installationNumber,
        referenceMonth,
        dueDate,
        emissionDate,
        amountToPay,
        energyKwh,
        energySCEE,
        compensatedEnergy,
      },
    });

    reply.status(201).send(newInvoice);
  } catch (error) {
    reply.status(500).send({ error: "Failed to create invoice" });
  }
};

export const getInvoices = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const invoices = await prisma.invoice.findMany();
    reply.status(200).send(invoices);
  } catch (error) {
    reply.status(500).send({ error: "Failed to fetch invoices" });
  }
};

export const uploadInvoice = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const files = await request.files();

  if (!files) {
    return reply.status(400).send({ error: "No files uploaded" });
  }

  const invoiceResults = [];

  try {
    for await (const file of files) {
      const buffer = await file.toBuffer();
      const parsedPDF = await pdfParse(buffer);
      let extractedText = parsedPDF.text;

      console.log("Extracted PDF Text:\n", extractedText);

      const invoiceData = extractInvoiceData(extractedText);

      const newInvoice = await prisma.invoice.create({
        data: {
          clientNumber: invoiceData.clientNumber,
          installationNumber: invoiceData.installationNumber,
          referenceMonth: invoiceData.referenceMonth,
          dueDate: invoiceData.dueDate,
          emissionDate: invoiceData.emissionDate,
          amountToPay: invoiceData.amountToPay,
          energyKwh: invoiceData.energyData.electricity.quantity,
          energyKwhValue: invoiceData.energyData.electricity.value,
          energySCEE: invoiceData.energyData.energySCEE.quantity,
          energySCEEValue: invoiceData.energyData.energySCEE.value,
          compensatedEnergy: invoiceData.energyData.compensatedEnergy.quantity,
          compensatedEnergyValue: invoiceData.energyData.compensatedEnergy.value,
        },
      });

      invoiceResults.push(newInvoice);
    }

    reply.status(201).send(invoiceResults);
  } catch (error) {
    console.error("Error uploading invoice:", error);
    reply.status(500).send({ error: "Failed to upload and process invoices" });
  }
};
// Consolidate all data extraction into a single function
const extractInvoiceData = (text: string) => {
  return {
    clientNumber: extractData(text, /Nº\s+DO\s+CLIENTE[\s\S]*?(\d{10})/, "Cliente Desconhecido"),
    installationNumber: extractData(text, /Nº\s+DA\s+INSTALAÇÃO[\s\S]*?\d{10}[\s\S]*?(\d{10})/, "Installation Number Not Found"),
    referenceMonth: extractData(text, /Referente\s*a[\s\S]*?([A-Z]{3}\/\d{4})/, "Mês de Referência Desconhecido"),
    dueDate: extractData(text, /Vencimento[\s\S]*?(\d{2}\/\d{2}\/\d{4})/, "Vencimento Desconhecido"),
    amountToPay: extractAmountToPay(text),
    emissionDate: extractData(text, /Data\s+de\s+emissão:\s*(\d{2}\/\d{2}\/\d{4})/, "Emission Date Not Found"),
    energyData: extractEnergyData(text),
  };
};

// Reusable function to extract matched data from the text using regex
const extractData = (text: string, regex: RegExp, defaultValue: string): string => {
  const match = text.match(regex);
  return match ? match[1] : defaultValue;
};

const extractAmountToPay = (text: string): number => {
  const match = text.match(/R\$\s*([\d.,]+)/);
  return match ? parseFloat(match[1].replace(".", "").replace(",", ".")) : 0;
};

// Extract energy data (quantity and value for electricity, energy SCEE, compensated energy)
const extractEnergyData = (text: string): any => {
  return {
    electricity: extractEnergyBlock(text, /Energia Elétrica.*?kWh\s+(\d+)\s+([\d,]+)/),
    energySCEE: extractEnergyBlock(text, /Energia\s+SCEE.*?kWh\s+(\d{1,3}(?:\.\d{3})*|\d+)\s+([\d,]+)/),
    compensatedEnergy: extractEnergyBlock(text, /Energia\s+compensada.*?kWh\s+(\d{1,3}(?:\.\d{3})*)\s+([\d,]+)/),
  };
};

// Extract energy block (quantity and value)
const extractEnergyBlock = (
  text: string,
  regex: RegExp
): { quantity: number; value: number } => {
  const match = text.match(regex);
  if (match) {
    return {
      quantity: parseFloat(match[1]),
      value: parseFloat(match[2].replace(",", ".")),
    };
  }
  return { quantity: 0, value: 0 };
};

export const getEnergyConsumption = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const energyData = await prisma.invoice.findMany({
      select: {
        referenceMonth: true,
        energyKwh: true,
        energySCEE: true,
        compensatedEnergy: true,
      },
    });

    const processedData = energyData.map(invoice => ({
      month: invoice.referenceMonth,
      totalEnergyKwh: invoice.energyKwh + invoice.energySCEE,
      compensatedEnergy: invoice.compensatedEnergy
    }));

    reply.status(200).send(processedData);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch energy consumption data' });
  }
};

export const getFinancialResults = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const financialData = await prisma.invoice.findMany({
      select: {
        referenceMonth: true,
        amountToPay: true,
      },
    });

    const processedData = financialData.map(invoice => ({
      month: invoice.referenceMonth,
      totalPaid: invoice.amountToPay,
    }));

    reply.status(200).send(processedData);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch financial results' });
  }
};