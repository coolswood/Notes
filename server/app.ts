import fastify from 'fastify';
import cookie, {FastifyCookieOptions} from '@fastify/cookie';
import cors from '@fastify/cors';
import {initDb} from "./db";

const app = fastify({logger: true});

const hours_3 = 1000 * 60 * 60 * 3;

app.register(cookie, {
    secret: "my-secret",
    parseOptions: {}
} as FastifyCookieOptions)

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
});

app.put<{ Body: { user: string }; Reply: {} }>("/api/create", async (request, reply) => {
    const user = request.body.user;

    const db = await initDb()

    await db('userName').insert({user});

    const data = await db('userName').select(['user']);

    reply.cookie('user', user, {maxAge: hours_3});

    return true;
});

app.get<{ Body: api.getTickets.request; Reply: api.getTickets.response }>("/api/tickets", async (request, reply) => {
    const user = request.cookies.user;

    if(user == undefined) {
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
        }

        return acc;
    }, {}));
});

app.put<{ Body: api.putTicket.request; Reply: api.putTicket.response }>("/api/ticket", async (request, reply) => {
    const user = request.cookies.user;
    const {id, text, screenY, screenX} = request.body;

    const db = await initDb()

    await db('userData').insert({
        id, text, screenY, screenX, user
    });

    return reply.send({});
});

app.patch<{ Body: api.patchTicket.request; Reply: api.patchTicket.response }>("/api/ticket", async (request, reply) => {
    const {id, text, screenY, screenX} = request.body;

    const db = await initDb()

    await db('userData').where({id}).update({
        text, screenY, screenX
    });

    return reply.send({});
});

(async () => {
    try {
        await app.listen({port: 3001})
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();
