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
		"JWT_SECRET": {
			"type": "string",
		},
		"JWT_EXPIRES_IN": {
			"type": "string",
			"default": "1h",
		}
	},
} as const;

export type Schema = JTDDataType<typeof schema>;
