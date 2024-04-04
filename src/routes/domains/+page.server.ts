import { db } from "@/server/db";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, "/login");
	}

	const domains = await db.query.domainsTable.findMany({
		where: (domainsTable, { eq }) => eq(domainsTable.createdBy, user.id)
	});
	return { domains };
}) satisfies PageServerLoad;
