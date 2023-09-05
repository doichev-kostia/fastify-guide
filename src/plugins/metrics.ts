import fp from "fastify-plugin";

export default fp(async function metrics(fastify, options) {
	// fastify.register(fastifyMetrics as any, {
	// 	defaultMetrics: { enabled: true },
	// 	endpoint: null,
	// 	name: "metrics",
	// 	routeMetrics: { enabled: true },
	// 	clearRegisterOnInit: false,
	// } satisfies IMetricsPluginOptions);
	//
	// const promServer = Fastify({
	// 	logger: fastify.log,
	// });
	//
	// promServer.route({
	// 	method: "GET",
	// 	url: "/metrics",
	// 	logLevel: "info",
	// 	handler: async function metricsHandler(request, reply) {
	// 		reply.type("text/plain");
	// 		return fastify.metrics.client.register.metrics();
	// 	},
	// });
	//
	// fastify.addHook("onClose", async (instance) => {
	// 	await promServer.close();
	// });
	//
	// await promServer.listen({
	// 	host: "0.0.0.0",
	// 	port: 9001,
	// });
}, { name: "prom" });
