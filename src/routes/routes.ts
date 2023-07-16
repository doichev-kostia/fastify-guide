import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, options) => {
	fastify.get('/', async function(request, reply){
		return { success: true }
	})
}

export default root;
