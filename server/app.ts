import fastify, { FastifyRequest } from 'fastify';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { initDb } from './db';

const app = fastify({ logger: true });

app.register(cookie, {
  parseOptions: {
    sameSite: true,
    path: '/',
  },
} as FastifyCookieOptions);

app.register(websocket);

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
});

app.register(async function (fastify) {
  fastify.get(
    '/ws',
    { websocket: true },
    (
      connection,
      req: FastifyRequest<{
        Querystring: { user: string };
      }>
    ) => {
      const user = req.query.user;

      connection.socket.on('message', async (m: Buffer) => {
        const message = JSON.parse(m.toString());

        const db = await initDb();

        if (message.event === 'create') {
          const user = req.query.user;
          const { id, screenY, screenX, text } = message.data;

          await db('userData').insert({
            id,
            screenY,
            screenX,
            user,
            text,
          });
        }

        if (message.event === 'update') {
          const { id, text, screenY, screenX } = message.data;

          await db('userData').where({ id }).update({
            text,
            screenY,
            screenX,
          });
        }

        const data = await db('userData').select('*');

        fastify.websocketServer.clients.forEach(function each(client) {
          if (client.readyState === 1) {
            const tickets = data.reduce<api.getTickets.response>((acc, i) => {
              acc[i.id] = {
                text: i.text,
                screenY: i.screenY,
                screenX: i.screenX,
                user: i.user,
              };

              return acc;
            }, {});

            const allTickets = JSON.stringify(tickets);

            client.send(allTickets);
          }
        });
      });
    }
  );
});

app.put<{ Body: api.auth.request; Reply: api.auth.response }>(
  '/api/auth',
  async (request, reply) => {
    const user = request.body.user;

    // This assumes the addition to the database, encryption and other things. But since this is not a condition of the test job,
    // I will just use the username in the cookie

    reply.setCookie('user', user);

    return reply.send({});
  }
);

(async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
