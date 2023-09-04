import { z } from "zod";

export const ListExportQuerySchema = z.object({
	title: z.string().optional(),
});

export type ListExportQuery = z.infer<typeof ListExportQuerySchema>;
