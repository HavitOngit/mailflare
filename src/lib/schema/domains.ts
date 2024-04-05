import { z } from "zod";

export const createDomainSchema = z.object({
	domainUrl: z
		.string()
		.min(3, "Domain must be at least 3 characters long")
		.max(255, "Domain must be at most 255 characters long")
});

export type CreateDomainSchema = typeof createDomainSchema;
