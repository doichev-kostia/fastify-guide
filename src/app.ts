import type { FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";
import * as url from "node:url";
import * as path from "node:path";
import configLoader from "./configs/config.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function app(fastify: FastifyInstance, options: Record<any, any>) {

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(configLoader, Object.assign({}, options));
	fastify.log.info('Config loaded successfully. Keys: %O', Object.keys(fastify.config));

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		dirNameRoutePrefix: false,
		ignorePattern: /.*.no-load\.(js|ts)$/,
		indexPattern: /^no$/i,
		options: fastify.config,
	})

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		indexPattern: /.*routes(\.js|\.ts)$/i,
		ignorePattern: /.*(\.js|\.ts)$/i,
		autoHooksPattern: /.*hooks(\.js|\.ts)$/i,
		autoHooks: true,
		cascadeHooks: true,
		options: Object.assign({}, options)
	})
}


export default app;
