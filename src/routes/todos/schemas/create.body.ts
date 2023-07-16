import { type JTDDataType } from "ajv/dist/jtd.js";

export const CreateBodySchema = {
	type: "object",
	"$id":"schema:todo:create:body",
	required: ["title"],
	properties: {
		title: {
			type: "string",
		}
	}
} as const;

export type CreateBody = JTDDataType<typeof CreateBodySchema>
