import { z } from "zod";

export const createApiKeySchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		permission: z.enum(["ALL", "DOMAIN_SPECIFIC"]),
		domainId: z.string().optional()
	})
	.refine(
		(data) => {
			if (data.permission === "DOMAIN_SPECIFIC" && !data.domainId) {
				return false;
			}
			return true;
		},
		{
			message: "Domain is required when permission is set to Domain Specific",
			path: ["domainId"]
		}
	);

export type CreateApiKeySchema = typeof createApiKeySchema;
