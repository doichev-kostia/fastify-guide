import fp from "fastify-plugin";
import { type SerializedProperties } from "../configs/logger-options.js";

type Properties =Partial<Record<SerializedProperties, any>>

export default fp(async function errorHandler(fastify, options): Promise<void> {
	fastify.addHook('onRequest', async (req) => {
		req.log.info({ req } satisfies Properties, 'incoming request');
	});

	fastify.addHook('onResponse', async (request, reply) => {
		request.log.info({ req: request, res: reply } satisfies Properties, 'request completed');
	})

	fastify.setErrorHandler((error, request, reply) => {
		if (reply.statusCode >= 500) {
			request.log.error({ request, reply, error }, error?.message);
			reply.send(
				`Fatal error. Contact the support team. Id: ${request.id}`,
			);
			return;
		}

		request.log.info({ request, reply, error }, error?.message);
		reply.send(error);
	});
}, {
	name: "error-handler",
});
