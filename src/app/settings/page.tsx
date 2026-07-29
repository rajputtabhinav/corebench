import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { SettingsView } from "@/components/domain/settings-view";
import { getCurrentUser, getUsers } from "@/lib/data";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your profile, appearance, preferences and team." />
      <SettingsView user={getCurrentUser()} team={getUsers()} />
    </PageContainer>
  );
}
