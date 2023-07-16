import { type JTDDataType } from "ajv/dist/jtd.js";

export const ListQuerySchema = {
	"type": "object",
	"$id": "schema:todo:list:query",
	"additionalProperties": false,
	"properties": {
		"title": {
			"type": "string"
		},
		"limit": {
			"$ref": "schema:limit#/properties/limit"
		},
		"skip": {
			"$ref": "schema:skip#/properties/skip"
		}
	}
} as const;

export type ListQuery = JTDDataType<typeof ListQuerySchema>
