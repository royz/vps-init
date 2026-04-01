import { Box } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigForm } from "#/components/home/ConfigForm";
import { Header } from "#/components/home/Header";
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



  return (
    <Box mih="100dvh" maw={1400} mx="auto" px="md">
      <Header
        copied={copied}
        onCopy={handleCopy}
      />
      <ConfigForm />
    </Box>
  );
}
