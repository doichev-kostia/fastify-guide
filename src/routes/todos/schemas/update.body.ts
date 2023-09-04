import { z } from "zod";

export const UpdateBodySchema = z.object({
	title: z.string(),
	done: z.boolean(),
});

export type UpdateBody = z.infer<typeof UpdateBodySchema>;

