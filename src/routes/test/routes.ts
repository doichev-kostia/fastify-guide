import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function testRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
	console.log(fastify.mongoDataSource)

	fastify.get('/', async function(request, reply){
		console.log(fastify.secrets)
		return { root: true }
	});

}
