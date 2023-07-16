import { JTDDataType } from "ajv/dist/types/jtd-schema.js";

export const schema = {
	"type": "object",
	"$id": "schema:dotenv",
	"required": ["MONGO_URL"],
	"properties": {
		"NODE_ENV": {
			"type": "string",
			"default": "development",
		},
		"PORT": {
			"type": "integer",
			"default": "3000",
		},
		"MONGO_URL": {
			"type": "string",
		},
	},
} as const;

export type Schema = JTDDataType<typeof schema>;
