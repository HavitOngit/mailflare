import { Scrypt } from "lucia";
import { domainsTable, userTable } from "../src/lib/server/db/schema";
import type { DomainsInsert } from "../src/lib/server/db/types";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

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

	getDomains(admin.id).forEach(async (domain) => {
		await db.insert(domainsTable).values(domain);
		console.log(`✨ Added domain ${domain.domainUrl}`);
	});
}

seedData();
