<script lang="ts">
	import type { DomainsSelect } from "@/server/db/types";
	import { Badge } from "../ui/badge";

	export let status: DomainsSelect["status"]["spf"];
</script>

<Badge variant={status}>{status}</Badge>
