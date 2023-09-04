import fp from "fastify-plugin";
import fastifyEnv, { type FastifyEnvOptions } from "@fastify/env";
import { type Env } from "../schemas/dotenv.js";
import { StatusCodes } from "../constants.js";
import { type FastifyMongodbOptions } from "@fastify/mongodb";

declare module "fastify" {
	interface FastifyInstance {
		secrets: Env;
		config: {
			mongo: FastifyMongodbOptions,
		};
		httpStatus: typeof StatusCodes;
	}
}

export default fp(async function configLoader(fastify, options) {
	await fastify.register(fastifyEnv, {
		confKey: "secrets",
		data: options.configData,
		schema: {
			"type": "object",
			"$id": "schema:dotenv",
			"required": ["MONGO_URL"],
			"properties": {
				"NODE_ENV": {
					"type": "string",
					"default": "development",
				},
				"PORT": {
					"type": "integer",
					"default": "3000",
				},
				"MONGO_URL": {
					"type": "string",
				},
				"JWT_SECRET": {
					"type": "string",
				},
				"JWT_EXPIRES_IN": {
					"type": "string",
					"default": "1h",
				},
			},
		},
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
