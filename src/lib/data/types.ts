import type { Tone } from "@/components/ui/status";

export type ID = string;

export type Role = "Admin" | "Lead Engineer" | "Validation Engineer" | "Viewer";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
}

export type ServerStatus = "online" | "offline" | "maintenance" | "provisioning" | "retired";
export type WarrantyState = "Active" | "Expiring" | "Expired";

export interface Server {
  id: ID;
  name: string;
  vendor: string;
  model: string;
  status: ServerStatus;
  assetTag: string;
  serialNumber: string;
  cpu: string;
  sockets: number;
  cores: number;
  memory: string;
  memoryGb: number;
  storage: string;
  nic: string;
  biosVersion: string;
  bmcVersion: string;
  location: string;
  ip: string;
  owner: string;
  purchaseDate: string;
  warranty: WarrantyState;
  warrantyUntil: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  healthScore: number;
}

export type ValidationType =
  | "Memory"
  | "Storage"
  | "Network"
  | "CPU"
  | "Power"
  | "Thermal"
  | "Firmware"
  | "Custom";

export type ValidationStatus = "passed" | "failed" | "running" | "pending" | "warning";

export interface MetricResult {
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  state?: "pass" | "fail" | "warn";
  hint?: string;
}

export interface SeriesPoint {
  x: string | number;
  [key: string]: number | string;
}

export interface ChartSpec {
  id: string;
  title: string;
  kind: "line" | "area" | "bar";
  unit: string;
  xLabel?: string;
  series: { key: string; label: string; tone?: Tone }[];
  data: SeriesPoint[];
}

export type AttachmentKind =
  | "pdf"
  | "log"
  | "txt"
  | "csv"
  | "xlsx"
  | "png"
  | "jpg"
  | "zip";

export interface Attachment {
  id: ID;
  name: string;
  kind: AttachmentKind;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  /** Inline text for previewable types (log / txt / csv). */
  preview?: string;
}

export interface Comment {
  id: ID;
  author: string;
  body: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Validation {
  id: ID;
  serverId: ID;
  title: string;
  type: ValidationType;
  status: ValidationStatus;
  engineer: string;
  date: string;
  durationSec: number;
  summary: string;
  metrics: MetricResult[];
  charts: ChartSpec[];
  attachments: Attachment[];
  comments: Comment[];
  notes?: string;
  errors: number;
  tags: string[];
}

export interface BiosSetting {
  key: string;
  value: string;
  recommended?: string;
  group: string;
  note?: string;
}

export interface BiosConfig {
  id: ID;
  serverId: ID;
  version: string;
  profile: string;
  capturedAt: string;
  capturedBy: string;
  settings: BiosSetting[];
  notes?: string;
}

export type FirmwareComponent = "BIOS" | "BMC" | "CPLD" | "NIC" | "SSD";
export type FirmwareStatus = "current" | "outdated" | "update-available";

export interface FirmwareEntry {
  id: ID;
  serverId: ID;
  component: FirmwareComponent;
  version: string;
  previousVersion?: string;
  date: string;
  updatedBy: string;
  status: FirmwareStatus;
  impact?: string;
}

export type LogLevel = "info" | "warning" | "error";

export interface LogFile {
  id: ID;
  serverId?: ID;
  validationId?: ID;
  name: string;
  source: string;
  size: number;
  lines: number;
  createdAt: string;
  level: LogLevel;
  content: string;
}

export type ReportStatus = "draft" | "review" | "approved" | "archived";

export interface Report {
  id: ID;
  title: string;
  serverId: ID;
  validationId?: ID;
  type: string;
  status: ReportStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  size: number;
  /** Public path to the actual PDF (served from /public). */
  file?: string;
}

export type ActivityKind =
  | "server.created"
  | "validation.added"
  | "validation.passed"
  | "validation.failed"
  | "firmware.updated"
  | "bios.updated"
  | "benchmark.completed"
  | "comment.added"
  | "file.uploaded"
  | "report.approved";

export interface Activity {
  id: ID;
  kind: ActivityKind;
  actor: string;
  serverId?: ID;
  serverName?: string;
  target?: string;
  targetId?: ID;
  at: string;
  meta?: string;
}

/* --------------------------------------------------------------------------
   Benchmark detail — the report-style "complete detail" for the Benchmarks
   page: product under test, result-vs-industry-typical table, methodology,
   and comparison vs published references. Links to a Validation for charts.
-------------------------------------------------------------------------- */
export type Verdict = "pass" | "warn" | "fail";

export interface Product {
  name: string;
  sku?: string;
  vendor: string;
  category: ValidationType;
  detail?: string;
}

export interface MethodologyStep {
  step: string;
  tool: string;
  purpose: string;
}

/** Generic comparison grid. `columns[0]` is the row-label header; `ourColumn`
    is the index of the "our result" column to emphasize. */
export interface ReferenceTable {
  title: string;
  columns: string[];
  rows: string[][];
  ourColumn?: number;
}

export interface BenchmarkMetricRow {
  metric: string;
  result: string;
  typical: string;
  verdict: Verdict;
}

export interface BenchmarkDetail {
  id: ID;
  validationId: ID;
  product: Product;
  alsoCovers?: Product[];
  metrics: BenchmarkMetricRow[];
  methodology: MethodologyStep[];
  references?: ReferenceTable;
  verdict: string;
}
