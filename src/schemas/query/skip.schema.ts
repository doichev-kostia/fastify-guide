import { z } from "zod";

export const SkipQuerySchema = z.object({
	skip: z.number().int().min(0).default(0).nullable(),
});

export type SkipQuery = z.infer<typeof SkipQuerySchema>;
