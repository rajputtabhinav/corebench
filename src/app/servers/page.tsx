import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { ServersTable, type ServerRow } from "@/components/domain/servers-table";
import { getServers, getValidationsForServer } from "@/lib/data";

export const metadata: Metadata = { title: "Servers" };

export default function ServersPage() {
  const rows: ServerRow[] = getServers().map((s) => ({
    ...s,
    validationCount: getValidationsForServer(s.id).length,
  }));

  return (
    <PageContainer size="wide">
      <PageHeader
        title="Servers"
        description="Every machine under validation — specs, health, and history in one place."
      />
      <ServersTable rows={rows} />
    </PageContainer>
  );
}
