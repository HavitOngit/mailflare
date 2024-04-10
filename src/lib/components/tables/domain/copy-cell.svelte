<script lang="ts">
	import { copyText } from "@/copy";
	import { cn } from "@/utils";
	import { ClipboardCheck, ClipboardCopy } from "lucide-svelte";
	import { onDestroy } from "svelte";

	export let text: string;
	let className: string = "";
	export { className as class };

	let copied = false;
	let timer: ReturnType<typeof setTimeout>;

	async function copy(text: string) {
		await copyText(text);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<button class={cn("group flex w-full items-center gap-2", className)} on:click={() => copy(text)}>
	{text}
	<div class="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
		{#if !copied}
			<ClipboardCopy class="size-4" />
		{:else}
			<ClipboardCheck class="size-4 text-green-700 dark:text-green-500" />
		{/if}
	</div>
</button>
