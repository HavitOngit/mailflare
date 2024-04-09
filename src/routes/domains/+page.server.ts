import { createDomainSchema } from "@/schema/domains";
import { db } from "@/server/db";
import { domainsTable } from "@/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const domains = await db.query.domainsTable.findMany({
		where: (domainsTable, { eq }) => eq(domainsTable.createdBy, user.id)
	});

	const form = await superValidate(zod(createDomainSchema));
	return { domains, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	"create-domain": async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, "/login");
		}

		const form = await superValidate(event, zod(createDomainSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		let id;
		try {
			const [domain] = await db
				.insert(domainsTable)
				.values({
					domainUrl: form.data.domainUrl,
					createdBy: user.id
				})
				.returning();
			id = domain.id;
		} catch (err) {
			return error(400, {
				message: (err as Error).message
			});
		}
		redirect(302, `/domains/${id}`);
	}
};
