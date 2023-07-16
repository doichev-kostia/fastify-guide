import fp from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";

export default fp(async function mongoDataSource(fastify, opts) {
	await fastify.register(fastifyMongodb, opts.mongo )
	fastify.mongo.client.on("commandStarted", (command) => {
		fastify.log.debug(command)
	})
}, {
	name: "mongo-data-source",
})


