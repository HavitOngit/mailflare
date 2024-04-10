/**
 * This function is taken from svelte-copy library.
 * @see https://github.com/ghostdevv/svelte-copy/blob/9fbae5d8b7718f12d074f0042290a9535b0c7e3f/src/lib/copy.ts#L3C1-L31C1
 * @param text
 */
export async function copyText(text: string) {
	if ("clipboard" in navigator) {
		await navigator.clipboard.writeText(text);
	} else {
		/**
		 * This is the fallback deprecated way of copying text to the clipboard. Only runs if it can't find the clipboard API.
		 */
		const element = document.createElement("input");

		element.type = "text";
		element.disabled = true;

		element.style.setProperty("position", "fixed");
		element.style.setProperty("z-index", "-100");
		element.style.setProperty("pointer-events", "none");
		element.style.setProperty("opacity", "0");

		element.value = text;

		document.body.appendChild(element);

		element.click();
		element.select();
		document.execCommand("copy");

		document.body.removeChild(element);
	}
}
