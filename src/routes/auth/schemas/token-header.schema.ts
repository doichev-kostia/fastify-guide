export const TokenHeaderSchema = {
	"type": "object",
	"$id": "schema:auth:token-header",
	"properties": {
		"authorization": {
			"type": "string",
			"pattern": "^Bearer [a-zA-Z0-9-._~+/]+=*$"
		}
	}
} as const;

export default TokenHeaderSchema;
