import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "@/server/db";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { verifyDnsSchema } from "@/schema/domains";
import { verifyDns } from "@/verify-dns";
import { domainsTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const { domainId } = event.params;
	const domain = await db.query.domainsTable.findFirst({
		where: (domainsTable, { eq }) => eq(domainsTable.id, domainId)
	});

	if (!domain) {
		return error(404, "Domain not found");
	}
	const form = await superValidate(zod(verifyDnsSchema));
	return { domain, form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	"verify-dns": async (event) => {
		console.log("Verify");
		const user = event.locals.user;
		if (!user) {
			return redirect(302, "/login");
		}
		const form = await superValidate(event, zod(verifyDnsSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const domain = await db.query.domainsTable.findFirst({
			where: (domainTable, { and, eq }) =>
				and(eq(domainTable.id, form.data.domainId), eq(domainTable.createdBy, user.id))
		});
		if (!domain) {
			return error(404, "Domain not found");
		}

		const status = await verifyDns(domain.domainUrl);

		await db
			.update(domainsTable)
			.set({
				status
			})
			.where(and(eq(domainsTable.id, form.data.domainId), eq(domainsTable.createdBy, user.id)));
		return {
			form
		};
	}
};
