import { type FastifyInstance } from "fastify";
import schemas from "./schemas/loader.js";
import { type ObjectId } from "@fastify/mongodb";
import { type DeleteResult, type Document, type UpdateResult, type WithId } from "mongodb";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyRequest {
		todosDataSource: {
			countTodos: (filter?: { title?: string, userId?: string }) => Promise<number>;
			listTodos: (options: {
				filter?: { title?: string, userId?: string };
				projection?: Record<string, unknown>;
				skip?: number;
				limit?: number;
				asStream?: boolean;
			}) => Promise<WithId<Document>[]>;
			createTodo: (options: { title: string }) => Promise<ObjectId>;
			createTodos: (todoList: { title: string; done: boolean }[]) => Promise<ObjectId[]>;
			readTodo: (id: string, projection?: Record<string, unknown>) => Promise<WithId<Document> | null>;
			updateTodo: (id: string, options: { title?: string; done?: boolean }) => Promise<UpdateResult<Document>>;
			deleteTodo: (id: string) => Promise<DeleteResult>;
		};
	}
}

export default fp(async function todoAutoHooks(fastify: FastifyInstance) {
	const todos = fastify.mongo.db?.collection("todos");

	if (!todos) {
		throw new Error("Todos collection not found");
	}

	fastify.register(schemas);

	fastify.decorate("todosDataSource", null); // speed optimization. making the application aware of the existence of the todosDataSource property at the beginning of the request lifecycle
	fastify.addHook("onRequest", async (request, reply) => {
		request.todosDataSource = {
			async countTodos(filter = {}): Promise<number> {
				filter.userId = request.user.id;
				return await todos.countDocuments(filter);
			},
			async listTodos({
								filter = {},
								projection = {},
								skip = 0,
								limit = 50,
				asStream = false,
							}): Promise<WithId<Document>[]> {
				if (filter.title) {
					filter.title = new RegExp(filter.title, "i");
				} else {
					delete filter.title;
				}

				filter.userId = request.user.id; // return the data that belongs to the user

				const cursor = todos.find(filter, {
					projection: {
						...projection,
						_id: 0,
					},
					skip,
					limit,
				});

				if (asStream) {
					return cursor.stream();
				}

				return cursor.toArray();
			},
			async createTodo({ title }: { title: string }): Promise<ObjectId> {
				const _id = new fastify.mongo.ObjectId();
				const now = new Date();
				const userId = request.user.id;

				const { insertedId } = await todos.insertOne({
					_id,
					id: _id,
					userId,
					title,
					done: false,
					createdAt: now,
					modifiedAt: now,
				});

				return insertedId;
			},
			async createTodos(todoList): Promise<ObjectId[]> {
				const now = new Date();
				const userId = request.user.id;
				const toInsert = todoList.map((todo) => {
					const _id = new fastify.mongo.ObjectId();

					return {
						_id,
						id: _id,
						userId,
						...todo,
						createdAt: now,
						modifiedAt: now,
					}
				});

				await todos.insertMany(toInsert);
				return toInsert.map(({ id }) => id);
			},
			async readTodo(
				id: string,
				projection: Record<string, unknown> = {},
			): Promise<WithId<Document> | null> {
				const todo = await todos.findOne(
					{ _id: new fastify.mongo.ObjectId(id) },
					{ projection: { ...projection, _id: 0 } },
				);

				return todo;
			},
			async updateTodo(
				id: string,
				{ title, done }: { title?: string; done?: boolean },
			): Promise<UpdateResult<Document>> {
				return todos.updateOne(
					{ _id: new fastify.mongo.ObjectId(id) },
					{
						$set: {
							title,
							done,
							modifiedAt: new Date(),
						},
					},
				);
			},
			async deleteTodo(
				id: string,
			): Promise<DeleteResult> {
				return todos.deleteOne(
					{ _id: new fastify.mongo.ObjectId(id) },
				);
			},
		};
	});

}, {
	encapsulate: true,
	dependencies: ["@fastify/mongodb"],
	name: "todo-store",
});
