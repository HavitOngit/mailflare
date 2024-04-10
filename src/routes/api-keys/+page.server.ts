import { createApiKeySchema } from "@/schema/api-keys";
import { db } from "@/server/db";
import { apiKeysTable } from "@/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "../$types";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const apiKeysPromise = db.query.apiKeysTable.findMany({
		where: (apiKeysTable, { eq }) => eq(apiKeysTable.createdBy, user.id)
	});

	const domainPromise = db.query.domainsTable.findMany({
		where: (domainsTable, { eq }) => eq(domainsTable.createdBy, user.id)
	});

	const [apiKeys, domains] = await Promise.all([apiKeysPromise, domainPromise]);

	// Modify the API keys to hide the full token
	const apiKeysModified = apiKeys.map((apiKey) => {
		return {
			...apiKey,
			token: apiKey.token.slice(0, 9) + "..."
		};
	});

	const form = await superValidate(zod(createApiKeySchema));
	return { apiKeys: apiKeysModified, domains, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	"create-api-key": async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, "/login");
		}

		const form = await superValidate(event, zod(createApiKeySchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const [key] = await db
			.insert(apiKeysTable)
			.values({
				name: form.data.name,
				permission: form.data.permission,
				domainId: form.data.domainId,
				createdBy: user.id
			})
			.returning();

		return {
			form,
			key
		};
	}
};
