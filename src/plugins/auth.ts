import fp from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}

	interface FastifyRequest {
		revokeToken: () => void;
		generateToken: () => Promise<string>;
	}

}

export default fp(async function authenticationPlugin(fastify, options) {
	const revokedTokens = new Map();

	fastify.register(fastifyJWT, {
		secret: fastify.secrets.JWT_SECRET,
		trusted: function isTrusted(request, decodedToken) {
		return !revokedTokens.has(decodedToken.jti);
		},
	})

	fastify.decorate('authenticate', async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.code(401).send(err);
		}
	});

	fastify.decorateRequest('revokeToken', function revokeToken() {
		revokedTokens.set(this.user.jti, true);
	});

	fastify.decorateRequest('generateToken', async function generateToken(): Promise<string> {
		const token = await fastify.jwt.sign({
			id: String(this.user._id),
			username: this.user.username,
		}, {
			jti: String(Date.now()),
			expiresIn: fastify.secrets.JWT_EXPIRES_IN,
		});

		return token;
	})
}, {
	name: "authentication-plugin",
	dependencies: ['application-configuration']
});
