import {
  Box, Grid, useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "#/components/home/AppHeader";
import { ConfigForm } from "#/components/home/ConfigForm";
import { ScriptPreview } from "#/components/home/ScriptPreview";
import { buildScript } from "#/lib/script-builder";
import { useConfigStore, useHomeUiStore } from "#/stores/home-store";

export const Route = createFileRoute("/")({ component: HomePage });

// ── Page component ────────────────────────────────────────────────────────────

function HomePage() {
  const config = useConfigStore((state) => state.config);
  const copied = useHomeUiStore((state) => state.copied);
  const setCopied = useHomeUiStore((state) => state.setCopied);
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");
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

  const isDark = computedScheme === "dark";

  return (
    <Box mih="100dvh">
      <AppHeader
        copied={copied}
        isDark={isDark}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onToggleTheme={() => setColorScheme(isDark ? "light" : "dark")}
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
