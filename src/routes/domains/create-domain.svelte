<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { createDomainSchema, type CreateDomainSchema } from "@/schema/domains";
	import { PlusIcon } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	export let form: SuperValidated<Infer<CreateDomainSchema>>;
	let className: string | undefined = undefined;
	export { className as class };

	const suform = superForm(form, {
		validators: zodClient(createDomainSchema),
		onError({ result }) {
			toast.error(result.error.message, { class: "font-inter" });
		}
	});

	const { form: formData, enhance } = suform;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ class: className })}>
		<PlusIcon class="mr-2 size-4" />
		Add Domain</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add domain</Dialog.Title>
			<Dialog.Description>
				After adding the domain. You need to verify the domain
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/create-domain" use:enhance>
			<Form.Field form={suform} name="domainUrl">
				<Form.Control let:attrs>
					<Form.Label>Domain</Form.Label>
					<Input {...attrs} bind:value={$formData.domainUrl} placeholder="subdomain.example.com" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Dialog.Footer>
				<Form.Button>Submit</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
