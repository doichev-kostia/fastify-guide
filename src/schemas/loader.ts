import fp from "fastify-plugin";
import { schema } from "./dotenv.js";

export default fp(async function schemaLoader(fastify, options) {
	fastify.log.info("Loading configuration schemas");
	fastify.addSchema(schema);
	fastify.log.info("Loaded configuration schemas");
})

