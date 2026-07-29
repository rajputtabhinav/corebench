import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { LogsView } from "@/components/domain/logs-view";
import { getLogs } from "@/lib/data";

export const metadata: Metadata = { title: "Logs" };

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ log?: string }>;
}) {
  const { log } = await searchParams;
  return (
    <PageContainer size="full">
      <PageHeader
        title="Logs"
        description="Captured run logs with search, filtering, syntax highlighting, copy and download."
      />
      <LogsView logs={getLogs()} initialLogId={log} />
    </PageContainer>
  );
}
