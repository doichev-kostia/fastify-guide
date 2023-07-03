import fastify from "fastify";
import { milliseconds } from "./constants.js";
import * as process from "node:process";


const app = fastify({
	logger: {
		level: "debug",
		transport: {
			target: "pino-pretty",
		}
	},
	ignoreTrailingSlash: true
});

app.ready().then(() => {
	app.log.info("All plugins are registered");
	console.log(app.printRoutes());
});

process.once("SIGINT", async function closeApp() {
	app.log.info("Gracefully closing");
	const timeout = setTimeout(function forceClose() {
		app.log.error("Forcing close!");
		process.exit(1);
	}, 6 * milliseconds.second);
	timeout.unref();

	try {
		await app.close();
		app.log.info("Closed successfully");
	} catch (error) {
		app.log.error(error, "Error closing app");
	}
});

app.get("/", async (request, reply) => {
	return {success: "ok"};
});

app.get("/api/cats", async (request, reply) => {
	return [{
		id: 1,
		name: "a"
	}];
});

app.get("/users/me", (request, reply) => {
	return {
		fullName: "Kostia Doichev"
	};
});

app.get("/users/me", {
		constraints: {
			version: "2.0.0"
		},
	},
	(request, reply) => {
		return {
			firstName: "Kostia",
			lastName: "Doichev"
		};
	}
);

app.listen({
	port: 8080,
	host: "0.0.0.0",
})
	.then((address) => {
		console.log(`Server is running on ${address}`);
	})
	.catch((error) => {
		console.error(`An error has occurred. Error: ${error}`);
	});
