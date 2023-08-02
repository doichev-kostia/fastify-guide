import fp from "fastify-plugin";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { generateHash } from "./generate-hash.js";

export default fp(async function authRoutes(fastify , options ): Promise<void> {
	fastify.post("/register", {
		schema: {
			body: fastify.getSchema("schema:auth:register"),
		},
	}, async function registerHandler(request, reply) {
		const existingUser = await this.userDataSource.readUser(request.body.username);
		if (existingUser) {
			throw fastify.httpErrors.conflict("User already exists");
		}

		const { hash, salt } = await generateHash(request.body.password);

		try {
			const newUserId = await this.userDataSource.createUser({
				username: request.body.username,
				salt,
				hash,
			});

			request.log.info({ userId: newUserId }, "User created");
			reply.code(201);
			return {
				registered: true,
			}
		} catch (error) {
			request.log.error(error);
			throw fastify.httpErrors.internalServerError();
		}
	});

	fastify.post("/authenticate", {
		schema: {
			body: fastify.getSchema("schema:auth:register"),
			response: {
				200: fastify.getSchema("schema:auth:token"),
			}
		}
	}, async function authenticateHandler(request, reply) {
		const user = await this.userDataSource.readUser(request.body.username);

		if (!user) {
			throw fastify.httpErrors.unauthorized('Invalid credentials');
		}

		const { hash } = await generateHash(request.body.password, user.salt);

		if (hash !== user.hash) {
			throw fastify.httpErrors.unauthorized('Invalid credentials');
		}

		request.user = user;
		return refreshHandler(request, reply)
	});

	fastify.get("/me", {
		onRequest: fastify.authenticate,
		schema: {
			headers: fastify.getSchema("schema:auth:token-header"),
			response: {
				200: fastify.getSchema("schema:user")
			}

		}
	}, async function meHandler(request, reply) {
		return request.user;
	})

	fastify.post("/refresh", {
		onRequest: fastify.authenticate,
		schema: {
			headers: fastify.getSchema("schema:auth:token-header"),
			response: {
				200: fastify.getSchema("schema:auth:token"),
			}
		},
	}, refreshHandler);

	fastify.post("/logout", {
		onRequest: fastify.authenticate,
		handler: async function logoutHandler(request, reply) {
			request.revokeToken();
			reply.code(fastify.httpStatus.NO_CONTENT);
		}
	});

	async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
		const token = await request.generateToken();
		return {
			token,
		}
	}
}, {
	name: 'auth-routes',
	dependencies: ['authentication-plugin'],
	encapsulate: true,
});
