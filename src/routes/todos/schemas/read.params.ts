import { type JTDDataType } from "ajv/dist/jtd.js";

export const ReadParamsSchema = {
	"type": "object",
	"$id": "schema:todo:read:params",
	"required": ["id"],
	"additionalProperties": false,
	"properties": {
		"id": {
			"type": "string"
		}
	}
} as const;

export type ReadParams = JTDDataType<typeof ReadParamsSchema>
