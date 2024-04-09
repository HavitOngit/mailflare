import type { DNSHeader } from "@/dns-headers";
import type { DomainsSelect } from "@/server/db/types";
import { writable } from "svelte/store";

export const dnsTableData = writable<
	(DNSHeader & {
		status: DomainsSelect["status"]["spf"];
	})[]
>();
