import fp from "fastify-plugin";

export default fp(async function errorHandler(fastify, options): Promise<void> {
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
