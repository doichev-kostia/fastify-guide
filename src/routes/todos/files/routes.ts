import fastifyMultipart, { type FastifyMultipartAttachFieldsToBodyOptions } from "@fastify/multipart";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { ListExportQuerySchema } from "../schemas/list-export.query.js";
import { type FastifyPluginAsyncZod } from "../../../types.js";
import { z } from "zod";
import { CreateResponseSchema } from "../schemas/create.response.js";

const fileTodoRoutes: FastifyPluginAsyncZod = async function fileTodoRoutes(fastify, options): Promise<void> {
	await fastify.register(fastifyMultipart, {
		attachFieldsToBody: "keyValues",
		onFile: handleIncomingFile,
		limits: {
			filedNameSize: 50,
			fieldSize: 100,
			fields: 10,
			fileSize: 1_000_000, // (1MB)
			files: 1,
		},
	} as FastifyMultipartAttachFieldsToBodyOptions);

	fastify.addHook("onRequest", fastify.authenticate);

	fastify.route({
		method: "POST",
		url: "/import",
		schema: {
			body: z.object({
				todoListFile: z.array(
					z.object({
						title: z.string(),
						done: z.boolean(),
					}),
				),
			}),
			response: {
				201: z.array(CreateResponseSchema)
			},
		},
		handler: async function importTodo(request, reply) {
			const inserted = await request.todosDataSource.createTodos(request.body.todoListFile);
			reply.code(fastify.httpStatus.CREATED);
			return inserted;
		},
	});

	fastify.route({
		method: "GET",
		url: "/export",
		schema: {
			querystring: ListExportQuerySchema,
		},
		handler: async function exportTodos(request, reply) {
			const { title } = request.query;

			const cursor = await request.todosDataSource.listTodos({
				filter: { title },
				skip: 0,
				limit: undefined,
				asStream: true,
			});

			reply.header("Content-Disposition", "attachment; filename=\"todo-list.csv\"");
			reply.type("text/csv");

			return cursor.pipe(stringify({
				quoted_string: true,
				header: true,
				columns: ["title", "done", "createdAt", "modifiedAt", "id"],
				cast: {
					boolean: (value) => value ? "true" : "false",
					date: (value) => value.toISOString(),
				},
			}));
		},
	});
}

async function handleIncomingFile(part: fastifyMultipart.MultipartFile): Promise<void> {
	const lines: { title: string; done: boolean }[] = [];

	const stream = part.file.pipe(parse({
		bom: true,
		skip_empty_lines: true,
		trim: true,
		columns: true,
	}));

	for await (const line of stream) {
		lines.push({
			title: line.title,
			done: line.done === "true",
		});
	}

	part.value = lines;
}

export default fileTodoRoutes;
