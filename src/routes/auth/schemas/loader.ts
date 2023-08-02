import fp from "fastify-plugin";
import RegisterSchema from "./register.schema.js";
import TokenHeaderSchema from "./token-header.schema.js";
import TokenSchema from "./token.schema.js";
import UserSchema from "./user.schema.js";

export default fp(async function loadSchemas(fastify, opts) {
	fastify.addSchema(RegisterSchema);
	fastify.addSchema(TokenHeaderSchema);
	fastify.addSchema(TokenSchema);
	fastify.addSchema(UserSchema);
});
