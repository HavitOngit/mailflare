<script lang="ts">
	import { page } from "$app/stores";
	import { cn } from "@/utils";
	import {
		GlobeIcon,
		HomeIcon,
		LockKeyholeIcon,
		MailIcon,
		SettingsIcon,
		StretchHorizontalIcon,
		type Icon
	} from "lucide-svelte";
	import type { ComponentType } from "svelte";

	type NavLink = {
		label: string;
		href: string;
		icon: ComponentType<Icon>;
	};

	const navlinks: NavLink[] = [
		{ label: "Overview", href: "/overview", icon: HomeIcon },
		{ label: "Emails", href: "/emails", icon: MailIcon },
		{ label: "Domains", href: "/domains", icon: GlobeIcon },
		{ label: "Logs", href: "/logs", icon: StretchHorizontalIcon },
		{ label: "API Keys", href: "/api-keys", icon: LockKeyholeIcon },
		{ label: "Settings", href: "/settings", icon: SettingsIcon }
	];
</script>

<nav class="text-md grid items-start px-2 font-medium md:text-sm lg:px-4">
	{#each navlinks as navLink}
		<a
			href={navLink.href}
			class=" flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:text-primary"
			class:bg-muted={$page.url.pathname.startsWith(navLink.href)}
			class:text-muted-foreground={!$page.url.pathname.startsWith(navLink.href)}
		>
			<svelte:component this={navLink.icon} class="size-5" />
			{navLink.label}
		</a>
	{/each}
</nav>
