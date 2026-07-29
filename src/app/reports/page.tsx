import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { ReportsView } from "@/components/domain/reports-view";
import { getReports } from "@/lib/data";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        title="Reports"
        description="Validation reports across the fleet — preview any document inline, no download required."
      />
      <ReportsView reports={getReports()} />
    </PageContainer>
  );
}
