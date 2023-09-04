import { z } from "zod";

export const RegisterSchema = z.object({
	username: z.string().regex(/^[a-zA-Z0-9_]{3,50}$/).max(50),
	password: z.string().min(8),
})

export type Register = z.infer<typeof RegisterSchema>;
