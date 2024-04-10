<script lang="ts">
	import { cn } from "@/utils";

	let className = "";
	export let key: string;
	export { className as class };
</script>

<div class={cn("min-w-[150px] grow", className)}>
	<span class="text-xs uppercase text-muted-foreground">{key}</span>
	<p>
		<slot />
	</p>
</div>
