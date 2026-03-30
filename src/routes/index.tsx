import { Box, Grid } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "#/components/home/Header";
import { ConfigForm } from "#/components/home/ConfigForm";
import { ScriptPreview } from "#/components/home/ScriptPreview";
import { buildScript } from "#/lib/script-builder";
import { useConfigStore, useHomeUiStore } from "#/stores/home-store";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const config = useConfigStore((state) => state.config);
  const copied = useHomeUiStore((state) => state.copied);
  const setCopied = useHomeUiStore((state) => state.setCopied);
  const script = buildScript(config);

  function handleCopy() {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vps-init.sh";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box mih="100dvh">
      <Header
        copied={copied}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />
      <Box px={{ base: "md", sm: "xl" }} py="lg" maw={1400} mx="auto">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <ConfigForm />
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }}>
            <ScriptPreview
              hasSensitiveValues={!!(config.userPassword || config.tailscaleAuthKey)}
              script={script}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}
