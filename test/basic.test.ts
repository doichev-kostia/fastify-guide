import { pass, teardown, test, todo } from "tap";

import fcli from "fastify-cli/helper.js";


const startArgs = '-l info --options app.js'
test('the application should start', async (t) => {
	const envParam = {
		NODE_ENV: 'test',
		MONGO_URL: 'mongodb://localhost:27017/test',
	};

	const app = await fcli.build(startArgs, {
		configData: envParam
	});

	teardown(() => app.close());

	await app.ready();

	pass('the application is ready');
})

todo('the alive route is online', async (t) => {

})

todo("the application should not start", async (t) => {

});
