import type fastify from "fastify";

declare module 'fastify-cli/helper.js' {
	type fastifyFunctionReturnType = ReturnType<fastify>;

	module helper {
		export function build(argv: string, config: Object): fastifyFunctionReturnType;
	}

	export = helper;
}
