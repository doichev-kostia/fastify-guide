import { FastifyInstance } from "fastify";
import schemas from "./schemas/loader.js";
import { ObjectId } from "@fastify/mongodb";
import { DeleteResult, Document, UpdateResult, WithId } from "mongodb";

declare module "fastify" {
	interface FastifyInstance {
		mongoDataSource: {
			countTodos: (filter?: { title?: string }) => Promise<number>;
			listTodos: (options: {
				filter?: { title?: string };
				projection?: Record<string, unknown>;
				skip?: number;
				limit?: number;
			}) => Promise<WithId<Document>[]>;
			createTodo: (options: { title: string }) => Promise<ObjectId>;
			readTodo: (id: string, projection?: Record<string, unknown>) => Promise<WithId<Document> | null>;
			updateTodo: (id: string, options: { title?: string; done?: boolean }) => Promise<UpdateResult<Document>>;
			deleteTodo: (id: string) => Promise<DeleteResult>;
		}
	}
}

export default async function todoAutoHooks(fastify: FastifyInstance) {
	const todos = fastify.mongo.db?.collection('todos');

	if (!todos) {
		throw new Error('Todos collection not found');
	}

	fastify.register(schemas);

	fastify.decorate('mongoDataSource', {
		async countTodos(filter = {}): Promise<number> {
			return await todos.countDocuments(filter);
		},
		async listTodos({
			filter = {},
			projection = {},
			skip = 0,
			limit = 50,
						}): Promise<WithId<Document>[]> {
			if (filter.title) {
				filter.title = new RegExp(filter.title, 'i');
			} else {
				delete filter.title;
			}

			const documents = await todos.find(filter, {
				projection: {
					...projection,
					_id: 0,
				},
				skip,
				limit,
			}).toArray();

			return documents;
		},
		async createTodo({ title }: { title : string }): Promise<ObjectId> {
			const _id = new fastify.mongo.ObjectId();
			const now = new Date();

			const { insertedId } = await todos.insertOne({
				_id,
				id: _id,
				title,
				done: false,
				createdAt: now,
				modifiedAt: now,
			});

			return insertedId;
		},
		async readTodo(
			id: string,
			projection: Record<string, unknown> = {},
		): Promise<WithId<Document> | null> {
			const todo = await todos.findOne(
				{ _id: new fastify.mongo.ObjectId(id) },
				{projection: { ...projection, _id: 0 }}
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
					}
				}
			)
		},
		async deleteTodo(
			id: string,
		): Promise<DeleteResult> {
			 return todos.deleteOne(
				{ _id: new fastify.mongo.ObjectId(id) },
			)
		}
	})

}
