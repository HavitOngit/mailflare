<script lang="ts">
	import EmptyState from "$lib/components/empty-state.svelte";

	import DataTable from "@/components/tables/domain/data-table.svelte";

	import type { PageData } from "./$types";
	import CreateDomain from "./create-domain.svelte";

	export let data: PageData;
</script>

<div class="container max-w-6xl space-y-5">
	<div class="flex items-center justify-between">
		<h1 class="text-lg font-semibold md:text-2xl">Domains</h1>
		{#if data.domains.length > 0}
			<CreateDomain form={data.form} />
		{/if}
	</div>

	{#if data.domains.length === 0}
		<EmptyState title="No domains found" description="Add domain to start sending emails.">
			<CreateDomain form={data.form} class="mt-4" />
		</EmptyState>
	{:else}
		<DataTable data={data.domains} />
	{/if}
</div>
