import { db } from "@/server/db";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect, error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createDomainSchema } from "@/schema/domains";
import { domainsTable } from "@/server/db/schema";

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

		// TODO: Verify domain is valid or not
		let domain;
		try {
			// prepend http:// to the domain to get the hostname
			domain = new URL("http://" + form.data.domainUrl).hostname;
		} catch (err) {
			console.log(err);
			error(400, {
				message: "Invalid domain. " + form.data.domainUrl
			});
		}

		const [{ id }] = await db
			.insert(domainsTable)
			.values({
				domainUrl: domain,
				createdBy: user.id
			})
			.returning();

		redirect(302, `/domains/${id}`);
	}
};
