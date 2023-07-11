import { FastifyInstance } from "fastify";
import AutoLoad from "@fastify/autoload";
import * as url from "node:url";
import * as path from "node:path";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function app(fastify: FastifyInstance, options: Record<any, any>) {
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'schemas'),
		indexPattern: /loader\.(js|ts)$/,
	});

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'plugins'),
		dirNameRoutePrefix: false,
		ignorePattern: /.*.no-load\.(js|ts)$/,
		indexPattern: /^no$/i,
		options: Object.assign({}, options)
	})

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, 'routes'),
		// indexPattern: /.*routes(\.js|\.ts)$/i,
		// ignorePattern: /.*(\.js|\.ts)$/i,
		// autoHooksPattern: /.*hooks(\.js|\.ts)$/i,
		// autoHooks: true,
		// cascadeHooks: true,
		options: Object.assign({}, options)
	})
}


export default app;
