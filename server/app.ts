import fastify from 'fastify';
import cookie, {FastifyCookieOptions} from '@fastify/cookie';
import cors from '@fastify/cors';
import {initDb} from "./db";

const app = fastify({ logger: true });

app.register(cookie, {
    secret: "my-secret",
    parseOptions: {}
} as FastifyCookieOptions )

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
});

app.put<{ Body: { name: string }; Reply: {} }>("/api/create", async (request, reply) => {
    const name = request.body.name;

    const db = await initDb()

    await db('userData').insert({name});

    const data = await db('userData').select(['name']);

    reply.cookie('user', name);

    console.log(data)
    return true;
});

app.get<{ Body: {}; Reply: {} }>("/api/tickets", async (request, reply) => {
    console.log(request.cookies.user)
    // const name = request.body.name;
    //
    // const db = await initDb()
    //
    // await db('userData').insert({name});
    //
    // const data = await db('userData').select(['name']);
    //
    // reply.cookie('user', name);
    //
    // console.log(data)
    return true;
});

(async () => {
    try {
        await app.listen({ port: 3001 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();
