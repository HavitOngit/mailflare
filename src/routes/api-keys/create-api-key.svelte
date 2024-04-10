<script lang="ts">
	import { browser } from "$app/environment";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import * as Alert from "$lib/components/ui/alert";
	import { Label } from "$lib/components/ui/label";
	import { copyText } from "@/copy";
	import { createApiKeySchema, type CreateApiKeySchema } from "$lib/schema/api-keys";
	import type { ApiKeySelect, DomainsSelect } from "$lib/server/db/types";
	import { AlertTriangleIcon, CopyCheckIcon, CopyIcon, PlusIcon } from "lucide-svelte";
	import { onDestroy } from "svelte";
	import { toast } from "svelte-sonner";
	import SuperDebug, { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	export let form: SuperValidated<Infer<CreateApiKeySchema>>;
	export let domains: DomainsSelect[];
	let className: string | undefined = undefined;
	export { className as class };

	let createApiDialogOpen = false;
	let copyApiKeyDialogOpen = false;

	let apiKey: ApiKeySelect | undefined;
	let apiKeyCopied = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const suform = superForm(form, {
		validators: zodClient(createApiKeySchema),
		onError({ result }) {
			toast.error(result.error.message, { class: "font-inter" });
		},
		onResult(event) {
			if (event.result.type === "success" && event.result.data) {
				apiKey = event.result.data.key;
				createApiDialogOpen = false;
				copyApiKeyDialogOpen = true;
			}
		}
	});

	const { form: formData, enhance } = suform;

	$: selectedPermission = $formData.permission
		? {
				label: getReadablePermission($formData.permission),
				value: $formData.permission
			}
		: undefined;

	$: selectedDomain = $formData.domainId
		? {
				label: getDomainUrlFromId($formData.domainId),
				value: $formData.domainId
			}
		: undefined;

	function getDomainUrlFromId(domainId: string) {
		return domains.find((d) => d.id === domainId)?.domainUrl;
	}

	function getReadablePermission(permission: string) {
		return permission === "DOMAIN_SPECIFIC" ? "Domain Specific" : "All Domains";
	}

	async function copyApiKey(apiKey: string) {
		await copyText(apiKey);
		apiKeyCopied = true;
		timer = setTimeout(() => {
			apiKeyCopied = false;
		}, 1000);
	}

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<Dialog.Root bind:open={createApiDialogOpen}>
	<Dialog.Trigger class={buttonVariants({ class: className })}>
		<PlusIcon class="mr-2 size-4" />
		Add API Key</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add API Key</Dialog.Title>
		</Dialog.Header>
		<form method="POST" action="?/create-api-key" use:enhance>
			<Form.Field form={suform} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} placeholder="Your API Key name" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field form={suform} name="permission">
				<Form.Control let:attrs>
					<Form.Label>Permission</Form.Label>
					<Select.Root
						selected={selectedPermission}
						onSelectedChange={(v) => {
							v && ($formData.permission = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select a verified email to display" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="ALL" label="All Domains" />
							<Select.Item value="DOMAIN_SPECIFIC" label="Domain Specific" />
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.permission} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $formData.permission === "DOMAIN_SPECIFIC"}
				<Form.Field form={suform} name="domainId">
					<Form.Control let:attrs>
						<Form.Label>Domain</Form.Label>
						<Select.Root
							selected={selectedDomain}
							onSelectedChange={(v) => {
								v && ($formData.domainId = v.value);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select a domain" />
							</Select.Trigger>
							<Select.Content>
								{#each domains as domain}
									<Select.Item value={domain.id} label={domain.domainUrl} />
								{/each}
							</Select.Content>
						</Select.Root>
						<input hidden bind:value={$formData.domainId} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
			<Dialog.Footer>
				<Form.Button>Submit</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={copyApiKeyDialogOpen}>
	<AlertDialog.Content class="sm:max-w-[425px]">
		<AlertDialog.Header>
			<AlertDialog.Title>Copy API Key</AlertDialog.Title>
		</AlertDialog.Header>
		{#if apiKey}
			<Alert.Root
				class="flex gap-3 border-yellow-600 text-yellow-600 dark:border-yellow-500 dark:text-yellow-500"
			>
				<div>
					<AlertTriangleIcon class="size-4" />
				</div>
				<Alert.Title>You can only see this key once. Store it safely.</Alert.Title>
			</Alert.Root>
			<Label>API Key</Label>
			<div class="flex gap-2">
				<Input value={apiKey.token} readonly />
				<Button variant="outline" size="icon" on:click={() => copyApiKey(apiKey?.token || "")}>
					{#if apiKeyCopied}
						<CopyCheckIcon class="size-4 text-green-700 dark:text-green-500" />
					{:else}
						<CopyIcon class="size-4" />
					{/if}
				</Button>
			</div>
		{/if}
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
