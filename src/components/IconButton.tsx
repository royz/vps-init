import { ActionIcon, type ActionIconProps, Group, Text, Tooltip, type TooltipProps } from "@mantine/core";
import { type Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { DisplayHotkey } from "./DisplayHotkey";

type Props = {
  icon: LucideIcon;
  onClick?: () => void;
  hotkey?: Hotkey;
  description?: string;
} & Omit<ActionIconProps, "children" | "children">;


export function IconButton({ icon, onClick, hotkey, description, ...actionIconProps }: Props) {
  const Icon = icon;

  useHotkey(
    hotkey || "E", // "E" would never be used. It's just to satisfy the type requirement of useHotkey.
    () => onClick?.(),
    { enabled: !!onClick && !!hotkey }
  );

  const tooltipProps = useMemo((): TooltipProps => {
    if (description && hotkey) {
      return {
        label: (
          <Group>
            <Text>{description}</Text>
            <DisplayHotkey hotkey={hotkey} />
          </Group>
        )
      }
    }

    if (description && !hotkey) return { label: description };
    if (!description && hotkey) return { label: <DisplayHotkey hotkey={hotkey} /> };

    return { label: "", disabled: true };
  }, [description, hotkey]);

  return (
    <Tooltip
      {...tooltipProps}
      withArrow
    >
      <ActionIcon
        variant="default"
        size="lg"
        radius="md"
        {...actionIconProps}
      >
        <Icon size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
