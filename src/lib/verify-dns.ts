import { PUBLIC_APP_URL } from "$env/static/public";
import type { DomainsSelect } from "./server/db/types";

export async function verifyDns(domain: string): Promise<DomainsSelect["status"]> {
	const result = await Promise.all([
		verifySpf(domain),
		verifyDomainLockdown(domain),
		verifyDkim(domain),
		verifyDmarc(domain)
	]);
	return {
		spf: result[0] ? "Verified" : "Pending",
		"domain-lockdown": result[1] ? "Verified" : "Pending",
		dkim: result[2] ? "Verified" : "Pending",
		dmarc: result[3] ? "Verified" : "Pending"
	};
}

async function verifySpf(domain: string) {
	const SPF_VALUE = "v=spf1 a mx include:relay.mailchannels.net ~all";
	const dns: DNSResponse = await fetchDns(domain, "TXT");
	let verified = false;

	if (!dns.Answer) {
		return verified;
	}

	dns.Answer.forEach((ans) => {
		if (ans.data === SPF_VALUE) {
			verified = true;
		}
	});
	return verified;
}

async function verifyDomainLockdown(domain: string) {
	const DNS_VALUE = "v=mc1 cfid=" + PUBLIC_APP_URL;
	const dns: DNSResponse = await fetchDns("_mailchannels." + domain, "TXT");

	let verified = false;

	if (!dns.Answer) {
		return verified;
	}

	dns.Answer.forEach((ans) => {
		if (ans.data === DNS_VALUE) {
			verified = true;
		}
	});
	return verified;
}

async function verifyDkim(domain: string) {
	const dns: DNSResponse = await fetchDns("mailflare._domainkey." + domain, "TXT");
	let verified = false;

	if (!dns.Answer) {
		return verified;
	}
	dns.Answer.forEach((ans) => {
		if (ans.data.includes("v=DKIM1; p=")) {
			verified = true;
		}
	});

	return verified;
}

async function verifyDmarc(domain: string) {
	const DNS_VALUE = "v=DMARC1; p=none";
	const dns: DNSResponse = await fetchDns("_dmarc." + domain, "TXT");

	let verified = false;

	if (!dns.Answer) {
		return verified;
	}
	dns.Answer.forEach((ans) => {
		if (ans.data === DNS_VALUE) {
			verified = true;
		}
	});
	return verified;
}

async function fetchDns(domain: string, type: string) {
	const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
	return res.json();
}

export function isDomainVerified(status: DomainsSelect["status"]): "Verified" | "Pending" {
	if (status.spf === "Verified" && status["domain-lockdown"] === "Verified") {
		return "Verified";
	}
	return "Pending";
}

interface DNSResponse {
	Status: number;
	TC: boolean;
	RD: boolean;
	RA: boolean;
	AD: boolean;
	CD: boolean;
	Question: Question[];
	Answer?: Answer[];
	Comment: string;
}

interface Answer {
	name: string;
	type: number;
	TTL: number;
	data: string;
}

interface Question {
	name: string;
	type: number;
}
