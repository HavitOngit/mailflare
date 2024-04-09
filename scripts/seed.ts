import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Scrypt } from "lucia";
import { apiKeysTable, domainsTable, userTable } from "../src/lib/server/db/schema";
import type { ApiKeyInsert, DomainsInsert } from "../src/lib/server/db/types";

const USERNAME = "admin";
const PASSWORD = "mailflare";

const client = createClient({
	url: process.env.DATABASE_URL!
});

export const db = drizzle(client);

function getDomains(adminId: string): DomainsInsert[] {
	return [
		{
			domainUrl: "example.com",
			createdBy: adminId
		},
		{
			domainUrl: "example.org",
			createdBy: adminId
		},
		{
			domainUrl: "example.net",
			createdBy: adminId
		}
	];
}

async function seedData() {
	const hashedPassword = await new Scrypt().hash(PASSWORD);
	const [admin] = await db
		.insert(userTable)
		.values({
			username: USERNAME,
			hashedPassword
		})
		.returning();
	console.log("✨ Added user");

	for (const domain of getDomains(admin.id)) {
		const [domainFromDb] = await db.insert(domainsTable).values(domain).returning();
		const apiKeys: ApiKeyInsert[] = [
			{
				name: "WEB" + domainFromDb.domainUrl,
				permission: "ALL",
				createdBy: admin.id
			},
			{
				name: "API" + domainFromDb.domainUrl,
				permission: "SENDING_ACCESS",
				createdBy: admin.id
			}
		];
		for (const key of apiKeys) {
			await db.insert(apiKeysTable).values(key);
			console.log(`🔑 Added key for domain ${domainFromDb.domainUrl}`);
		}
		console.log(`✨ Added domain ${domainFromDb.domainUrl}`);
	}
}

seedData();
