import { Copy } from "lucide-react";
import { buildScript } from "#/lib/script-builder";
import { useConfigStore } from "#/stores/home-store";
import { IconButton } from "../IconButton";

export function CopyButton() {
	const config = useConfigStore((state) => state.config);

	async function handleCopy() {
		const script = buildScript(config);
		await navigator.clipboard.writeText(script);
	}

	return (
		<IconButton
			onClick={handleCopy}
			icon={Copy}
			hotkey="Mod+C"
			showSuccessState
			description="Copy to clipboard"
		/>
	);
}
