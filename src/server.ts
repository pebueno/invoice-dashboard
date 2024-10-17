import Fastify from 'fastify';
import { connectDB } from './db/connection';

const fastify = Fastify({ logger: true });

connectDB();

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
