<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Button as ButtonPrimitive } from "bits-ui";
	import { LoaderIcon } from "lucide-svelte";
	import { buttonVariants, type Events, type Props } from "./index.js";

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export { className as class };
	export let loading = false;
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	disabled={loading}
	{...$$restProps}
	on:click
	on:keydown
>
	{#if loading}
		<LoaderIcon class="mr-2 size-4 animate-spin" />
	{/if}
	<slot />
</ButtonPrimitive.Root>
