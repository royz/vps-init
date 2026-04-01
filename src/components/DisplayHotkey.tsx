import { Group, Kbd } from "@mantine/core";
import { formatForDisplay, type Hotkey } from "@tanstack/react-hotkeys";
import classes from "./DisplayHotkey.module.css";

export function DisplayHotkey({ hotkey }: { hotkey: Hotkey }) {
  const keys = formatForDisplay(hotkey).split(/[+ ]+/);
  return (
    <Group className={classes.kbdGroup}>
      {keys.map((key, index) => (
        <Kbd className={classes.kbdKey} key={`${key}${index}`} size="xs">
          {key}
        </Kbd>
      ))}
    </Group>
  )
}