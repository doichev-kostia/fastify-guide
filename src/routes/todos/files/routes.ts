import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import fastifyMultipart, { type FastifyMultipartAttachFieldsToBodyOptions } from "@fastify/multipart";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

export default async function fileTodoRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
	await fastify.register(fastifyMultipart, {
		attachFieldsToBody: true,
		onFile: handleIncomingFile,
		// sharedSchemaId: "schema:todo:import:file",
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
			// body: {
			// 	type: "object",
			// 	required: ["todoListFile"],
			// 	description: "Import a todo list from a CSV file with the following format: title,done",
			// 	properties: {
			// 		todoListFile: {
			// 			type: "array",
			// 			items: {
			// 				type: "object",
			// 				required: ["title", "done"],
			// 				properties: {
			// 					title: { type: "string" },
			// 					done: { type: "boolean" },
			// 				},
			// 			},
			// 		},
			// 	},
			// },
			response: {
				201: {
					type: 'array',
					items: fastify.getSchema('schema:todo:create:response')
				}
			}
		},
		handler: async function importTodo(request, reply) {
			console.log({ body: request.body })
			return;
			const inserted = await request.todosDataSource.createTodos(request.body.todoListFile);
			reply.code(fastify.httpStatus.CREATED);
			return inserted;
		}
	});

	fastify.route({
		method: "GET",
		url: "/export",
		schema: {
			querystring: fastify.getSchema("schema:todo:list:export")
		},
		handler: async function exportTodos(request, reply) {
			const { title } = request.query;

			const cursor = await request.todosDataSource.listTodos({
				filter: { title },
				skip: 0,
				limit: undefined,
				asStream: true
			});

			reply.header('Content-Disposition', 'attachment; filename="todo-list.csv"');
			reply.type('text/csv');

			return cursor.pipe(stringify({
				quoted_string: true,
				header: true,
				columns: ['title', 'done', 'createdAt', 'modifiedAt', 'id'],
				cast: {
					boolean: (value) => value ? 'true' : 'false',
					date: (value) => value.toISOString(),
				}
			}))
		}
	})
}

async function handleIncomingFile(part: fastifyMultipart.MultipartFile): Promise<void> {
	const lines: {title: string; done: boolean }[] = [];

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

	part.values = lines;
}
