<script lang="ts">
	import DataTable from "@/components/tables/domain/data-table.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h1>Domains Page</h1>
<DataTable data={data.domains} />
