import { z } from "zod";

export const CreateResponseSchema = z.object({
	id: z.string(),
})

export type CreateResponse = z.infer<typeof CreateResponseSchema>;
