import {
  Box,
  Button,
  Grid,
  Group,
  Modal,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { AppHeader } from "#/components/home/AppHeader";
import { ConfigForm } from "#/components/home/ConfigForm";
import { ScriptPreview } from "#/components/home/ScriptPreview";
import { buildScript } from "#/lib/script-builder";
import { DEFAULT_CONFIG, type VpsConfig } from "#/lib/vps-config";

export const Route = createFileRoute("/")({ component: HomePage });

// ── Page component ────────────────────────────────────────────────────────────

function HomePage() {
  const [config, setConfig] = useState<VpsConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");

  const update = useCallback(
    <K extends keyof VpsConfig>(key: K, value: VpsConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const script = useMemo(() => buildScript(config), [config]);

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

  function handleResetConfirm() {
    setConfig(DEFAULT_CONFIG);
    setCopied(false);
    setResetModalOpen(false);
  }

  const isDark = computedScheme === "dark";

  return (
    <Box mih="100dvh">
      <AppHeader
        copied={copied}
        isDark={isDark}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onReset={() => setResetModalOpen(true)}
        onToggleTheme={() => setColorScheme(isDark ? "light" : "dark")}
      />

      <Modal
        opened={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset all options?"
        centered
      >
        <Text fz="sm" c="dimmed" mb="md">
          This will restore all configuration fields to their default values.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="default"
            size="xs"
            onClick={() => setResetModalOpen(false)}
          >
            Cancel
          </Button>
          <Button color="red" size="xs" onClick={handleResetConfirm}>
            Yes, reset
          </Button>
        </Group>
      </Modal>

      <Box px={{ base: "md", sm: "xl" }} py="lg" maw={1400} mx="auto">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <ConfigForm config={config} update={update} />
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
