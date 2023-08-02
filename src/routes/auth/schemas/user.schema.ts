export const UserSchema = {
	"type": "object",
	"$id": "schema:user",
	"additionalProperties": false,
	"properties": {
		"username": {
			"type": "string"
		}
	}
} as const;

export default UserSchema;
