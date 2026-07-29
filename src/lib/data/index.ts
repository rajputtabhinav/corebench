import {
  activity,
  benchmarks,
  biosConfigs,
  currentUser,
  firmware,
  logFiles,
  reports,
  servers,
  users,
  validations,
} from "./seed";
import type {
  Activity,
  Attachment,
  Comment,
  ID,
  Server,
  Validation,
  ValidationType,
} from "./types";

export * from "./types";
export {
  servers,
  validations,
  benchmarks,
  biosConfigs,
  firmware,
  logFiles,
  reports,
  activity,
  users,
  currentUser,
};

const byDateDesc = (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();

/* ----------------------------- Servers ----------------------------- */
export function getServers(): Server[] {
  return [...servers].sort((a, b) => byDateDesc(a.updatedAt, b.updatedAt));
}
export function getServer(id: ID): Server | undefined {
  return servers.find((s) => s.id === id);
}
export function getRecentlyModifiedServers(n = 5): Server[] {
  return getServers()
    .filter((s) => s.status !== "retired")
    .slice(0, n);
}
export function getActiveServerCount(): number {
  return servers.filter((s) => s.status === "online").length;
}

/* --------------------------- Validations --------------------------- */
export function getValidations(): Validation[] {
  return [...validations].sort((a, b) => byDateDesc(a.date, b.date));
}
export function getValidation(id: ID): Validation | undefined {
  return validations.find((v) => v.id === id);
}
export function getValidationsForServer(serverId: ID): Validation[] {
  return getValidations().filter((v) => v.serverId === serverId);
}
export function getRecentValidations(n = 6): Validation[] {
  return getValidations().slice(0, n);
}
export function getValidationsByType(type: ValidationType): Validation[] {
  return getValidations().filter((v) => v.type === type);
}

/* ---------------------------- Benchmarks --------------------------- */
export function getBenchmarks() {
  return [...benchmarks].sort((a, b) =>
    byDateDesc(getValidation(a.validationId)?.date ?? "", getValidation(b.validationId)?.date ?? ""),
  );
}
export function getBenchmark(id: ID) {
  return benchmarks.find((b) => b.id === id);
}

/* ------------------------------ BIOS ------------------------------- */
export function getBiosConfigs() {
  return [...biosConfigs].sort((a, b) => byDateDesc(a.capturedAt, b.capturedAt));
}
export function getBiosConfig(id: ID) {
  return biosConfigs.find((b) => b.id === id);
}
export function getBiosForServer(serverId: ID) {
  return getBiosConfigs().filter((b) => b.serverId === serverId);
}

/* ---------------------------- Firmware ----------------------------- */
export function getFirmware() {
  return [...firmware].sort((a, b) => byDateDesc(a.date, b.date));
}
export function getFirmwareForServer(serverId: ID) {
  return getFirmware().filter((f) => f.serverId === serverId);
}

/* ------------------------------ Logs ------------------------------- */
export function getLogs() {
  return [...logFiles].sort((a, b) => byDateDesc(a.createdAt, b.createdAt));
}
export function getLog(id: ID) {
  return logFiles.find((l) => l.id === id);
}
export function getLogsForServer(serverId: ID) {
  return getLogs().filter((l) => l.serverId === serverId);
}

/* ----------------------------- Reports ----------------------------- */
export function getReports() {
  return [...reports].sort((a, b) => byDateDesc(a.updatedAt, b.updatedAt));
}
export function getReport(id: ID) {
  return reports.find((r) => r.id === id);
}
export function getReportsForServer(serverId: ID) {
  return getReports().filter((r) => r.serverId === serverId);
}
export function getPendingReviews() {
  return getReports().filter((r) => r.status === "review" || r.status === "draft");
}

/* ---------------------------- Activity ----------------------------- */
export function getActivity(n?: number): Activity[] {
  const sorted = [...activity].sort((a, b) => byDateDesc(a.at, b.at));
  return n ? sorted.slice(0, n) : sorted;
}
export function getActivityForServer(serverId: ID): Activity[] {
  return getActivity().filter((a) => a.serverId === serverId);
}

/* ----------------------------- Users ------------------------------- */
export function getUsers() {
  return users;
}
export function getCurrentUser() {
  return currentUser;
}

/* ------------------- Derived: comments & uploads ------------------- */
export interface CommentRef extends Comment {
  validationId: ID;
  validationTitle: string;
  serverId: ID;
}
export function getRecentComments(n = 5): CommentRef[] {
  const out: CommentRef[] = [];
  for (const v of validations) {
    for (const cm of v.comments) {
      out.push({ ...cm, validationId: v.id, validationTitle: v.title, serverId: v.serverId });
      for (const reply of cm.replies ?? []) {
        out.push({ ...reply, validationId: v.id, validationTitle: v.title, serverId: v.serverId });
      }
    }
  }
  return out.sort((a, b) => byDateDesc(a.createdAt, b.createdAt)).slice(0, n);
}

export interface UploadRef extends Attachment {
  validationId: ID;
  validationTitle: string;
  serverId: ID;
}
export function getLatestUploads(n = 6): UploadRef[] {
  const out: UploadRef[] = [];
  for (const v of validations) {
    for (const att of v.attachments) {
      out.push({ ...att, validationId: v.id, validationTitle: v.title, serverId: v.serverId });
    }
  }
  return out.sort((a, b) => byDateDesc(a.uploadedAt, b.uploadedAt)).slice(0, n);
}

/* ---------------------------- Analytics ---------------------------- */
export function getPassRate(): number {
  const completed = validations.filter((v) =>
    ["passed", "failed", "warning"].includes(v.status),
  );
  if (completed.length === 0) return 0;
  const passed = completed.filter((v) => v.status === "passed").length;
  return Math.round((passed / completed.length) * 1000) / 10;
}
export function getStatusCounts() {
  const counts: Record<string, number> = {};
  for (const v of validations) counts[v.status] = (counts[v.status] ?? 0) + 1;
  return counts;
}
export function getTypeCounts(): { type: ValidationType; count: number }[] {
  const counts = new Map<ValidationType, number>();
  for (const v of validations) counts.set(v.type, (counts.get(v.type) ?? 0) + 1);
  return [...counts.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
}

/* --------------------------- Global search ------------------------- */
export type SearchKind = "server" | "validation" | "report" | "bios" | "firmware" | "log";
export interface SearchResult {
  kind: SearchKind;
  id: ID;
  title: string;
  subtitle: string;
  href: string;
}

export function search(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchResult[] = [];
  const hit = (...parts: (string | undefined)[]) =>
    parts.filter(Boolean).join(" ").toLowerCase().includes(q);

  for (const s of servers) {
    if (hit(s.name, s.vendor, s.model, s.serialNumber, s.assetTag, s.ip, s.cpu, s.nic, ...s.tags))
      out.push({ kind: "server", id: s.id, title: s.name, subtitle: `${s.vendor} · ${s.model}`, href: `/servers/${s.id}` });
  }
  for (const v of validations) {
    const server = getServer(v.serverId);
    if (hit(v.title, v.type, v.status, v.engineer, v.summary, v.notes, ...v.tags))
      out.push({ kind: "validation", id: v.id, title: v.title, subtitle: `${server?.name ?? ""} · ${v.type}`, href: `/validations/${v.id}` });
  }
  for (const r of reports) {
    if (hit(r.title, r.type, r.author, r.status))
      out.push({ kind: "report", id: r.id, title: r.title, subtitle: `${r.type} · ${r.status}`, href: `/reports` });
  }
  for (const b of biosConfigs) {
    const server = getServer(b.serverId);
    if (hit(b.version, b.profile, server?.name, ...b.settings.map((x) => `${x.key} ${x.value}`)))
      out.push({ kind: "bios", id: b.id, title: `BIOS ${b.version}`, subtitle: `${server?.name ?? ""} · ${b.profile}`, href: `/bios` });
  }
  for (const f of firmware) {
    const server = getServer(f.serverId);
    if (hit(f.component, f.version, f.impact, server?.name))
      out.push({ kind: "firmware", id: f.id, title: `${f.component} ${f.version}`, subtitle: `${server?.name ?? ""}`, href: `/firmware` });
  }
  for (const l of logFiles) {
    if (hit(l.name, l.source, l.content))
      out.push({ kind: "log", id: l.id, title: l.name, subtitle: `${l.source} · ${l.level}`, href: `/logs?log=${l.id}` });
  }
  return out.slice(0, limit);
}
