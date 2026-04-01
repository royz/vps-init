import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "../IconButton";

export function ThemeToggleButton() {
	const { setColorScheme, colorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<IconButton
			icon={colorScheme === "dark" ? Sun : Moon}
			onClick={() =>
				setColorScheme(computedColorScheme === "light" ? "dark" : "light")
			}
			description={
				colorScheme === "dark" ? "Turn on light mode" : "Turn on dark mode"
			}
			hotkey="Mod+`"
		/>
	);
}
