import * as url from "url";
import fp from "fastify-plugin";
import { globby } from "globby";

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

const schemas = await globby(`${currentDirectory}/**/*.json`, {
	absolute: true,
});

export default fp(async function schemaLoader(fastify, options) {
	fastify.log.info("Loading params schemas");
	for (const schema of schemas) {
		fastify.addSchema(await import(schema));
	}
	fastify.log.info("Loaded params schemas");
})
