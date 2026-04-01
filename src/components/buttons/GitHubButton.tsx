import {
	ActionIcon,
	Anchor,
	Image,
	Tooltip,
	useComputedColorScheme,
} from "@mantine/core";
import { logCustomEvent } from "#/integrations/posthog";

export function GitHubButton() {
	const colorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<Tooltip label="View on GitHub" withArrow>
			<Anchor
				href="https://github.com/royz/vps-init"
				target="_blank"
				rel="noopener"
				underline="never"
				c="inherit"
				aria-label="View vps-init on GitHub"
				onClick={() => logCustomEvent("visit-github-repo")}
			>
				<ActionIcon component="span" variant="default" size="lg" radius="md">
					<Image
						src="/github.svg"
						alt="GitHub"
						w={22}
						h={22}
						style={{
							filter:
								colorScheme === "dark"
									? "brightness(0) saturate(100%) invert(1)"
									: "none",
						}}
					/>
				</ActionIcon>
			</Anchor>
		</Tooltip>
	);
}
