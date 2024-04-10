<script lang="ts">
	import { invalidate } from "$app/navigation";
	import * as Alert from "$lib/components/ui/alert";
	import { HEADERS } from "$lib/dns-headers";
	import { dnsTableData } from "@/components/tables/domain/dns-store";
	import DnsTable from "@/components/tables/domain/dns-table.svelte";
	import { Badge } from "@/components/ui/badge";
	import { Button } from "@/components/ui/button";
	import { formateDate } from "@/index";
	import { verifyDnsSchema } from "@/schema/domains";
	import { AlertCircleIcon } from "lucide-svelte";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "./$types";

	export let data: PageData;
	let loading = false;

	const form = superForm(data.form, {
		validators: zodClient(verifyDnsSchema),
		onSubmit() {
			loading = true;
		},
		onResult() {
			invalidate(() => true);
			loading = false;
		}
	});
	const { enhance } = form;

	$: {
		dnsTableData.set(
			HEADERS.map((header) => ({ ...header, status: data.domain.status[header.id] }))
		);
	}
</script>

<div class="container space-y-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<span class="text-sm text-muted-foreground">Domain</span>
			<h1 class="text-lg font-bold tracking-tight md:text-3xl">
				{data.domain.domainUrl}
			</h1>
		</div>
		<div>
			<form method="POST" action="?/verify-dns" use:enhance>
				<Button type="submit" name="domainId" value={data.domain.id} {loading}
					>Verify DNS Records</Button
				>
			</form>
		</div>
	</div>
	<div class="flex flex-wrap gap-3 md:gap-16">
		<div>
			<span class="text-xs uppercase text-muted-foreground">Created</span>
			<p class="text-sm">
				{formateDate(data.domain.createdAt)}
			</p>
		</div>
		<div>
			<span class="text-xs uppercase text-muted-foreground">Status</span>
			<p>
				<Badge class="text-xs" variant="secondary">{data.domain.id}</Badge>
			</p>
		</div>
	</div>

	<div class="rounded-lg border-2 border-dotted p-5">
		<div>
			<p class="text-xl font-bold">DNS Records</p>
			<Alert.Root class="mt-4">
				<AlertCircleIcon class="size-4" />
				<Alert.Title>DNS Records Setup</Alert.Title>
				<Alert.Description
					>Go to your DNS provider's settings page and add the DNS records listed. After adding
					them, click the "Verify DNS Records" button above to confirm.</Alert.Description
				>
			</Alert.Root>
		</div>
		<div class="mt-2">
			<DnsTable />
		</div>
	</div>
</div>
