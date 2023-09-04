import fp from "fastify-plugin";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { generateHash } from "./generate-hash.js";
import { RegisterSchema } from "./schemas/register.schema.js";
import { type FastifyPluginAsyncZod } from "../../types.js";
import { TokenSchema } from "./schemas/token.schema.js";
import { TokenHeaderSchema } from "./schemas/token-header.schema.js";
import { UserSchema } from "./schemas/user.schema.js";

const authRoutes: FastifyPluginAsyncZod =  fp(async function authRoutes(fastify , options ): Promise<void> {
	fastify.post("/register", {
		schema: {
			body: RegisterSchema,
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
			body: RegisterSchema,
			response: {
				200: TokenSchema
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
			headers: TokenHeaderSchema,
			response: {
				200: UserSchema
			}

		}
	}, async function meHandler(request, reply) {
		return request.user;
	})

	fastify.post("/refresh", {
		onRequest: fastify.authenticate,
		schema: {
			headers: TokenHeaderSchema,
			response: {
				200: TokenSchema,
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

export default authRoutes;
