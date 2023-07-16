import { type JTDDataType } from "ajv/dist/jtd.js";

export const ListResponseSchema = {
	"type": "object",
	"$id": "schema:todo:list:response",
	"additionalProperties": false,
	"properties": {
		"data": {
			"type": "array",
			"items": {
				"$ref": "schema:todo"
			}
		},
		"totalCount": {
			"type": "integer"
		}
	}
} as const;

export type ListResponse = JTDDataType<typeof ListResponseSchema>
