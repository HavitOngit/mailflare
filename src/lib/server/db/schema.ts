import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

export const userTable = sqliteTable("user", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => "usr_" + generateId(15)),
	username: text("username").notNull().unique(),
	hashedPassword: text("hashed_password").notNull()
});

export const userRelationTable = relations(userTable, ({ many }) => ({
	domains: many(domainsTable),
	apiKeys: many(apiKeysTable)
}));

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});

export const domainsTable = sqliteTable("domains", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => "dmn_" + generateId(15)),
	domainUrl: text("domain").notNull().unique(),
	createdBy: text("created_by")
		.notNull()
		.references(() => userTable.id),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull()
});

export const domainRelations = relations(domainsTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [domainsTable.createdBy],
		references: [userTable.id]
	}),
	apiKeys: many(apiKeysTable)
}));

export const apiKeysTable = sqliteTable("api_keys", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => "key_" + generateId(15)),
	name: text("name").notNull(),
	token: text("token")
		.notNull()
		.unique()
		.$defaultFn(() => "tok_" + generateId(30)),
	permission: text("permission", { enum: ["ALL", "DOMAIN_SPECIFIC"] }).notNull(),
	domainId: text("domain_id").references(() => domainsTable.id),
	createdBy: text("created_by")
		.notNull()
		.references(() => userTable.id),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull()
});

export const apiKeyRelations = relations(apiKeysTable, ({ one }) => ({
	domain: one(domainsTable, {
		fields: [apiKeysTable.domainId],
		references: [domainsTable.id]
	}),
	user: one(userTable, {
		fields: [apiKeysTable.createdBy],
		references: [userTable.id]
	})
}));

export const emailsTable = sqliteTable("emails", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => "mail_" + generateId(15)),
	from: text("from").notNull(),
	to: text("to").notNull(),
	subject: text("subject").notNull(),
	domain: text("domain").notNull(),
	contentPlain: text("content_plain").notNull(),
	contentHtml: text("content_html").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	apiKeyId: text("api_key_id")
		.notNull()
		.references(() => apiKeysTable.id)
});

export const emailRelations = relations(emailsTable, ({ one }) => ({
	apiKey: one(apiKeysTable, {
		fields: [emailsTable.apiKeyId],
		references: [apiKeysTable.id]
	})
}));
