import { test } from "tap";

import fcli from "fastify-cli/helper.js";
import { type FastifyInstance } from "fastify";


const startArgs = "-l info --options ./build/app.js";

const envParam = {
	NODE_ENV: "test",
	MONGO_URL: "mongodb://localhost:27017/test",
};

async function buildApp(t: Tap.Test, env = envParam, serverOptions: Record<string, unknown> = {}): Promise<FastifyInstance> {
	const app = await fcli.build(startArgs, {
		configData: env,
		serverOptions,
	});

	t.teardown(() => app.close());

	return app;
}

test("the application should start", async (t) => {
	const app = await buildApp(t, envParam);

	const response = await app.inject({
		method: "GET",
		url: '/'
	});

	t.same(response.json(), { success: true });
});

test("the application should not start", async (mainTest) => {
	await mainTest.test("if there are missing env vars", async (t) => {
		try {
			await buildApp(t, {
				NODE_ENV: 'test',
				// @ts-expect-error
				MONGO_URL: undefined,
			});
			t.fail('The server should not start');
		} catch (error) {
			t.ok(error, 'error must be thrown');
		}
	})
});
