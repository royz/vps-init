import { createFileRoute } from "@tanstack/react-router";
import { Disclaimer } from "#/components/Disclaimer";
import { ConfigForm } from "#/components/home/ConfigForm";
import { Header } from "#/components/home/Header";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "VPS Init | Build a Secure Linux VPS Setup Script",
      },
      {
        name: "description",
        content:
          "Create a secure, repeatable Ubuntu or Debian VPS bootstrap script with SSH hardening, firewall, Fail2Ban, Docker, and more.",
      },
      {
        name: "keywords",
        content:
          "VPS setup, VPS bootstrap script, Ubuntu server setup, Debian server setup, SSH hardening, Fail2Ban, UFW, Docker install script",
      },
      {
        property: "og:title",
        content: "VPS Init | Build a Secure Linux VPS Setup Script",
      },
      {
        property: "og:description",
        content:
          "Generate your Linux VPS initialization script with modern security defaults and optional developer tooling.",
      },
      {
        name: "twitter:title",
        content: "VPS Init | Build a Secure Linux VPS Setup Script",
      },
      {
        name: "twitter:description",
        content:
          "Generate your Linux VPS initialization script with modern security defaults and optional developer tooling.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <main>
      <Header />
      <Disclaimer />
      <ConfigForm />
    </main>
  );
}
