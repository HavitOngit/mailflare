import { z } from "zod";

const domainRegex = /^(?!.*:\/\/)[a-zA-Z0-9]+([-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

export const createDomainSchema = z.object({
	domainUrl: z
		.string()
		.regex(domainRegex, "Invalid domain")
		.min(3, "Domain must be at least 3 characters long")
		.max(255, "Domain must be at most 255 characters long")
});

export type CreateDomainSchema = typeof createDomainSchema;

export const verifyDnsSchema = z.object({
	domainId: z.string()
});
