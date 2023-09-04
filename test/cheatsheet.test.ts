import { test } from "tap";
import fs from "node:fs";

test("a test description", (t) => {
	t.plan(1);
	const myVar = 42;
	t.equal(myVar,  42, 'this number is 42');
})

test('same structure', (t) => {
	t.plan(1)
	const o = {
		a: 1,
	};

	const o2 = {
		a: 1,
	};

	t.strictSame(o, o2, 'the object is correct')
})

test('similar structure', (t) => {
	t.plan(1)
	const almostLike = {
		hello: 'world',
		foo: 'bar',
	};

	const like = {
		hello: 'world',
	}

	t.match(almostLike, like, 'the object is similar');
})

test('sub test', function testFunction(t) {
	t.plan(2);

	const falsyValue = null;
	t.notOk(falsyValue, 'this is falsy');

	t.test('boolean assertion', subtest => {
		subtest.plan(1);
		const truthyValue = true;
		subtest.ok(truthyValue, 'this is truthy');
	})
})

test('async test', async (t) => {
	const content = await fs.promises.readFile('package.json', 'utf-8');

	t.type(content, 'string', 'the file content is a string');

	await t.test('check main file', async (subtest) => {
		const json = JSON.parse(content);
		subtest.match(json, { version: '1.0.0'} );
		const appIndex = await fs.promises.readFile(json.main, 'utf-8');
		subtest.match(appIndex, 'import type { FastifyInstance } from "fastify";', 'the main file is correct');

		t.pass('test completed')
	})
})
