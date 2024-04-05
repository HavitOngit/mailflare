import { db } from "@/server/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const apiKeys = await db.query.apiKeysTable.findMany({
		where: (apiKeysTable, { eq }) => eq(apiKeysTable.createdBy, user.id)
	});

	// Modify the API keys to hide the full token
	const apiKeysModified = apiKeys.map((apiKey) => {
		return {
			...apiKey,
			token: apiKey.token.slice(0, 9) + "..."
		};
	});

	return { apiKeys: apiKeysModified };
}) satisfies PageServerLoad;
