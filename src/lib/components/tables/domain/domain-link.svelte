<script lang="ts">
	export let domainUrl = "";
	export let id = "";
</script>

<a href={"/domains/" + id} class="border-b-2 border-dotted border-muted-foreground">
	{domainUrl}
</a>
