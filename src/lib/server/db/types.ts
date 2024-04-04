import type { domainsTable } from "./schema";

export type DomainsSelect = typeof domainsTable.$inferSelect;
export type DomainsInsert = typeof domainsTable.$inferInsert;
