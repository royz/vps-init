import codeHighlightCss from "@mantine/code-highlight/styles.css?url";
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import mantineCss from "@mantine/core/styles.css?url";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { config } from "#/config";
import { PostHogProvider } from "#/integrations/posthog";
import appCss from "../styles.css?url";

const theme = createTheme({
  primaryColor: config.color,
  fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
});

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "VPS Init - Bootstrap Script Generator",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/logo.png",
      },
      {
        rel: "stylesheet",
        href: mantineCss,
      },
      {
        rel: "stylesheet",
        href: codeHighlightCss,
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <PostHogProvider>{children}</PostHogProvider>
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  );
}
