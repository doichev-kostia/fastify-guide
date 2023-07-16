import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function todoRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

	fastify.route({
		method: "GET",
		schema: {
			querystring: fastify.getSchema("schema:todo:list:query"),
			response: {
				200: fastify.getSchema("schema:todo:list:response"),
			},
		},
		url: "/",
		handler: async function listTodos(request, reply) {
			const data = await this.mongoDataSource.listTodos({
				filter: { title: request.query.title },
				skip: request.query.skip,
				limit: request.query.limit,
			});


			const count = await this.mongoDataSource.countTodos({
				title: request.query.title,
			});

			return {
				data,
				count,
			};
		},
	});

	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: fastify.getSchema("schema:todo:create:body"),
			response: {
				201: fastify.getSchema("schema:todo:create:response"),
			},
		},
		handler: async function createTodo(request, reply) {
			const insertedId = await this.mongoDataSource.createTodo({ title: request.body.title });
			reply.code(fastify.httpStatus.CREATED);
			return {
				id: insertedId,
			};
		},
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: fastify.getSchema("schema:todo:read:params"),
			response: {
				200: fastify.getSchema("schema:todo"),
			},
		},
		handler: async function readTodo(request, reply) {
			const todo = await this.mongoDataSource.readTodo(request.params.id);

			if (!todo) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			return todo;
		},
	});

	fastify.route({
		method: "PUT",
		schema: {
			params: fastify.getSchema("schema:todo:read:params"),
			body: fastify.getSchema("schema:todo:update:body"),
		},
		url: "/:id",
		handler: async function updateTodo(request, reply) {
			const res = await this.mongoDataSource.updateTodo(request.params.id, request.body);

			if (res.modifiedCount === 0) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			reply.code(fastify.httpStatus.NO_CONTENT);
		},
	});

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: fastify.getSchema("schema:todo:read:params"),
		},
		handler: async function deleteTodo(request, reply) {
			const res = await this.mongoDataSource.deleteTodo(request.params.id);

			if (res.deletedCount === 0) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			reply.code(fastify.httpStatus.NO_CONTENT);
		},
	});

	fastify.route({
		method: "POST",
		url: "/:id/:status",
		schema: {
			params: fastify.getSchema("schema:todo:status:params"),
		},
		handler: async function changeStatus(request, reply) {
			const res = await this.mongoDataSource.updateTodo(request.params.id, {
				done: request.params.status === "done",
			})
			if (res.modifiedCount === 0) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			reply.code(fastify.httpStatus.NO_CONTENT);
		},
	});
}
