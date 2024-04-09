<script lang="ts">
	import type { DNSHeader } from "@/dns-headers";
	import { DataBodyRow, Render, Subscribe, createRender, createTable } from "svelte-headless-table";
	import { readable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import CopyCell from "./copy-cell.svelte";
	import type { DomainsSelect } from "@/server/db/types";
	import StatusBadge from "../status-badge.svelte";
	import { dnsTableData } from "./dns-store";

	const table = createTable(dnsTableData);

	const columns = table.createColumns([
		table.column({
			accessor: "type",
			header: "Type"
		}),
		table.column({
			accessor: "name",
			header: "Name",
			cell: ({ value }) => {
				return createRender(CopyCell, { text: value });
			}
		}),
		table.column({
			accessor: "value",
			header: "Value",
			cell: ({ value }) => {
				return createRender(CopyCell, { text: value });
			}
		}),
		table.column({
			accessor: "ttl",
			header: "TTL"
		}),
		table.column({
			accessor: "required",
			header: "Required"
		}),
		table.column({
			accessor: "status",
			header: "Status",
			cell: ({ value }) => {
				return createRender(StatusBadge, { status: value });
			}
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
