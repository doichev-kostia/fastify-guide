import { z } from "zod";

export const ReadParamsSchema = z.object({
	id: z.string(),
});

export type ReadParams = z.infer<typeof ReadParamsSchema>;
