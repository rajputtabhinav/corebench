import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { BiosArchive } from "@/components/domain/bios-archive";
import { getBiosConfigs } from "@/lib/data";

export const metadata: Metadata = { title: "BIOS Archive" };

export default function BiosPage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        title="BIOS Archive"
        description="Captured BIOS configurations across the fleet — every setting, profile and version, preserved."
      />
      <BiosArchive configs={getBiosConfigs()} />
    </PageContainer>
  );
}
