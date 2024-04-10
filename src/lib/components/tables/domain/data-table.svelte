<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import type { DomainsSelect } from "@/server/db/types";
	import { DataBodyRow, Render, Subscribe, createRender, createTable } from "svelte-headless-table";
	import { readable } from "svelte/store";
	import DomainCell from "./domain-cell.svelte";
	import { formateDate } from "@/index";
	import StatusBadge from "../status-badge.svelte";
	import { isDomainVerified } from "@/verify-dns";

	export let data: DomainsSelect[];

	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: "domainUrl",
			header: "Domain",
			cell: ({ row }) => {
				if (!(row instanceof DataBodyRow)) {
					return "";
				}
				return createRender(DomainCell, {
					text: row.original.domainUrl,
					href: "/domains/" + row.original.id
				});
			}
		}),
		table.column({
			accessor: "createdAt",
			header: "Created At",
			cell: ({ value }) => {
				return formateDate(value);
			}
		}),
		table.column({
			accessor: "status",
			header: "Status",
			cell: ({ value }) => {
				const status = isDomainVerified(value);

				return createRender(StatusBadge, { status });
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
