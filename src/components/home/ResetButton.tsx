import { useConfigStore, useHomeUiStore } from "#/stores/home-store";
import { ActionIcon, Button, Group, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RefreshCw } from "lucide-react";

export function ResetButton() {
  const resetConfig = useConfigStore((state) => state.resetConfig);
  const setCopied = useHomeUiStore((state) => state.setCopied);
  const [opened, { open, close }] = useDisclosure();

  function handleResetConfirm() {
    resetConfig();
    setCopied(false);
    close();
  }

  return (
    <>
      <Tooltip label="Reset all options to defaults" withArrow>
        <ActionIcon
          variant="default"
          color="gray"
          size="lg"
          radius="md"
          onClick={open}
        >
          <RefreshCw size={16} />
        </ActionIcon>
      </Tooltip>
      <Modal
        opened={opened}
        onClose={close}
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
            onClick={close}
          >
            Cancel
          </Button>
          <Button color="red" size="xs" onClick={handleResetConfirm}>
            Yes, reset
          </Button>
        </Group>
      </Modal>
    </>
  )
}