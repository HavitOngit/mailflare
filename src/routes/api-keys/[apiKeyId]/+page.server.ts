import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "@/server/db";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const { apiKeyId } = event.params;

	const apiKey = await db.query.apiKeysTable.findFirst({
		where: (apiKeysTable, { eq, and }) =>
			and(eq(apiKeysTable.id, apiKeyId), eq(apiKeysTable.createdBy, user.id)),
		with: {
			domain: true
		}
	});

	if (!apiKey) {
		return error(404, "API Key Not Found");
	}
	apiKey.token = apiKey.token.slice(0, 9) + "...";
	return { apiKey };
}) satisfies PageServerLoad;
