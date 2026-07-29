import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { ValidationsList } from "@/components/domain/validations-list";
import { getValidations } from "@/lib/data";

export const metadata: Metadata = { title: "Validations" };

export default function ValidationsPage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        title="Validations"
        description="Every validation run across the fleet — memory, storage, network, thermal and more."
      />
      <ValidationsList validations={getValidations()} />
    </PageContainer>
  );
}
