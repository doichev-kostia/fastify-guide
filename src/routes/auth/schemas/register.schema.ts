export const RegisterSchema = {
	"type": "object",
	"$id": "schema:auth:register",
	"required": [
		"username",
		"password"
	],
	"properties": {
		"username": {
			"type": "string",
			"pattern": "^[a-zA-Z0-9_]{3,50}$",
			"maxLength": 50
		},
		"password": {
			"type": "string",
			"maxLength": 20
		}
	}
} as const;

export default RegisterSchema;
