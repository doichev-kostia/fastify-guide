import { type JTDDataType } from "ajv/dist/jtd.js";

export const UpdateBodySchema = {
	"type": "object",
	"$id": "schema:todo:update:body",
	"additionalProperties": false,
	"properties": {
		"title": {
			"type": "string"
		},
		"done": {
			"type": "boolean"
		}
	}
} as const;

export type UpdateBody = JTDDataType<typeof UpdateBodySchema>

