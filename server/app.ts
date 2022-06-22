import fastify, {FastifyRequest} from 'fastify';
import cookie, {FastifyCookieOptions} from '@fastify/cookie';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import {initDb} from "./db";

const app = fastify({logger: true});

const hours_3 = 1000 * 60 * 60 * 3;

app.register(cookie, {
    parseOptions: {
        sameSite: true,
        path: '/',
    }
} as FastifyCookieOptions)

app.register(websocket)

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
});

app.register(async function (fastify) {
    fastify.get('/ws', {websocket: true}, (connection /* SocketStream */, req: FastifyRequest<{
        Querystring: { user: string }
    }>) => {
        connection.socket.on('message', async (m: Buffer) => {
            const message = JSON.parse(m.toString());

            const db = await initDb();

            if (message.event === 'getTickets') {
                const user = req.query.user;
                const data = await db('userData').select('*');

                const tickets = data.reduce<api.getTickets.response>((acc, i) => {
                    acc[i.id] = {
                        text: i.text,
                        screenY: i.screenY,
                        screenX: i.screenX,
                        canEdit: i.user === user,
                        user: i.user !== user ? user : undefined
                    }

                    return acc;
                }, {});

                connection.socket.send(JSON.stringify(tickets));
            }

            if(message.event === 'create') {
                const user = req.query.user;
                const {id, screenY, screenX} = message.data;

                await db('userData').insert({
                    id, screenY, screenX, user
                });
            }

            if(message.event === 'update') {
                const {id, text, screenY, screenX} = message.data;

                await db('userData').where({id}).update({
                    text, screenY, screenX
                });
            }

            const user = req.query.user;

            const data = await db('userData').select('*');

            const tickets = data.reduce<api.getTickets.response>((acc, i) => {
                acc[i.id] = {
                    text: i.text,
                    screenY: i.screenY,
                    screenX: i.screenX,
                    canEdit: i.user === user,
                    user: i.user !== user ? user : undefined
                }

                return acc;
            }, {});

            const allTickets = JSON.stringify(tickets);

            fastify.websocketServer.clients.forEach(async function each(client: any) {
                if (client.readyState === 1) {
                    connection.socket.send(allTickets);
                }
            })
        })
    })
})

app.put<{ Body: { user: string }; Reply: {} }>("/api/create", async (request, reply) => {
    const user = request.body.user;

    const db = await initDb()

    await db('userName').insert({user});

    const data = await db('userName').select(['user']);

    reply.setCookie('user', user, {maxAge: hours_3});

    return true;
});

app.get<{ Body: api.getTickets.request; Reply: api.getTickets.response }>("/api/tickets", async (request, reply) => {
    const user = request.cookies.user;

    if (user == undefined) {
        return reply.status(401).send();
    }

    const db = await initDb();

    const data = await db('userData').select('*');

    return reply.send(data.reduce<api.getTickets.response>((acc, i) => {

        acc[i.id] = {
            text: i.text,
            screenY: i.screenY,
            screenX: i.screenX,
            canEdit: i.user === user,
            user: i.user !== user ? user : undefined
        }

        return acc;
    }, {}));
});

(async () => {
    try {
        await app.listen({port: 3001})
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();
