import { CodeHighlight } from "@mantine/code-highlight";
import { Box, Drawer, Paper, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Eye } from "lucide-react";
import { useMemo } from "react";
import { buildScript } from "#/lib/script-builder";
import { useConfigStore } from "#/stores/home-store";
import { IconButton } from "../IconButton";

export function ScriptPreviewButton() {
  const [opened, { close, toggle }] = useDisclosure();
  const config = useConfigStore((state) => state.config);

  const script = useMemo(() => {
    if (!opened) return "";
    return buildScript(config);
  }, [config, opened]);

  return (
    <>
      <IconButton icon={Eye} hotkey="Mod+P" description="Preview script" onClick={toggle} />
      <Drawer opened={opened} onClose={close} position="right" size="1200">
        <Box py="xs">
          <Paper
            withBorder
            radius="md"
            flex={1}
          >
            <CodeHighlight
              code={script}
              language="bash"
              withCopyButton={true}
              styles={{
                pre: {
                  borderRadius: 0,
                  margin: 0,
                  fontSize: rem(11.5),
                },
              }}
            />
          </Paper>

          {/* {1 && (
            <Alert icon={<Cloud size={14} />} color="orange" variant="light" p="sm" fz="xs">
              <Text fz="xs" fw={600} mb={2}>
                Sensitive values in your script
              </Text>
              <Text fz="xs">
                The downloaded file will contain your sensitive inputs. Store it securely and delete it after use.
              </Text>
            </Alert>
          )} */}
        </Box>
      </Drawer>
    </>
  );
}