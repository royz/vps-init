import {
  Box,
  Collapse,
  Divider,
  Group,
  Paper,
  Switch,
  Text,
  ThemeIcon,
} from "@mantine/core";
import type { ComponentType, ReactNode } from "react";
import { config } from "#/config";

type SectionCardProps = {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  color?: string;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
  children?: ReactNode;
  alwaysEnabled?: boolean;
};

export function SectionCard({
  title,
  description,
  icon: Icon,
  color = config.color,
  enabled,
  onToggle,
  children,
  alwaysEnabled = false,
}: SectionCardProps) {
  const isOpen = alwaysEnabled || !!enabled;

  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <ThemeIcon
            variant="light"
            color={color}
            size={40}
            radius="md"
            mt={2}
            style={{ flexShrink: 0 }}
          >
            <Icon size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={700} fz="sm" lh={1.3}>
              {title}
            </Text>
            <Text fz="xs" c="dimmed" lh={1.4} mt={2}>
              {description}
            </Text>
          </Box>
        </Group>
        {!alwaysEnabled && onToggle && (
          <Switch
            checked={!!enabled}
            onChange={(event) => onToggle(event.currentTarget.checked)}
            mt={4}
            style={{ flexShrink: 0 }}
          />
        )}
      </Group>

      {isOpen && children && (
        <Collapse in={isOpen}>
          <Divider my="md" />
          {children}
        </Collapse>
      )}
    </Paper>
  );
}
