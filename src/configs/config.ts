import fp from "fastify-plugin";
import fastifyEnv, { FastifyEnvOptions } from "@fastify/env";
import { Schema } from "../schemas/dotenv.js";
import { StatusCodes } from "../constants.js";
import { FastifyMongodbOptions } from "@fastify/mongodb";

declare module "fastify" {
	interface FastifyInstance {
		secrets: Schema;
		config: {
			mongo: FastifyMongodbOptions,
		};
		httpStatus: typeof StatusCodes;
	}
}

export default fp(async function configLoader(fastify, options) {
	await fastify.register(fastifyEnv, {
		confKey: "secrets",
		schema: fastify.getSchema("schema:dotenv"),
	} as FastifyEnvOptions);

	fastify.decorate("config", {
		mongo: {
			forceClose: true,
			url: fastify.secrets.MONGO_URL,
			monitorCommands: true,
		} satisfies FastifyMongodbOptions,
	});

	fastify.decorate("httpStatus", StatusCodes);
}, { name: "application-configuration" });
