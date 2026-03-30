import { CodeHighlight } from "@mantine/code-highlight";
import { Alert, Box, Group, Paper, rem, ScrollArea, Text, Title } from "@mantine/core";
import { Cloud, FlameKindling } from "lucide-react";

type ScriptPreviewProps = {
  hasSensitiveValues: boolean;
  script: string;
};

export function ScriptPreview({ hasSensitiveValues, script }: ScriptPreviewProps) {
  return (
    <Box
      style={{
        position: "sticky",
        top: rem(95),
        maxHeight: "calc(100dvh - 115px)",
        display: "flex",
        flexDirection: "column",
        gap: rem(12),
      }}
    >
      <Group justify="space-between" align="center">
        <Box>
          <Title order={5} fw={700}>
            Generated script
          </Title>
          <Text fz="xs" c="dimmed">
            vps-init.sh — review before running
          </Text>
        </Box>
      </Group>

      <Paper
        withBorder
        radius="md"
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ScrollArea style={{ flex: 1 }} scrollbarSize={6}>
          <CodeHighlight
            code={script}
            language="bash"
            withCopyButton={false}
            styles={{
              pre: {
                borderRadius: 0,
                margin: 0,
                fontSize: rem(11.5),
              },
            }}
          />
        </ScrollArea>
      </Paper>

      <Paper withBorder radius="md" p="sm">
        <Group gap="xs" align="flex-start">
          <FlameKindling
            size={15}
            color="var(--mantine-color-teal-6)"
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <Box>
            <Text fz="xs" fw={600} mb={4}>
              How to run
            </Text>
            <Text fz="xs" c="dimmed">
              Download, review, upload to your server, then:
            </Text>
            <Text fz="xs" ff="monospace" mt={4}>
              sudo bash vps-init.sh
            </Text>
          </Box>
        </Group>
      </Paper>

      {hasSensitiveValues && (
        <Alert icon={<Cloud size={14} />} color="orange" variant="light" p="sm" fz="xs">
          <Text fz="xs" fw={600} mb={2}>
            Sensitive values in your script
          </Text>
          <Text fz="xs">
            The downloaded file will contain your sensitive inputs. Store it securely and delete it after use.
          </Text>
        </Alert>
      )}
    </Box>
  );
}