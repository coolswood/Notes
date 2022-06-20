import fastify from 'fastify';

const app = fastify({ logger: true });

app.route({
    method: 'GET',
    url: '/',
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

(async () => {
    try {
        await app.listen({ port: 3001 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})();
