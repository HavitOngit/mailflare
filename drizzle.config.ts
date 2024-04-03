import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	driver: "turso",
	dbCredentials: {
		url: "file:mailflare.db"
	},
	verbose: true,
	strict: true
});
