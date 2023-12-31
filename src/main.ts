import fastify from "fastify";
import { milliseconds } from "./constants.js";
import process from "node:process";
import { app as application } from "./app.js";


const app = fastify({
	logger: {
		level: "debug",
		transport: {
			target: "pino-pretty",
		},
	},
	ignoreTrailingSlash: true,
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

app.register(application)

app.ready().then(() => {
	app.log.info("All plugins are registered");
	console.log(app.printRoutes());
});


app.listen({
	port: 8080,
	host: "localhost",
})
	.then((address) => {
		console.log(`Server is running on ${address}`);
	})
	.catch((error) => {
		console.error(`An error has occurred. Error: ${error}`);
	});
