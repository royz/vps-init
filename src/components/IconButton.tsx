import {
	ActionIcon,
	type ActionIconProps,
	Group,
	Text,
	Tooltip,
	type TooltipProps,
} from "@mantine/core";
import { type Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { Check, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DisplayHotkey } from "./DisplayHotkey";

type Props = {
	icon: LucideIcon;
	onClick?: () => Promise<void> | void;
	hotkey?: Hotkey;
	description?: string;
	showSuccessState?: boolean;
} & Omit<ActionIconProps, "children" | "children">;

export function IconButton({
	icon,
	onClick,
	hotkey,
	description,
	showSuccessState,
	...actionIconProps
}: Props) {
	const [success, setSuccess] = useState(false);
	const Icon = success ? Check : icon;

	async function handleClick() {
		if (onClick) await onClick();
		if (showSuccessState) {
			setSuccess(true);
			setTimeout(() => setSuccess(false), 1000);
		}
	}

	useHotkey(
		hotkey || "E", // "E" would never be used. It's just to satisfy the type requirement of useHotkey.
		() => handleClick(),
		{ enabled: !!hotkey },
	);

	const tooltipProps = useMemo((): TooltipProps => {
		if (description && hotkey) {
			return {
				label: (
					<Group>
						<Text>{description}</Text>
						<DisplayHotkey hotkey={hotkey} />
					</Group>
				),
			};
		}

		if (description && !hotkey) return { label: description };
		if (!description && hotkey)
			return { label: <DisplayHotkey hotkey={hotkey} /> };

		return { label: "", disabled: true };
	}, [description, hotkey]);

	return (
		<Tooltip {...tooltipProps} withArrow>
			<ActionIcon
				variant="default"
				size="lg"
				radius="md"
				onClick={handleClick}
				{...actionIconProps}
			>
				<Icon size={16} />
			</ActionIcon>
		</Tooltip>
	);
}
