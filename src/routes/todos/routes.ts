import { type FastifyPluginOptions } from "fastify";
import { type FastifyPluginAsyncZod } from "../../types.js";
import { ListQuerySchema } from "./schemas/list.query.js";
import { ListResponseSchema } from "./schemas/list.response.js";
import { CreateBodySchema } from "./schemas/create.body.js";
import { CreateResponseSchema } from "./schemas/create.response.js";
import { ReadParamsSchema } from "./schemas/read.params.js";
import { TodoSchema } from "./schemas/todo.schema.js";
import { UpdateBodySchema } from "./schemas/update.body.js";
import { StatusParamsSchema } from "./schemas/status.params.js";

const todoRoutes: FastifyPluginAsyncZod = async function todoRoutes(fastify, options: FastifyPluginOptions) {
	fastify.addHook('onRequest', fastify.authenticate);

	fastify.route({
		method: "GET",
		schema: {
			querystring: ListQuerySchema,
			response: {
				200: ListResponseSchema,
			},
		},
		url: "/",
		handler: async function listTodos(request, reply) {
			const data = await request.todosDataSource.listTodos({
				filter: { title: request.query.title },
				skip: request.query.skip,
				limit: request.query.limit,
			});


			const count = await request.todosDataSource.countTodos({
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
			body: CreateBodySchema,
			response: {
				201: CreateResponseSchema,
			},
		},
		handler: async function createTodo(request, reply) {
			const insertedId = await request.todosDataSource.createTodo({ title: request.body.title });
			reply.code(fastify.httpStatus.CREATED);
			return {
				id: insertedId.toJSON(),
			};
		},
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: ReadParamsSchema,
			response: {
				200: TodoSchema,
			},
		},
		handler: async function readTodo(request, reply) {
			const todo = await request.todosDataSource.readTodo(request.params.id);

			if (!todo) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			return todo;
		},
	});

	fastify.route({
		method: "PUT",
		schema: {
			params: ReadParamsSchema,
			body: UpdateBodySchema,
		},
		url: "/:id",
		handler: async function updateTodo(request, reply) {
			const res = await request.todosDataSource.updateTodo(request.params.id, request.body);

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
			params: ReadParamsSchema,
		},
		handler: async function deleteTodo(request, reply) {
			const res = await request.todosDataSource.deleteTodo(request.params.id);

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
			params: StatusParamsSchema,
		},
		handler: async function changeStatus(request, reply) {
			const res = await request.todosDataSource.updateTodo(request.params.id, {
				done: request.params.status === "done",
			})
			if (res.modifiedCount === 0) {
				throw fastify.httpErrors.notFound("Todo not found");
			}

			reply.code(fastify.httpStatus.NO_CONTENT);
		},
	});
};

export default todoRoutes;

