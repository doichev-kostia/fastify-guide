import { z } from "zod";

export const ListQuerySchema = z.object({
	title: z.string().optional(),
	limit: z.number().int().positive().optional().default(10),
	skip: z.number().int().positive().optional().default(0),
})

export type ListQuery = z.infer<typeof ListQuerySchema>;
