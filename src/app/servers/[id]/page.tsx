import { notFound } from "next/navigation";
import { ServerWorkspace } from "@/components/server/server-workspace";
import {
  getActivityForServer,
  getBiosForServer,
  getFirmwareForServer,
  getLogsForServer,
  getServer,
  getValidationsForServer,
  servers,
} from "@/lib/data";

export function generateStaticParams() {
  return servers.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const server = getServer(id);
  return { title: server?.name ?? "Server" };
}

export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const server = getServer(id);
  if (!server) notFound();

  return (
    <ServerWorkspace
      server={server}
      validations={getValidationsForServer(id)}
      bios={getBiosForServer(id)}
      firmware={getFirmwareForServer(id)}
      logs={getLogsForServer(id)}
      activity={getActivityForServer(id)}
    />
  );
}
