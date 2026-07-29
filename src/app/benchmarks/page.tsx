import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { BenchmarksExplorer, type BenchmarkItem } from "@/components/domain/benchmarks-explorer";
import { getBenchmarks, getServer, getValidation } from "@/lib/data";

export const metadata: Metadata = { title: "Benchmarks" };

export default function BenchmarksPage() {
  const items: BenchmarkItem[] = getBenchmarks().flatMap((benchmark) => {
    const validation = getValidation(benchmark.validationId);
    if (!validation) return [];
    const server = getServer(validation.serverId);
    return [
      {
        benchmark,
        validation,
        serverId: validation.serverId,
        serverName: server?.name ?? "—",
      },
    ];
  });

  return (
    <PageContainer size="full">
      <PageHeader
        title="Benchmarks"
        description="Per-product benchmark results with full report detail — metrics vs industry-typical, test methodology, reference comparison and interactive charts."
      />
      <BenchmarksExplorer items={items} />
    </PageContainer>
  );
}
