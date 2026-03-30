/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: necessary for this file */

import codeHighlightCss from "@mantine/code-highlight/styles.css?url";
import { createTheme, MantineProvider } from "@mantine/core";
import mantineCss from "@mantine/core/styles.css?url";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

interface MyRouterContext {
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('mantine-color-scheme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.setAttribute('data-mantine-color-scheme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`;

const theme = createTheme({
  primaryColor: "teal",
  fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
        title: "VPS Init — Bootstrap Script Generator",
      },
    ],
    links: [
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  );
}
