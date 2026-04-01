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

const siteName = "VPS Init";
const siteTitle = "VPS Init - VPS Setup Script Generator";
const siteDescription = "Generate a customized production-ready bash script for setting up Ubuntu/Debian VPS.";
const keywords = ["VPS setup", "VPS bootstrap script", "Ubuntu server setup", "Debian server setup", "SSH hardening", "Fail2Ban", "UFW", "Docker install script"];

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
        title: siteTitle,
      },
      {
        name: "description",
        content: siteDescription,
      },
      {
        name: "robots",
        content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      {
        name: "theme-color",
        content: "#1098ad",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: siteName,
      },
      {
        property: "og:title",
        content: siteTitle,
      },
      {
        property: "og:description",
        content: siteDescription,
      },
      {
        property: "og:image",
        content: "/preview.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: siteTitle,
      },
      {
        name: "twitter:description",
        content: siteDescription,
      },
      {
        name: "twitter:image",
        content: "/preview.png",
      },
      {
        name: "keywords",
        content: keywords.join(", "),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/",
      },
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
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static trusted JSON-LD
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: siteName,
              description: siteDescription,
              url: "https://vpsinit.com",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Linux",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              keywords: keywords.join(", "),
            }),
          }}
        />
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
