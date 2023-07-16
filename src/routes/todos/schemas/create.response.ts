import { type JTDDataType } from "ajv/dist/jtd.js";

export const CreateResponseSchema = {
	"type": "object",
	"$id": "schema:todo:create:response",
	"required": ["id"],
	"additionalProperties": false,
	"properties": {
		"id": {
			"type": "string"
		}
	}
} as const;

export type CreateResponse = JTDDataType<typeof CreateResponseSchema>
