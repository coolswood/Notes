import fastify from 'fastify';
import cors from '@fastify/cors';
import {sqlite} from "./db";

const app = fastify({ logger: true });

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
});

app.route({
    method: 'GET',
    url: '/api/test',
    schema: {
        querystring: {
            name: { type: 'string' }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' }
                }
            }
        }
    },
    // this function is executed for every request before the handler is executed
    preHandler: async (request, reply) => {
        // E.g. check authentication
    },
    handler: async (request, reply) => {

        return { hello: 'world' }
    }
});

app.put<{ Body: { name: string }; Reply: {} }>("/api/create", async (request, reply) => {
    const name = request.body.name

    const data = await sqlite('userData').select(['name']);
    console.log(data)
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
