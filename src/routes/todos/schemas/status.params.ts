import { type JTDDataType } from "ajv/dist/jtd.js";

export const StatusParamsSchema = {
	"type": "object",
	"$id": "schema:todo:status:params",
	"required": [
		"id",
		"status"
	],
	"additionalProperties": false,
	"properties": {
		"id": {
			"type": "string"
		},
		"status": {
			"type": "string",
			"enum": [
				"done",
				"undone"
			]
		}
	}
} as const;

export type StatusParams = JTDDataType<typeof StatusParamsSchema>
