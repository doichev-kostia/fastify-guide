import { z } from "zod";

export const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.coerce.number().int().positive().default(3000),
	MONGO_URL: z.string(),
	JWT_SECRET: z.string(),
	JWT_EXPIRES_IN: z.string().default("1h"),
})

export type Env = z.infer<typeof EnvSchema>;
