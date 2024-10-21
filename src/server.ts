import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { connectDB } from './db/connection';
import invoiceRoutes from './routes/invoiceRoutes';

const fastify = Fastify({ logger: true });

connectDB();

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(multipart);

fastify.register(invoiceRoutes, { prefix: '/api' });

fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Backend is running!' });
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
