import fp from "fastify-plugin";
import { TodoSchema } from "./todo.schema.js";
import { CreateBodySchema } from "./create.body.js";
import { CreateResponseSchema } from "./create.response.js";
import { ListQuerySchema } from "./list.query.js";
import { ListExportQuerySchema } from "./list-export.query.js";
import { ListResponseSchema } from "./list.response.js";
import { ReadParamsSchema } from "./read.params.js";
import { StatusParamsSchema } from "./status.params.js";
import { UpdateBodySchema } from "./update.body.js";


export default fp(async function loadSchemas(fastify, opts) {
	fastify.addSchema(TodoSchema);
	fastify.addSchema(CreateBodySchema);
	fastify.addSchema(CreateResponseSchema);
	fastify.addSchema(ListQuerySchema);
	fastify.addSchema(ListResponseSchema);
	fastify.addSchema(ListExportQuerySchema);
	fastify.addSchema(ReadParamsSchema);
	fastify.addSchema(StatusParamsSchema);
	fastify.addSchema(UpdateBodySchema);
})
