import { z } from "zod";
import { TodoSchema } from "./todo.schema.js";

export const ListResponseSchema = z.object({
	data: z.array(TodoSchema),
	totalCount: z.number().int().positive(),
});

export type ListResponse = z.infer<typeof ListResponseSchema>;
