import * as url from "url";
import { globby } from "globby";
import fp from "fastify-plugin";

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

const schemas = await globby(`${currentDirectory}/**/*.schema.(js|ts)`, {
	absolute: true,
});

export default fp(async function schemaLoader(fastify, options) {
	fastify.log.info("Loading query schemas");
	for (const schema of schemas) {
		const module = await import(schema);
		fastify.addSchema(module.default);
	}
	fastify.log.info("Loaded query schemas");
})
