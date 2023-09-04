import { z } from "zod";

export const StatusParamsSchema = z.object({
	id: z.string(),
	status: z.enum(["done", "undone"]),
})
export type StatusParams = z.infer<typeof StatusParamsSchema>;
