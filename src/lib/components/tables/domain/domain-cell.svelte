<script lang="ts">
	import TableLink from "../table-link.svelte";

	export let text: string;
	export let href: string;
</script>

<div class="flex items-center gap-2">
	<img
		src={`https://www.google.com/s2/favicons?domain=${text}&sz=32`}
		alt=""
		class="size-5 rounded"
	/>
	<TableLink {text} {href} />
</div>
