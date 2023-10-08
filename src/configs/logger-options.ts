import { type FastifyLoggerOptions, type FastifyServerOptions } from "fastify";
import path from "node:path";

const serializers = {
	req: function requestSerializer(request) {
		const shouldLogBody = request.routeConfig.logBody === true;

		return {
			method: request.method,
			url: request.url,
			routeUrl: request.routerPath,
			version: request.headers?.["accept-version"] as string | undefined,
			user: request.user?.id,
			headers: request.headers,
			body: shouldLogBody ? request.body : undefined,
			hostname: request.hostname,
			remoteAddress: request.ip,
			remotePort: request.socket?.remotePort,
		};
	},
	res: function responseSerializer(response) {
		return {
			statusCode: response.statusCode,
			responseTime: response.getResponseTime!(),
		};
	},
} satisfies FastifyLoggerOptions["serializers"];

export type SerializedProperties = keyof typeof serializers;

export const loggerOptions = {
	level: process.env.LOG_LEVEL || "info",
	serializers,
	redact: {
		censor: "***",
		paths: [
			"req.headers.authorization",
			"req.body.password",
			"req.body.passwordConfirmation",
			"req.body.oldPassword",
			"req.body.username",
			"req.body.email",
		],
	},
	transport: {
		targets: [
			{
				target: "pino/file",
				options: {
					destination: path.resolve("error.log"),
				},
				level: "trace",
			},
			{
				target: "pino/file",
				options: {
					destination: 1,
				},
				level: "info"
			},
		],
	},
} satisfies FastifyServerOptions["logger"];
