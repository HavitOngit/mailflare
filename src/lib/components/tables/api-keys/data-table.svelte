<script lang="ts">
	import type { ApiKeySelect } from "@/server/db/types";
	import { DataBodyRow, Render, Subscribe, createRender, createTable } from "svelte-headless-table";
	import { readable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import TokenCell from "./token-cell.svelte";
	import TableLink from "../table-link.svelte";
	import { formateDate } from "@/index";

	export let data: ApiKeySelect[];

	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: "name",
			header: "Name",
			cell: ({ row }) => {
				if (!(row instanceof DataBodyRow)) {
					return "";
				}
				return createRender(TableLink, {
					text: row.original.name,
					href: "/api-keys/" + row.original.id
				});
			}
		}),
		table.column({
			accessor: "id",
			header: "ID"
		}),
		table.column({
			accessor: "token",
			header: "Token",
			cell: ({ row }) => {
				if (!(row instanceof DataBodyRow)) {
					return "";
				}
				return createRender(TokenCell, {
					token: row.original.token
				});
			}
		}),
		table.column({
			accessor: "permission",
			header: "Permission",
			cell: ({ value }) => {
				return value === "ALL" ? "All Domains" : "Domain Specific";
			}
		}),
		table.column({
			accessor: "createdAt",
			header: "Created",
			cell: ({ value }) => {
				return formateDate(value);
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
									<div class="py-2">
										<Render of={cell.render()} />
									</div>
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
