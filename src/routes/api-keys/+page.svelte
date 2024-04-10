<script lang="ts">
	import DataTable from "@/components/tables/api-keys/data-table.svelte";
	import type { PageData } from "./$types";
	import EmptyState from "@/components/empty-state.svelte";
	import CreateApiKey from "./create-api-key.svelte";

	export let data: PageData;
</script>

<div class="container space-y-5">
	<div class="flex items-center justify-between">
		<h1 class="text-lg font-semibold md:text-2xl">API Keys</h1>
		{#if data.apiKeys.length > 0}
			<CreateApiKey form={data.form} domains={data.domains} />
		{/if}
	</div>

	{#if data.apiKeys.length === 0}
		<EmptyState title="No API keys found" description="Add API key to start sending emails.">
			<CreateApiKey form={data.form} domains={data.domains} class="mt-4" />
		</EmptyState>
	{:else}
		<DataTable data={data.apiKeys} />
	{/if}
</div>
