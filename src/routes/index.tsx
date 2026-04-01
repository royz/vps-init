import { Box } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { ConfigForm } from "#/components/home/ConfigForm";
import { Header } from "#/components/home/Header";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {

  return (
    <Box mih="100dvh" maw={1400} mx="auto" px="md">
      <Header />
      <ConfigForm />
    </Box>
  );
}
