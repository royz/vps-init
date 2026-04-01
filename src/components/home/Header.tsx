import {
  ActionIcon,
  Anchor,
  Box,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip, useComputedColorScheme, useMantineColorScheme
} from "@mantine/core";
import { Copy, Download, ExternalLink, Moon, Server, Sun } from "lucide-react";
import { logCustomEvent } from "#/integrations/posthog";
import { DisplayHotkey } from "../DisplayHotkey";
import classes from "./Header.module.css";
import { ResetButton } from "./ResetButton";
import { ScriptPreviewButton } from "./ScriptPreviewButton";

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
      <Group justify="space-between" w="100%">
        <Group gap="sm">
          <ThemeIcon variant="filled" color="teal" size={38} radius="md">
            <Server size={20} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4} lh={1.2} c="teal">
              VPS Init
            </Title>
            <Group gap={6} align="center">
              <Text fz="xs" c="dimmed" lh={1}>
                Bootstrap script generator by
              </Text>
              <Anchor
                href="https://royz.dev?utm_source=vps-init"
                target="_blank"
                fz="xs"
                underline="always"
                c="teal"
                rel="noopener"
                inline
                aria-label="Visit my personal website royz.dev"
                onClick={() => logCustomEvent("visit-personal-website")}
              >
                <Group gap={5}>
                  <Text size="sm">
                    royz.dev
                  </Text>
                  <ExternalLink size={12} />
                </Group>
              </Anchor>
            </Group>
          </Stack>
        </Group>
        <Group gap="xs">
          <ScriptPreviewButton />
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