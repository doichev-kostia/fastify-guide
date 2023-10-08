import { type FastifyServerOptions } from "fastify";
import { loggerOptions } from "./logger-options.js";

export const options = {
	ajv: {
		customOptions: {
			removeAdditional: 'all'
		}
	},
	disableRequestLogging: true,
	logger: loggerOptions,
} satisfies FastifyServerOptions;

