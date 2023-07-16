import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import * as path from "node:path";

export default fp(async function swaggerConfig(fastify, options) {
	const packageJSON =  await import(path.resolve('package.json'), {
		assert: {
			type: 'json'
		}
	});

	const version = packageJSON.version;

	fastify.register(swagger, {
		routePrefix: "/docs",
		exposeRoute: fastify.secrets.NODE_ENV !== "production",
		swagger: {
			info: {
				title: "Fastify API",
				description: "Fastify guide",
				version
			}
		}
	} as swagger.SwaggerOptions)
}, {
	name: "swagger-config",
	dependencies: ["application-configuration"]
})
