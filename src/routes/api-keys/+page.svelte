<script lang="ts">
	import DataTable from "@/components/tables/api-keys/data-table.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h1>API Keys Page</h1>

<DataTable data={data.apiKeys} />
