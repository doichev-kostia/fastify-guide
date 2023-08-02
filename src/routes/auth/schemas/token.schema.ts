export const TokenSchema = {
	"type": "object",
	"$id": "schema:auth:token",
	"additionalProperties": false,
	"properties": {
		"token": {
			"type": "string"
		}
	}
} as const;

export default TokenSchema;
