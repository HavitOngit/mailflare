<script lang="ts">
	import type { DomainsSelect } from "@/server/db/types";
	import { createTable, Render, Subscribe, DataBodyRow, createRender } from "svelte-headless-table";
	import { readable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DomainLink from "./domain-link.svelte";

	export let data: DomainsSelect[];

	const table = createTable(readable(data));

	/**
	 * TODO:
	 * 1. Add a column for the status of the domain
	 * 2. Fetch the favicon of the domain and display it in the table
	 */
	const columns = table.createColumns([
		table.column({
			accessor: "domainUrl",
			header: "Domain",

			cell: ({ row }) => {
				if (!(row instanceof DataBodyRow)) {
					return "";
				}
				return createRender(DomainLink, {
					domainUrl: row.original.domainUrl,
					id: row.original.id
				});
			}
		}),
		table.column({
			accessor: "createdAt",
			header: "Created At"
		}),
		table.column({
			accessor: "id",
			header: "ID (Status in future)"
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header class="bg-muted">
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs} class="font-semibold">
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									{#if cell.id === "domainUrl"}
										<div class="py-2">
											<Render of={cell.render()} />
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
