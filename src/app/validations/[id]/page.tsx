import { notFound } from "next/navigation";
import { ValidationWorkspace } from "@/components/validation/validation-workspace";
import { getServer, getValidation, validations } from "@/lib/data";

export function generateStaticParams() {
  return validations.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = getValidation(id);
  return { title: v?.title ?? "Validation" };
}

export default async function ValidationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const validation = getValidation(id);
  if (!validation) notFound();

  return <ValidationWorkspace validation={validation} server={getServer(validation.serverId)} />;
}
