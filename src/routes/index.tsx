import { createFileRoute } from "@tanstack/react-router";
import { ExplorerApp } from "@/components/explorer/explorer-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ExplorerApp />;
}
