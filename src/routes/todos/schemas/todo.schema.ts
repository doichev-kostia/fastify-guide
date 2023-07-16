import { type JTDDataType } from "ajv/dist/jtd.js";

export const TodoSchema = {
	"type": "object",
	"$id": "schema:todo",
	"additionalProperties": false,
	"properties": {
		"_id": {
			"type": "string"
		},
		"id": {
			"type": "string"
		},
		"title": {
			"type": "string"
		},
		"done": {
			"type": "boolean"
		},
		"createdAt": {
			"type": "string",
			"format": "date-time"
		},
		"modifiedAt": {
			"type": "string",
			"format": "date-time"
		}
	}
} as const;

export type Todo = JTDDataType<typeof TodoSchema>
