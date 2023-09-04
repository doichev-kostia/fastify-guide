import { z } from "zod";


export const LimitQuerySchema = z.object({
	limit: z.number().int().min(0).default(0).nullable(),
});

export type LimitQuery = z.infer<typeof LimitQuerySchema>;
