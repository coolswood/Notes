import fastify from 'fastify';
import cookie, {FastifyCookieOptions} from '@fastify/cookie';
import cors from '@fastify/cors';
import {initDb} from "./db";

const app = fastify({ logger: true });

const hours_3 = 1000 * 60 * 60 * 3;

app.register(cookie, {
    secret: "my-secret",
    parseOptions: {

    }
} as FastifyCookieOptions )

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

    console.log(data)
    return true;
});

app.get<{ Body: {}; Reply: {} }>("/api/tickets", async (request, reply) => {
    const user = request.cookies.user;

    const db = await initDb();

    const data = await db('userData').select('*');

    return data;
});

app.put<{ Body: { text: string; screenY: string; screenX: string }; Reply: {} }>("/api/ticket", async (request, reply) => {
    const user = request.cookies.user;
    const {text, screenY, screenX} = request.body;

    const db = await initDb()

    await db('userData').insert({
        text, screenY, screenX, user
    });

    const data = await db('userData').select('*');

    return data;
});

(async () => {
    try {
        await app.listen({ port: 3001 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();
