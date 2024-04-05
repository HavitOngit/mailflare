import type { apiKeysTable, domainsTable } from "./schema";

export type DomainsSelect = typeof domainsTable.$inferSelect;
export type DomainsInsert = typeof domainsTable.$inferInsert;
export type ApiKeySelect = typeof apiKeysTable.$inferSelect;
export type ApiKeyInsert = typeof apiKeysTable.$inferInsert;
