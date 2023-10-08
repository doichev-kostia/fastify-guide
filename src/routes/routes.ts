import { type FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, options) => {
	fastify.get('/', async function(request, reply){
		const hello = ['hello', 'world'];
		request.log.debug({ hello });
		return { success: true }
	});

	fastify.post('/', {
		config: {
			logBody: true,
		}
	}, async function testLog(request, reply) {
		return {
			success: true,
		}
	})
}

export default root;
