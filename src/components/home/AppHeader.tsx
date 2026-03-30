import {
  ActionIcon,
  Box,
  Group,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { Copy, Download, Moon, Server, Sun } from "lucide-react";
import { ResetButton } from "./ResetButton";

type AppHeaderProps = {
  copied: boolean;
  isDark: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onToggleTheme: () => void;
};

export function AppHeader({
  copied,
  isDark,
  onCopy,
  onDownload,
  onToggleTheme,
}: AppHeaderProps) {
  return (
    <Box
      component="header"
      px={{ base: "md", sm: "xl" }}
      py="md"
      style={(theme) => ({
        borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: isDark ? theme.colors.dark[7] : "#fff",
      })}
    >
      <Group justify="space-between" maw={1400} mx="auto">
        <Group gap="sm">
          <ThemeIcon variant="filled" color="teal" size={38} radius="md">
            <Server size={20} />
          </ThemeIcon>
          <Box>
            <Title order={4} lh={1.2} c="teal">
              VPS Init
            </Title>
            <Text fz="xs" c="dimmed" lh={1}>
              Bootstrap script generator
            </Text>
          </Box>
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
          <Tooltip label={isDark ? "Light mode" : "Dark mode"} withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              onClick={onToggleTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Box>
  );
}