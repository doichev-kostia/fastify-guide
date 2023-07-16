import { FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";
import * as url from "node:url";
import * as path from "node:path";
import configLoader from "./configs/config.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function app(fastify: FastifyInstance, options: Record<any, any>) {
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'schemas'),
		indexPattern: /loader\.(js|ts)$/,
	});

	await fastify.register(configLoader);
	fastify.log.info('Config loaded %o', fastify.config);

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
