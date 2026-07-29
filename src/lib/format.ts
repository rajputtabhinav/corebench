/** Formatting helpers — engineering-friendly, locale-stable. */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDate(input: string | number | Date): Date {
  return input instanceof Date ? input : new Date(input);
}

/** "02 Jun 2026" */
export function formatDate(input: string | number | Date): string {
  const d = toDate(input);
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "02 Jun 2026, 14:32" */
export function formatDateTime(input: string | number | Date): string {
  const d = toDate(input);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(d)}, ${hh}:${mm}`;
}

/** "2h ago", "3d ago", "just now" */
export function relativeTime(input: string | number | Date): string {
  const d = toDate(input).getTime();
  const diff = Date.now() - d;
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

/** Thousands separators, optional fixed decimals. */
export function formatNumber(n: number, decimals?: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals ?? 2,
  });
}

/** Compact large counts: 1_240_000 -> "1.24M". */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return formatNumber(n, 0);
}

/** Bytes -> human readable (binary). */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${units[i]}`;
}

/** Seconds -> "2h 14m", "45m 12s", "38s". */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Initials for avatars: "Abhinav Rajput" -> "AR". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((p) => /[a-z0-9]/i.test(p.charAt(0)))
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}
