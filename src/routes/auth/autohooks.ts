import { type FastifyInstance } from "fastify";
import { type Document, type WithId } from "mongodb";
import { type ObjectId } from "@fastify/mongodb";
import fp from "fastify-plugin";
import { type User } from "./types.js";

declare module "fastify" {
	interface FastifyInstance {
		userDataSource: {
			readUser: (username: string) => Promise<WithId<Document> | null>;
			createUser: (user: User) => Promise<ObjectId>;
		}
	}
}

export default fp(async function authAutoHooks(fastify: FastifyInstance): Promise<void> {
	const users = fastify.mongo.db?.collection("users");

	if (!users) {
		throw new Error("Users collection not found");
	}


	fastify.decorate("userDataSource", {
		async readUser(username: string): Promise<WithId<Document> | null> {
			const user = await users.findOne({ username });

			return user;
		},
		async createUser(user: User): Promise<ObjectId> {
			const newUser = await users.insertOne(user);

			return newUser.insertedId;
		}
	})
}, {
	encapsulate: true,
	dependencies: ["@fastify/mongodb"],
})
