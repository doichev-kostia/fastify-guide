import { z } from "zod";

export const CreateBodySchema = z.object({
	title: z.string(),
})

export type CreateBody = z.infer<typeof CreateBodySchema>;
