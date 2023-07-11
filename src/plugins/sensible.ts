import fp from "fastify-plugin"
import {fastifySensible, SensibleOptions} from "@fastify/sensible"

export default fp(async function (fastify, options) {
	const plugin = await import('@fastify/sensible');
	fastify.register(plugin.fastifySensible)
})
