import { JSONSchemaType } from "ajv";

export type LimitQuery = {
	limit?: number;
}
export const LimitQuerySchema: JSONSchemaType<LimitQuery> = {
	"type": "object",
	"$id": "schema:limit",
	"additionalProperties": false,
	"properties": {
		"limit": {
			"type": "integer",
			"default": 0,
			"minimum": 0,
			"nullable": true
		}
	}
} as const;

export default LimitQuerySchema;
