import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { Copy, Download, Moon, Server, Sun } from "lucide-react";
import { ResetButton } from "./ResetButton";
import classes from "./Header.module.css";
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

type AppHeaderProps = {
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
};

export function Header({
  copied,
  onCopy,
  onDownload,
}: AppHeaderProps) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Box component="header" className={classes.header}>
      <Group justify="space-between" maw={1400} mx="auto" w="100%" px="xl">
        <Group gap="sm">
          <ThemeIcon variant="filled" color="teal" size={38} radius="md">
            <Server size={20} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4} lh={1.2} c="teal">
              VPS Init
            </Title>
            <Text fz="xs" c="dimmed" lh={1}>
              Bootstrap script generator
            </Text>
          </Stack>
        </Group>
        <Group gap="xs">
          <ResetButton />
          <Tooltip label={copied ? "Copied!" : "Copy script"} withArrow>
            <ActionIcon
              variant={copied ? "filled" : "default"}
              color={copied ? "teal" : undefined}
              size="lg"
              radius="md"
              onClick={onCopy}
            >
              <Copy size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download as .sh file" withArrow>
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              onClick={onDownload}
            >
              <Download size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={colorScheme === "dark" ? "Light mode" : "Dark mode"} withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            >
              {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Box >
  );
}