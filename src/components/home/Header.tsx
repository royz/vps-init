import {
  Anchor,
  Box,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { ExternalLink, Server } from "lucide-react";
import { logCustomEvent } from "#/integrations/posthog";
import { CopyButton } from "../buttons/CopyButton";
import { DownloadButton } from "../buttons/DownloadButton";
import { ResetButton } from "../buttons/ResetButton";
import { ScriptPreviewButton } from "../buttons/ScriptPreviewButton";
import { ThemeToggleButton } from "../buttons/ThemeToggleButton";
import classes from "./Header.module.css";


export function Header() {
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
          <CopyButton />
          <DownloadButton />
          <ThemeToggleButton />
        </Group>
      </Group>
    </Box >
  );
}