import { z } from "zod";

export const TodoSchema = z.object({
	_id: z.string(),
	id: z.string(),
	title: z.string(),
	done: z.boolean(),
	createdAt: z.string().datetime(),
	modifiedAt: z.string().datetime(),
});

export type Todo = z.infer<typeof TodoSchema>;
