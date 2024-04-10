<script lang="ts">
	import { formateDate } from "@/index";
	import type { PageData } from "./$types";
	import { Badge } from "@/components/ui/badge";
	import KeyValue from "@/components/key-value.svelte";

	export let data: PageData;
</script>

<div class="container max-w-6xl space-y-5">
	<div>
		<span class="text-sm text-muted-foreground">API Key</span>
		<h1 class="text-lg font-bold tracking-tight md:text-3xl">
			{data.apiKey.name}
		</h1>
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
		<KeyValue key="Token">
			<Badge variant="secondary">{data.apiKey.token}</Badge>
		</KeyValue>
		<KeyValue key="Created">
			<p class="text-sm">
				{formateDate(data.apiKey.createdAt)}
			</p>
		</KeyValue>
		<KeyValue key="Permission">
			<p class="text-sm">
				{data.apiKey.permission === "DOMAIN_SPECIFIC" ? "Domain Specific" : "All Domains"}
			</p>
		</KeyValue>
		<KeyValue key="Domain">
			<p class="text-sm">
				{data.apiKey.domain?.domainUrl ?? "All Domains"}
			</p>
		</KeyValue>
		<KeyValue key="Total Uses">
			<p class="text-sm">n times</p>
		</KeyValue>
		<KeyValue key="Last Used">
			<p class="text-sm">Never</p>
		</KeyValue>
	</div>
	<div class="mt-5 flex flex-wrap gap-3 md:gap-7"></div>
</div>
