import { z } from "zod";

export const TokenHeaderSchema = z.object({
	authorization: z.string().regex(/^Bearer [a-zA-Z0-9-._~+/]+=*$/),
})

export type TokenHeader = z.infer<typeof TokenHeaderSchema>;

