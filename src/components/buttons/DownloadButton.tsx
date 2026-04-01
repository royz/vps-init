import { Download } from "lucide-react";
import { buildScript } from "#/lib/script-builder";
import { useConfigStore } from "#/stores/home-store";
import { IconButton } from "../IconButton";

export function DownloadButton() {
  const config = useConfigStore((state) => state.config);

  function handleDownload() {
    const script = buildScript(config);
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vps-init.sh";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <IconButton onClick={handleDownload} icon={Download} hotkey="Mod+D" description="Download script" />
  )
}