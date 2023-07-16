import { JSONSchemaType } from "ajv";

type SkipQuery = {
	skip?: number;
}


const SkipQuerySchema: JSONSchemaType<SkipQuery> = {
	type: "object",
	$id: "schema:skip",
	properties: {
		skip: {
			type: "integer",
			default: 0,
			minimum: 0,
			nullable: true,
		}
	}
} as const;


export default SkipQuerySchema;
