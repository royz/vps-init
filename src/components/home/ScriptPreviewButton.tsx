import { CodeHighlight } from "@mantine/code-highlight";
import { ActionIcon, Alert, Box, Drawer, Group, Paper, rem, ScrollArea, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Cloud, Eye, FlameKindling } from "lucide-react";

type ScriptPreviewProps = {
  hasSensitiveValues: boolean;
  script: string;
};

export function ScriptPreviewButton({ hasSensitiveValues, script }: ScriptPreviewProps) {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <ActionIcon onClick={open}>
        <Eye />
      </ActionIcon>
      <Drawer opened={opened} onClose={close}>
        <Box
          py="xs"
          style={{
            position: "sticky",
            top: "var(--header-height)",
            maxHeight: "calc(100dvh - var(--header-height))",
            display: "flex",
            flexDirection: "column",
            gap: rem(12),
          }}
        >
          <Paper
            withBorder
            radius="md"
            flex={1}
          >
            <ScrollArea style={{ height: "calc(100dvh - var(--header-height) - 115px)" }} scrollbarSize={6}>
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
      </Drawer>
    </>
  );
}