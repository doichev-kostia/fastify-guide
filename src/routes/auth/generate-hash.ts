import * as crypto from "node:crypto";
import * as util from "node:util";

const pbkdf2 = util.promisify(crypto.pbkdf2);

export async function generateHash(password: string, salt?: string): Promise<{
	salt: string;
	hash: string;
}> {
	if (!salt) {
		salt = crypto.randomBytes(16).toString("hex");
	}

	// Hash the password using the salt value and SHA-256 algorithm
	const buffer =(await pbkdf2(password, salt, 1000, 64, "sha256"))

	const hash = buffer.toString("hex");

	return {
		salt,
		hash,
	}
}
