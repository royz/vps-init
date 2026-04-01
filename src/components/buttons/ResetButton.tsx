import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RefreshCw } from "lucide-react";
import { useConfigStore, useHomeUiStore } from "#/stores/home-store";
import { IconButton } from "../IconButton";

export function ResetButton() {
  const resetConfig = useConfigStore((state) => state.resetConfig);
  const setCopied = useHomeUiStore((state) => state.setCopied);
  const [opened, { toggle, close }] = useDisclosure();

  function handleResetConfirm() {
    resetConfig();
    setCopied(false);
    close();
  }

  return (
    <>
      <IconButton
        icon={RefreshCw}
        onClick={toggle}
        description="Reset all options to defaults"
        hotkey="Mod+R"
        showSuccessState
      />

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