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

type frontMessages =
  | api.swMessage.getTickets.frontMessage
  | api.swMessage.putTicket.frontMessage
  | api.swMessage.patchTicket.frontMessage;

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
        const message: frontMessages = JSON.parse(m.toString());

        const db = await initDb();

        if (message.event === 'PUT_TICKET') {
          const { id, screenY, screenX, text, color } = message.data;

          await db('userData').insert({
            id,
            screenY,
            screenX,
            user,
            text,
            color,
          });
        }

        if (message.event === 'PATCH_TICKET') {
          const { id, text, screenY, screenX } = message.data;

          await db('userData').where({ id }).update({
            text,
            screenY,
            screenX,
          });
        }

        const data = await db('userData').select('*');

        const tickets = data.reduce<api.swMessage.getTickets.backMessage>(
          (acc, i) => {
            acc[i.id] = {
              text: i.text,
              screenY: i.screenY,
              screenX: i.screenX,
              user: i.user,
              color: i.color,
            };

            return acc;
          },
          {}
        );

        const allTickets = JSON.stringify(tickets);

        fastify.websocketServer.clients.forEach(function each(client) {
          if (client.readyState === 1) {
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
