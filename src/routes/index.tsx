import { createFileRoute } from "@tanstack/react-router";
import { ConfigForm } from "#/components/home/ConfigForm";
import { Header } from "#/components/home/Header";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main>
      <Header />
      <ConfigForm />
    </main>
  );
}
