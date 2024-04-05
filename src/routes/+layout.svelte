<script>
	import "../app.pcss";
	import "@fontsource-variable/inter";
	import { ModeWatcher } from "mode-watcher";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Sheet from "$lib/components/ui/sheet";
	import { CircleUserIcon, MenuIcon, Package2Icon } from "lucide-svelte";
	import Navbar from "@/components/navbar.svelte";
	import ThemeToggle from "@/components/theme-toggle.svelte";
	import { page } from "$app/stores";
	import { Toaster } from "@/components/ui/sonner";
</script>

<ModeWatcher />
<Toaster />
{#if $page.url.pathname !== "/login"}
	<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
		<div class="hidden border-r bg-muted/10 md:block">
			<div class="flex h-full max-h-screen flex-col gap-2">
				<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<a href="/" class="flex items-center justify-center gap-2 text-xl font-bold">
						<span>MailFlare</span>
					</a>
				</div>
				<div class="flex-1">
					<Navbar />
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<header
				class="flex h-14 items-center justify-between gap-4 border-b bg-muted/10 px-4 md:justify-end lg:h-[60px] lg:px-6"
			>
				<Sheet.Root>
					<Sheet.Trigger asChild let:builder>
						<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
							<MenuIcon class="h-5 w-5" />
							<span class="sr-only">Toggle navigation menu</span>
						</Button>
					</Sheet.Trigger>
					<Sheet.Content side="left" class="flex flex-col">
						<Navbar />
					</Sheet.Content>
				</Sheet.Root>
				<div>
					<ThemeToggle />
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
								<CircleUserIcon class="h-5 w-5" />
								<span class="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Settings</DropdownMenu.Item>
							<DropdownMenu.Item>Support</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Logout</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</header>
			<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<slot />
{/if}

<style>
	:global(body) {
		font-family: "Inter Variable", sans-serif;
	}
</style>
