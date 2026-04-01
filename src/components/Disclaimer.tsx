import { Button, Container, Group, List, Paper, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { config } from "#/config";

export function Disclaimer() {
  const theme = useMantineTheme();
  const [value, setValue] = useState<"yes" | "no" | "unknown">("unknown");

  const key = "disclaimer-acknowledged";

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === "true") {
      setValue("yes");
    } else {
      setValue("no");
    }
  }, [])

  function acknowledgeDisclaimer() {
    localStorage.setItem(key, "true");
    setValue("yes");
  }

  if (value === "no") {
    return (
      <Container py="lg">
        <Paper bd={`1px solid ${theme.colors[config.color][1]}`} bg={theme.colors[config.color][0]} p="md" radius="md">
          <List fz="sm">
            <List.Item>The generated script is suitable for Ubuntu/Debian based systems for now</List.Item>
            <List.Item>This is a client only tool. Your configuration will not be sent to any server</List.Item>
            <List.Item>Analytics data is collected anonymously via posthog. All input fields are masked.</List.Item>
          </List>
          <Group justify="flex-end">
            <Button color={config.color} radius="md" size="xs" onClick={acknowledgeDisclaimer}>Got it</Button>
          </Group>
        </Paper>
      </Container>
    )
  }

  return null;
}