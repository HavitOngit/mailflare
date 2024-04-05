<script lang="ts">
	export let title: string;
	export let description: string;
</script>

<div
	class="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-16 shadow-sm"
>
	<h3 class="text-2xl font-bold tracking-tight">{title}</h3>
	<p class="text-sm text-muted-foreground">{description}</p>
	<slot />
</div>
