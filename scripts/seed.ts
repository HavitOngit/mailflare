import { Scrypt } from "lucia";
import { userTable } from "../src/lib/server/db/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const USERNAME = "admin";
const PASSWORD = "mailflare";

const client = createClient({
	url: process.env.DATABASE_URL!
});

export const db = drizzle(client);

async function addAdminUser() {
	const hashedPassword = await new Scrypt().hash(PASSWORD);
	await db.insert(userTable).values({
		username: USERNAME,
		hashedPassword
	});
	console.log("✨ Added user");
}

addAdminUser();
