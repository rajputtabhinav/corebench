import Link from "next/link";
import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";
import { PageContainer } from "@/components/shell/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status";
import { Avatar } from "@/components/ui/avatar";
import { Stagger, StaggerItem } from "@/components/motion";
import { ValidationRow } from "@/components/domain/validation-row";
import { ServerCard } from "@/components/domain/server-card";
import { ActivityFeed } from "@/components/domain/activity-feed";
import { FileIcon } from "@/components/domain/file-icon";
import {
  getActivity,
  getCurrentUser,
  getLatestUploads,
  getPendingReviews,
  getRecentComments,
  getRecentlyModifiedServers,
  getRecentValidations,
  getServer,
} from "@/lib/data";
import { formatBytes, formatDate, relativeTime } from "@/lib/format";

function ViewAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-[12px] font-medium text-accent transition-colors hover:text-accent-600"
    >
      View all <ArrowUpRight className="size-3.5" />
    </Link>
  );
}

export default function DashboardPage() {
  const user = getCurrentUser();
  const recentValidations = getRecentValidations(6);
  const recentServers = getRecentlyModifiedServers(4);
  const recentActivity = getActivity(7);
  const pendingReviews = getPendingReviews();
  const recentComments = getRecentComments(4);
  const latestUploads = getLatestUploads(5);

  return (
    <PageContainer size="wide">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
          {formatDate(new Date())}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
          Good to see you, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Here&apos;s what has moved across the lab recently.
        </p>
      </div>

      <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Recent validations</CardTitle>
                <ViewAll href="/validations" />
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-1">
                <div className="space-y-0.5">
                  {recentValidations.map((v) => (
                    <ValidationRow key={v.id} validation={v} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">
                Recently modified servers
              </h2>
              <ViewAll href="/servers" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentServers.map((s) => (
                <ServerCard key={s.id} server={s} />
              ))}
            </div>
          </StaggerItem>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ActivityFeed items={recentActivity} connected />
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Pending reviews</CardTitle>
                <ViewAll href="/reports" />
              </CardHeader>
              <CardContent className="space-y-1 px-2.5 pb-2.5 pt-1">
                {pendingReviews.map((r) => {
                  const server = getServer(r.serverId);
                  return (
                    <Link
                      key={r.id}
                      href="/reports"
                      className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-surface-2"
                    >
                      <FileIcon kind="pdf" size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-foreground">{r.title}</p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {server?.name} · {r.author.split(" ")[0]}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Recent comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {recentComments.map((cm) => (
                  <div key={cm.id} className="flex gap-3">
                    <Avatar name={cm.author} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px]">
                        <span className="font-semibold text-foreground">{cm.author.split(" ")[0]}</span>{" "}
                        <span className="text-subtle-foreground">· {relativeTime(cm.createdAt)}</span>
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{cm.body}</p>
                      <Link
                        href={`/validations/${cm.validationId}`}
                        className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
                      >
                        <MessageSquare className="size-3" />
                        {cm.validationTitle}
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Latest uploads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0.5 px-2.5 pb-2.5 pt-1">
                {latestUploads.map((u) => (
                  <Link
                    key={u.id}
                    href={`/validations/${u.validationId}`}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-surface-2"
                  >
                    <FileIcon kind={u.kind} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[12.5px] text-foreground">{u.name}</p>
                      <p className="truncate text-[11.5px] text-muted-foreground">
                        {formatBytes(u.size)} · {relativeTime(u.uploadedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </StaggerItem>
        </div>
      </Stagger>
    </PageContainer>
  );
}
