import type {
  Activity,
  BenchmarkDetail,
  BiosConfig,
  Comment,
  FirmwareEntry,
  LogFile,
  Report,
  Server,
  User,
  Validation,
} from "./types";

/* ===========================================================================
   CoreBench seed data — sourced from real Netweb Technologies / Tyrone Systems
   engineering validation reports (May–Jun 2026). All metrics, server specs,
   firmware versions and findings are taken verbatim from the six reports:
     • 172.16.13.217 — 3-hour DDR5 memory validation (01 Jun 2026)
     • 172.16.13.217 — 256 GB + 128 GB two-campaign memory validation (27 May)
     • 172.16.13.217 — 3-hour NVMe SSD validation (02 Jun 2026)
     • 172.16.13.19  — memory validation + 500 MHz CPU lock finding (28 May)
     • 25G NIC bonding A(172.16.12.131) ↔ B(172.16.13.108) (28 May)
     • 100 GbE / RoCE v2 srv218 ↔ srv148 (21 May 2026)
   Engineer of record: Shailendra Rajput.
=========================================================================== */

export const users: User[] = [
  { id: "u-abhinav", name: "Abhinav / Shailendra Rajput", email: "shailendra.kumar@netwebindia.com", role: "Lead Engineer" },
];

export const currentUser = users[0];

/* One person, shown as "Abhinav / Shailendra Rajput" across the workspace and
   reports. (The underlying report PDFs are signed "Shailendra Rajput".) */
const ENGINEER = "Abhinav / Shailendra Rajput";
const REPORT_AUTHOR = "Abhinav / Shailendra Rajput";

/* ---------------------------------------------------------------------------
   Servers (real machines under validation)
--------------------------------------------------------------------------- */
export const servers: Server[] = [
  {
    id: "tyr-217",
    name: "MH12XM · 217",
    vendor: "Tyrone Systems",
    model: "Tyrone MDA200A2N-224",
    status: "online",
    assetTag: "NW-TYR-0217",
    serialNumber: "MDA200A2N224-MH12XM-217",
    cpu: "2 × AMD EPYC 9135 · 32C / 64T (Turin)",
    sockets: 2,
    cores: 32,
    memory: "1.15 TB DDR5 · 12 × Samsung 96 GB @ 6000 MT/s",
    memoryGb: 1152,
    storage: "2 × Samsung PM1743 15.36 TB (Gen5) · 2 × 960 GB M.2",
    nic: "2 × Broadcom BCM57414 25GbE (bnxt_en)",
    biosVersion: "AMI ES312AMS.205T8 r5.35",
    bmcVersion: "1.08",
    location: "Bench 13 · Ubuntu 22.04.4 / 6.8.0-117",
    ip: "172.16.13.217",
    owner: ENGINEER,
    purchaseDate: "2025-11-12",
    warranty: "Active",
    warrantyUntil: "2028-11-12",
    tags: ["EPYC", "Turin", "DDR5", "PM1743", "Gen5"],
    createdAt: "2026-05-20T09:00:00",
    updatedAt: "2026-06-02T06:45:00",
    healthScore: 92,
  },
  {
    id: "tyr-srv19",
    name: "MDI300",
    vendor: "Tyrone Systems",
    model: "Tyrone MDI300",
    status: "maintenance",
    assetTag: "NW-TYR-0019",
    serialNumber: "MDI300-GNR-019",
    cpu: "2 × Intel Xeon 6730P · 64C / 128T (Granite Rapids)",
    sockets: 2,
    cores: 64,
    memory: "2 TB DDR5 · 8 × Samsung 256 GB @ 6400 MT/s",
    memoryGb: 2048,
    storage: "2 × Samsung PM9D3a 15.36 TB (Gen5 U.2) · 2 × PM9D3a 960 GB M.2",
    nic: "2 × Intel I350 1GbE (mgmt)",
    biosVersion: "AMI ES418INW.M06",
    bmcVersion: "1.11",
    location: "Bench 13 · Ubuntu 22.04.4 / 6.8.0-111",
    ip: "172.16.13.19",
    owner: ENGINEER,
    purchaseDate: "2026-03-01",
    warranty: "Active",
    warrantyUntil: "2029-03-01",
    tags: ["Xeon", "Granite Rapids", "PM9D3a", "NVMe", "action-needed"],
    createdAt: "2026-05-22T10:00:00",
    updatedAt: "2026-06-04T06:39:00",
    healthScore: 71,
  },
  {
    id: "tyr-a131",
    name: "EPYC 9124",
    vendor: "Tyrone Systems",
    model: "Dual EPYC 9124 node",
    status: "online",
    assetTag: "NW-TYR-0131",
    serialNumber: "GR-9124-A-131",
    cpu: "2 × AMD EPYC 9124 · 32C / 64T (Genoa)",
    sockets: 2,
    cores: 32,
    memory: "251 GiB DDR5",
    memoryGb: 256,
    storage: "NVMe boot",
    nic: "2 × Broadcom BCM57414 25GbE (bnxt_en) · PCIe x4 + x8",
    biosVersion: "—",
    bmcVersion: "—",
    location: "Bench 12 · K8s node (Calico) · 5.15.0-179",
    ip: "172.16.12.131",
    owner: ENGINEER,
    purchaseDate: "2025-07-15",
    warranty: "Active",
    warrantyUntil: "2028-07-15",
    tags: ["EPYC", "Genoa", "25GbE", "bnxt", "Kubernetes"],
    createdAt: "2026-05-26T09:00:00",
    updatedAt: "2026-05-28T12:00:00",
    healthScore: 84,
  },
  {
    id: "tyr-b108",
    name: "EPYC 9745",
    vendor: "Tyrone Systems",
    model: "Dual EPYC 9745 node",
    status: "online",
    assetTag: "NW-TYR-0108",
    serialNumber: "TR-9745-B-108",
    cpu: "2 × AMD EPYC 9745 · 256C / 512T (Turin Dense)",
    sockets: 2,
    cores: 256,
    memory: "1.5 TiB DDR5",
    memoryGb: 1536,
    storage: "NVMe boot",
    nic: "2 × Broadcom BCM57414 25GbE (bnxt_en) · 2 × PCIe x8",
    biosVersion: "—",
    bmcVersion: "—",
    location: "Bench 13 · 25G peer · 5.15.0-94",
    ip: "172.16.13.108",
    owner: ENGINEER,
    purchaseDate: "2025-10-02",
    warranty: "Active",
    warrantyUntil: "2028-10-02",
    tags: ["EPYC", "Turin Dense", "25GbE", "bnxt"],
    createdAt: "2026-05-26T09:05:00",
    updatedAt: "2026-05-28T12:01:00",
    healthScore: 93,
  },
  {
    id: "srv-218",
    name: "Hawfinch",
    vendor: "Tyrone Systems",
    model: "Tyrone Camarero (Hawfinch)",
    status: "online",
    assetTag: "NW-TYR-0218",
    serialNumber: "CAM-HAWFINCH-218",
    cpu: "2 × Intel Xeon Gold 6338 · 64C / 128T (Ice Lake)",
    sockets: 2,
    cores: 64,
    memory: "128 GB DDR4-3200 (Samsung)",
    memoryGb: 128,
    storage: "USB boot · SanDisk Extreme 932 GB",
    nic: "Broadcom BCM57508 200GbE (bnxt_re) · RoCE v2",
    biosVersion: "AMI L1.14B",
    bmcVersion: "—",
    location: "Bench · 100G back-to-back · 6.8.0-111",
    ip: "10.10.10.218",
    owner: ENGINEER,
    purchaseDate: "2024-09-24",
    warranty: "Expiring",
    warrantyUntil: "2026-09-24",
    tags: ["Xeon", "100GbE", "RoCE", "Thor"],
    createdAt: "2026-05-21T08:00:00",
    updatedAt: "2026-05-21T14:00:00",
    healthScore: 95,
  },
  {
    id: "srv-148",
    name: "MH12XM · 148",
    vendor: "Tyrone Systems",
    model: "Tyrone MDA200A2N-224",
    status: "online",
    assetTag: "NW-TYR-0148",
    serialNumber: "MDA200A2N224-MH12XM-148",
    cpu: "2 × AMD EPYC 9135 · 32C / 64T (Turin)",
    sockets: 2,
    cores: 32,
    memory: "512 GB DDR5-5600 (Samsung)",
    memoryGb: 512,
    storage: "Samsung 480 GB SSD · Seagate 18 TB HDD",
    nic: "Broadcom BCM57504 100GbE (bnxt_re) · RoCE v2",
    biosVersion: "AMI ES312AMS.205T8",
    bmcVersion: "1.08",
    location: "Bench · 100G back-to-back · 6.8.0-111",
    ip: "10.10.10.148",
    owner: ENGINEER,
    purchaseDate: "2025-11-12",
    warranty: "Active",
    warrantyUntil: "2028-11-12",
    tags: ["EPYC", "Turin", "100GbE", "RoCE", "Thor"],
    createdAt: "2026-05-21T08:05:00",
    updatedAt: "2026-05-21T14:00:00",
    healthScore: 96,
  },
];

/* ---------------------------------------------------------------------------
   Log content (verbatim-style snippets from the reports)
--------------------------------------------------------------------------- */
const LOG_STREAM_217 = `$ stress-ng --stream 64 --timeout 30s --metrics-brief
stress-ng: info:  [6126] dispatching hogs: 64 stream
stress-ng: info:  [6126] stream  7669.86 memory rate (MB per sec) (average per stressor)
stress-ng: info:  [6126] stream  3067.94 memory rate (Mflop per sec) (average per stressor)
# aggregate = 6926.5 MB/s × 64 workers = 443.3 GB/s (both sockets)
$ numactl --cpunodebind=0 --membind=0 stress-ng --stream 32
# single-socket aggregate = 168.6 GB/s (5267.5 MB/s × 32)
$ mbw -n 5 -t 0 4096            # 1-thread memcpy, NUMA-local
AVG  Method: MEMCPY  Elapsed: 0.18803  MiB: 4096.0  Copy: 20772.6 MiB/s   # 20.77 GB/s
$ numactl --cpunodebind=0 --membind=1 mbw -n 5 -t 0 4096   # NUMA-remote
AVG  Method: MEMCPY  Copy: 12410.2 MiB/s   # 12.41 GB/s  (1.67x penalty)
PASS — STREAM aggregate 443.3 GB/s · top of EPYC 9135 / DDR5-6000 12-of-24 envelope`;

const LOG_EDAC_217 = `$ for f in /sys/devices/system/edac/mc/mc*/ce_count; do echo "$f = $(cat $f)"; done
/sys/devices/system/edac/mc/mc0/ce_count = 0
/sys/devices/system/edac/mc/mc0/ue_count = 0
/sys/devices/system/edac/mc/mc1/ce_count = 0
/sys/devices/system/edac/mc/mc1/ue_count = 0
# Per-rank scoreboard: 24 / 24 ranks  CE=0  UE=0
$ dmesg | grep -ciE 'mce|hardware error'
0      # 0 machine-check events across the 2h 33m window
$ ipmitool sel elist | tail -1
last SEL entry 05:43 (pre-test) — 0 new entries during campaign`;

const LOG_FIO_PM1743 = `$ fio --name=randread --rw=randread --bs=4k --iodepth=128 --numjobs=4 \\
      --ioengine=libaio --direct=1 --runtime=60 --filename=/dev/nvme0n1
read: IOPS=1760k, BW=6876MiB/s (7211MB/s)
  slat (nsec): min=901, max=58204, avg=1812.44
  clat (usec): min=12, max=2104, avg=69.10
  clat percentiles (usec): | 50.00th=[ 66], 99.00th=[ 120], 99.99th=[ 469]
$ fio --name=seqread --rw=read --bs=1M --iodepth=32 --numjobs=4 ...
  READ: bw=11.4GiB/s (12.22GB/s)
$ fio --name=seqwrite --rw=write --bs=1M ...   WRITE: bw=6.58GiB/s (7.06GB/s)
PM1743 nvme0n1: PCIe Gen5 x4 (32 GT/s) — PASS · 1.76M IOPS · 12.22 GB/s read · 7.06 GB/s write`;

const LOG_LSPCI_M2 = `$ sudo lspci -vv -s 51:00.0 | grep -E 'LnkCap|LnkSta'
51:00.0 Non-Volatile memory controller: Samsung MZVL6960HFLB (960 GB M.2)
        LnkCap: Port #0, Speed 16GT/s, Width x4 (Gen4 x4 capable)
        LnkSta: Speed 8GT/s (downgraded), Width x2 (downgraded)
                ^^^ negotiated PCIe Gen3 x2 — double downgrade (1 gen + half lanes)
$ sudo lspci -vv -s 52:00.0 | grep LnkSta
        LnkSta: Speed 8GT/s (downgraded), Width x2 (downgraded)
# ~1.97 GB/s x2 ceiling — measured seq read 1.87 GB/s, 4K randread 443K (1.8 GB/s wall)
# ACTION: re-seat, verify slot wiring x4, check BIOS bifurcation for node0 51:00 / 52:00`;

const LOG_TURBOSTAT_SRV19 = `$ turbostat --quiet --show Core,Bzy_MHz,PkgWatt,CoreTmp sleep 5
Core  Bzy_MHz  PkgWatt  CoreTmp
   -      500    104.2       33      # ALL 64 cores pinned at 500 MHz
$ rdmsr -p0 0x771      # HWP_CAPABILITIES highest_perf
0x26                   # = 38 -> 3800 MHz capable (silicon claims 3.8 GHz)
$ rdmsr -p0 0x64F      # CORE_PERF_LIMIT_REASONS
0x0                    # no perf-limit reason reported
$ cat /sys/.../cpufreq/scaling_governor    -> performance   (no_turbo=0)
# Not thermal (33-35C), not power-capped (104W vs 250W). BIOS power-profile / pcode.
! FAIL — cores deliver 500 MHz vs 2500 base / 3800 turbo. Action required.`;

const LOG_IPERF_BOND = `$ iperf3 -c 172.16.12.131 -P 8 -t 30      # B -> A, single 25G link, jumbo
[SUM]  0.00-30.00 sec   84.7 GBytes  24.2 Gbits/sec    0   sender
$ iperf3 -c 172.16.13.108 -P 8 -t 30      # A -> B
[SUM]  0.00-30.00 sec   61.3 GBytes  17.5 Gbits/sec   14   sender
# bond mode balance-xor (mode 2, layer3+4), 16 streams A->B
[SUM]  0.00-30.00 sec   77.7 GBytes  22.2 Gbits/sec    1   sender
# bond mode balance-rr (mode 0), B->A 1 stream
[SUM]  0.00-30.00 sec   69.6 GBytes  19.9 Gbits/sec  41004 sender   <-- reordering
# A's 2x25G share one PCIe x4 slot (31.5 Gb/s) -> aggregation capped, RX loss on B->A
PASS WITH PLATFORM LIMITATIONS — move 25G card to x8 slot; use balance-xor / 802.3ad`;

const LOG_IB_ROCE = `$ ib_write_bw -F -R -D 30 -q 4 -s 65536 10.10.10.148    # RoCE v2, 64 KB
 #bytes  #iterations  BW peak[Gb/sec]  BW average[Gb/sec]  MsgRate[Mpps]
 65536   ...          98.18            98.16               0.187
$ ib_write_lat -a -n 5000 10.10.10.148                  # 2-byte latency
 #bytes  t_min[usec]  t_typical[usec]  t_avg[usec]  t99%[usec]
 2       2.41         2.45             2.48         2.66
$ iperf3 -c 10.10.10.148 ...  (48 streams, NUMA-pinned, 300s)
[SUM]  0.00-300 sec   957 GBytes  94.04 Gbits/sec  0  sender   # 0 retransmits
# CPU at ~100 Gb/s: RoCE server 0.71% busy vs TCP 6.20% (9.2x). %softirq -> 0 on RoCE.
PASS — full 100G line rate · 195 Gb/s bidir · top of Broadcom Thor envelope`;

const LOG_IPMI_DIMM = `$ ipmitool sdr | grep -i dimm        # 172.16.13.217 — 12 of 24 populated
TEMP_P0_DIMM_A | 37 degrees C | ok      TEMP_P0_DIMM_C | 35 degrees C | ok
TEMP_P0_DIMM_E | 38 degrees C | ok      TEMP_P0_DIMM_G | 39 degrees C | ok
TEMP_P0_DIMM_I | 38 degrees C | ok      TEMP_P0_DIMM_K | 37 degrees C | ok
TEMP_P1_DIMM_A | 39 degrees C | ok      TEMP_P1_DIMM_C | 37 degrees C | ok
TEMP_P1_DIMM_E | 38 degrees C | ok      TEMP_P1_DIMM_G | 38 degrees C | ok
TEMP_P1_DIMM_I | 38 degrees C | ok      TEMP_P1_DIMM_K | 36 degrees C | ok
# 12 populated DIMM thermal sensors 'ok'; voltage rails PVDDIO_P0/P1 ok`;

const LOG_FIO_38 = `$ fio --rw=read --bs=1M --iodepth=32 --numjobs=4 --ioengine=libaio --direct=1   # numactl node0
nvme0n1  PM9D3a 960 GB M.2    seq read 3.76 GB/s    4K randread 852,199 IOPS    QD1 r/w 71.9 / 21.4 µs
nvme1n1  PM9D3a 960 GB M.2    seq read 3.76 GB/s    4K randread 853,654 IOPS
nvme2n1  PM9D3a 15.36 TB U.2  seq read 12.02 GB/s   4K randread 1,510,741 IOPS  write 7.05 GB/s  (recovered)
nvme3n1  PM9D3a 15.36 TB U.2  seq read 12.48 GB/s   4K randread 1,554,033 IOPS  write 7.05 GB/s
# 960 GB read 2× faster than .217 (Gen4 vs Gen3 link); 15.36 TB Gen5 consistent ~12 GB/s`;

const LOG_APST_38 = `$ dmesg | grep -i nvme        # nvme2 found dead ~99 min after boot (at idle)
[ 5934.221031] nvme nvme2: controller is down; will reset: CSTS=0xffffffff, PCI_STATUS=0x10
[ 5934.770114] nvme nvme2: Disabling device after reset failure: -19
[ 5934.901233] nvme2n1: detected capacity change from 30003124224 to 0
# Root cause: APST power-state fault (faulty power-saving mode) — triggers at idle, not under load
$ echo 1 > /sys/bus/pci/devices/0000:c1:00.0/remove && echo 1 > /sys/bus/pci/rescan
[ 6002.330440] nvme nvme2: 32/0/0 default/read/poll queues
[ 6002.401882] nvme2n1: Gen5 x4 (32 GT/s) restored — passed full fio suite (12.0 GB/s, 1.5M IOPS)
# FIX (boot): nvme_core.default_ps_max_latency_us=0 pcie_aspm=off pcie_port_pm=off`;

/* ---------------------------------------------------------------------------
   Validations (one per report)
--------------------------------------------------------------------------- */
function c(author: string, body: string, createdAt: string, replies?: Comment[]): Comment {
  return { id: `cm-${createdAt}-${author.length}`, author, body, createdAt, replies };
}

export const validations: Validation[] = [
  {
    id: "val-217-mem-3h",
    serverId: "tyr-217",
    title: "3-Hour DDR5 Memory Validation — 12 × 96 GB",
    type: "Memory",
    status: "passed",
    engineer: ENGINEER,
    date: "2026-06-01T08:38:00",
    durationSec: 9180,
    summary:
      "12 × Samsung 96 GB DDR5-6400 RDIMM (1.15 TB) on the Tyrone MDA200A2N-224. 2-hour stress-ng pattern-verify + 30-min memtester burn at 96% RAM residency (1.09 TB pinned). Zero ECC errors across all 24 ranks; STREAM aggregate 443.3 GB/s.",
    errors: 0,
    tags: ["STREAM", "stress-ng", "memtester", "DDR5-6000", "NPS"],
    metrics: [
      { label: "STREAM aggregate", value: 443.3, unit: "GB/s", state: "pass", hint: "6926.5 MB/s × 64" },
      { label: "STREAM per-socket", value: 168.6, unit: "GB/s", state: "pass" },
      { label: "memcpy NUMA-local", value: 20.77, unit: "GB/s", state: "pass" },
      { label: "NUMA-remote ratio", value: "1.67×", state: "pass", hint: "20.77 vs 12.41 GB/s" },
      { label: "sysbench 1M write", value: 26.9, unit: "GB/s", state: "pass" },
      { label: "Peak residency", value: "96.0%", state: "pass", hint: "1088 GB locked" },
      { label: "ECC CE / UE", value: "0 / 0", state: "pass", hint: "24 / 24 ranks clean" },
      { label: "MCE events", value: 0, state: "pass" },
    ],
    charts: [
      {
        id: "mem3h-scaling",
        title: "STREAM aggregate by channel population",
        kind: "bar",
        unit: "GB/s",
        series: [{ key: "v", label: "Aggregate", tone: "accent" }],
        data: [
          { x: "8×256GB (4ch)", v: 245.4 },
          { x: "12×96GB (12ch)", v: 443.3 },
          { x: "Full 24ch", v: 565 },
        ],
      },
      {
        id: "mem3h-numa",
        title: "Single-thread memcpy — NUMA local vs remote",
        kind: "bar",
        unit: "GB/s",
        series: [{ key: "v", label: "memcpy", tone: "accent" }],
        data: [
          { x: "NUMA-local", v: 20.77 },
          { x: "NUMA-remote", v: 12.41 },
        ],
      },
    ],
    attachments: [
      { id: "a-mem3h-pdf", name: "Netweb_217_3h_Memory_Validation_Report.pdf", kind: "pdf", size: 493393, uploadedBy: ENGINEER, uploadedAt: "2026-06-01T09:10:00" },
      { id: "a-mem3h-stream", name: "stream_stress-ng.log", kind: "log", size: 1180, uploadedBy: ENGINEER, uploadedAt: "2026-06-01T08:40:00", preview: LOG_STREAM_217 },
      { id: "a-mem3h-edac", name: "edac_counters.txt", kind: "txt", size: 640, uploadedBy: ENGINEER, uploadedAt: "2026-06-01T08:41:00", preview: LOG_EDAC_217 },
      { id: "a-mem3h-ipmi", name: "ipmitool_sdr_dimm.txt", kind: "txt", size: 720, uploadedBy: ENGINEER, uploadedAt: "2026-06-01T08:42:00", preview: LOG_IPMI_DIMM },
    ],
    comments: [
      c("Abhinav / Shailendra Rajput", "443 GB/s at 12-of-24 is excellent — 1.81× the 4-of-12 layout, right on the channel-count scaling. Customer only ordered 1.15 TB for now; noted full 24-ch (~580 GB/s) as headroom in the recommendations.", "2026-06-01T11:20:00"),
    ],
    notes:
      "All 12 Samsung 96 GB DDR5-6400 modules pass: 2h write-and-verify (52 stress-ng patterns) + 30m at 96% RAM residency, zero ECC / zero MCE. Configured 6000 MT/s (EPYC Turin 1DPC clamp from 6400 rated). Fit for production memory-bound workloads.",
  },
  {
    id: "val-217-mem-2camp",
    serverId: "tyr-217",
    title: "DDR5 Memory Validation — 256 GB + 128 GB campaigns",
    type: "Memory",
    status: "passed",
    engineer: ENGINEER,
    date: "2026-05-27T08:36:00",
    durationSec: 5400,
    summary:
      "Back-to-back validation of two module sets on the same server: 8 × 256 GB (2 TB) and 8 × 128 GB (1 TB) Samsung DDR5-6400. Both PASS — 0 ECC across 16 ranks each. Aggregate STREAM ≈244 GB/s in both: bandwidth is channel-population-limited (4-of-12), not density-limited.",
    errors: 0,
    tags: ["STREAM", "stress-ng", "memtester", "256GB", "128GB"],
    metrics: [
      { label: "STREAM — 256 GB", value: 245.4, unit: "GB/s", state: "pass" },
      { label: "STREAM — 128 GB", value: 243.6, unit: "GB/s", state: "pass" },
      { label: "Per-socket (A/B)", value: "113.9 / 114.3", unit: "GB/s", state: "pass" },
      { label: "memcpy (A/B)", value: "20.57 / 19.89", unit: "GB/s", state: "pass" },
      { label: "sysbench 1M (A/B)", value: "17.2 / 16.6", unit: "GB/s", state: "pass" },
      { label: "ECC CE / UE", value: "0 / 0", state: "pass", hint: "16 ranks, both" },
      { label: "Peak residency", value: "95.8 / 96.1%", state: "pass" },
      { label: "MCE events", value: 0, state: "pass" },
    ],
    charts: [
      {
        id: "mem2c-density",
        title: "STREAM aggregate — capacity is bandwidth-neutral",
        kind: "bar",
        unit: "GB/s",
        series: [{ key: "v", label: "Aggregate", tone: "accent" }],
        data: [
          { x: "256 GB / 2 TB", v: 245.4 },
          { x: "128 GB / 1 TB", v: 243.6 },
          { x: "Full 12-of-12", v: 480 },
        ],
      },
      {
        id: "mem2c-profile",
        title: "Bandwidth profile — Campaign A vs B",
        kind: "bar",
        unit: "GB/s",
        series: [
          { key: "a", label: "256 GB", tone: "accent" },
          { key: "b", label: "128 GB", tone: "info" },
        ],
        data: [
          { x: "STREAM agg", a: 245.4, b: 243.6 },
          { x: "Per-socket", a: 113.9, b: 114.3 },
          { x: "memcpy", a: 20.57, b: 19.89 },
        ],
      },
    ],
    attachments: [
      { id: "a-mem2c-pdf", name: "Netweb_Memory_Validation_Report.pdf", kind: "pdf", size: 498481, uploadedBy: ENGINEER, uploadedAt: "2026-05-27T09:00:00" },
      { id: "a-mem2c-dmi", name: "dmidecode_t17.txt", kind: "txt", size: 880, uploadedBy: ENGINEER, uploadedAt: "2026-05-27T08:50:00", preview: "Memory Device\n  Size: 256 GB\n  Type: DDR5\n  Speed: 6400 MT/s\n  Configured Memory Speed: 6000 MT/s\n  Manufacturer: Samsung\n  Part Number: M321RBJA0M22-CLPIL\n  Rank: 2\n# Campaign B: M321RAJA0MB2-CCPWF, 128 GB, same 6400→6000" },
    ],
    comments: [
      c(ENGINEER, "Headline insight for the customer: doubling DIMM density does not change bandwidth at 4-of-12. The lever is channel population.", "2026-05-27T10:05:00"),
    ],
    notes:
      "Both SKUs JEDEC-rated 6400 MT/s, both platform-clamped to 6000 MT/s by the EPYC Turin 1DPC default. All 32 modules validated. Recommend populating more channels (toward 12-of-12 ≈ 500 GB/s) regardless of module choice.",
  },
  {
    id: "val-217-nvme",
    serverId: "tyr-217",
    title: "3-Hour NVMe SSD Validation — PM1743 + 960 GB M.2",
    type: "Storage",
    status: "warning",
    engineer: ENGINEER,
    date: "2026-06-02T06:45:00",
    durationSec: 900,
    summary:
      "fio 3.28 direct-IO suite on 4 Samsung NVMe drives. The 2 × PM1743 15.36 TB (Gen5) are production-ready at full PCIe Gen5 x4 — 12.3 GB/s read, 1.75M IOPS. The 2 × 960 GB M.2 are healthy but link-throttled to Gen3 x2 (~26% of capability) — slot/bifurcation fix required.",
    errors: 0,
    tags: ["fio", "PM1743", "Gen5", "PCIe", "link-downgrade", "action-needed"],
    metrics: [
      { label: "PM1743 seq read", value: "12.22 / 12.32", unit: "GB/s", state: "pass" },
      { label: "PM1743 seq write", value: 7.06, unit: "GB/s", state: "pass" },
      { label: "PM1743 4K randread", value: "1.76M", unit: "IOPS", state: "pass", hint: "QD512" },
      { label: "PM1743 QD1 write lat", value: 11.8, unit: "µs", state: "pass" },
      { label: "960 GB PCIe link", value: "Gen3 x2", state: "fail", hint: "expected Gen4 x4" },
      { label: "960 GB seq read", value: 1.87, unit: "GB/s", state: "warn", hint: "~26% of capable" },
      { label: "960 GB 4K randread", value: "443K", unit: "IOPS", state: "warn" },
      { label: "SMART / media errors", value: "0", state: "pass", hint: "all 4 drives, ≤42 °C" },
    ],
    charts: [
      {
        id: "nvme-seqread",
        title: "Sequential read by drive",
        kind: "bar",
        unit: "GB/s",
        series: [{ key: "v", label: "Seq read", tone: "accent" }],
        data: [
          { x: "PM1743 #0", v: 12.22 },
          { x: "PM1743 #1", v: 12.32 },
          { x: "960GB #0", v: 1.87 },
          { x: "960GB #1", v: 1.87 },
        ],
      },
      {
        id: "nvme-iops",
        title: "4K random read IOPS by drive",
        kind: "bar",
        unit: "K IOPS",
        series: [{ key: "v", label: "IOPS", tone: "info" }],
        data: [
          { x: "PM1743 #0", v: 1760 },
          { x: "PM1743 #1", v: 1745 },
          { x: "960GB #0", v: 443 },
          { x: "960GB #1", v: 443 },
        ],
      },
      {
        id: "nvme-link",
        title: "PCIe link — capable vs measured read",
        kind: "bar",
        unit: "GB/s",
        series: [
          { key: "capable", label: "Capable", tone: "neutral" },
          { key: "measured", label: "Measured", tone: "warning" },
        ],
        data: [
          { x: "PM1743 (Gen5 x4)", capable: 14, measured: 12.3 },
          { x: "960GB (Gen3 x2)", capable: 6, measured: 1.87 },
        ],
      },
    ],
    attachments: [
      { id: "a-nvme-pdf", name: "Netweb_217_3h_NVMe_Validation_Report.pdf", kind: "pdf", size: 546320, uploadedBy: ENGINEER, uploadedAt: "2026-06-02T07:00:00" },
      { id: "a-nvme-fio", name: "fio_results.log", kind: "log", size: 980, uploadedBy: ENGINEER, uploadedAt: "2026-06-02T06:46:00", preview: LOG_FIO_PM1743 },
      { id: "a-nvme-lspci", name: "lspci_link.txt", kind: "txt", size: 760, uploadedBy: ENGINEER, uploadedAt: "2026-06-02T06:47:00", preview: LOG_LSPCI_M2 },
    ],
    comments: [
      c("Abhinav / Shailendra Rajput", "Same M.2 Gen3 x2 downgrade we keep seeing on this baseboard. Drives report Gen4 x4 capable and the U.2 PM1743 path trains Gen5 x4 fine — so it's the M.2 slot/bifurcation (node0 51:00 / 52:00), not the SSD. Logged for re-seat + BIOS check, then re-qualify.", "2026-06-02T08:00:00"),
    ],
    notes:
      "PM1743 pair PASS at Gen5 x4. 960 GB pair PASS WITH LIMITATION — both negotiated Gen3 x2 instead of Gen4 x4 (8 GT/s × 2), capping ~1.87 GB/s / 443K IOPS at the ~1.97 GB/s x2 wall. Fix slot/bifurcation (node0 51:00/52:00), re-run lspci for Gen4 x4, expect ~6–7 GB/s and 3–4× IOPS.",
  },
  {
    id: "val-srv19-mem",
    serverId: "tyr-srv19",
    title: "DDR5 Memory Validation — Xeon 6730P (CPU lock found)",
    type: "Memory",
    status: "warning",
    engineer: ENGINEER,
    date: "2026-05-28T10:58:00",
    durationSec: 5100,
    summary:
      "Two memory campaigns (8 × 256 GB, 8 × 128 GB Samsung DDR5-6400) on the Tyrone MDI300. Memory PASSES both — full 6400 MT/s, 0 ECC across 16 controllers. Testing surfaced a platform fault: every CPU core locked at 500 MHz in both campaigns — a firmware issue, not memory.",
    errors: 0,
    tags: ["memory", "Granite Rapids", "CPU-lock", "firmware", "action-needed"],
    metrics: [
      { label: "DIMM detect", value: "8 / 8 / 8", state: "pass", hint: "BMC / BIOS / kernel" },
      { label: "Configured speed", value: "6400 MT/s", state: "pass", hint: "full rated" },
      { label: "ECC CE / UE", value: "0 / 0", state: "pass", hint: "16 controllers" },
      { label: "memtester", value: "0 fail", state: "pass", hint: "≥95% RAM locked" },
      { label: "CPU core freq", value: "500 MHz", state: "fail", hint: "vs 2500 base / 3800 turbo" },
      { label: "memcpy (throttled)", value: 2.31, unit: "GB/s", state: "warn", hint: "~10× low" },
      { label: "STREAM (throttled)", value: "≈23", unit: "GB/s", state: "warn", hint: "expect 300–340" },
      { label: "MCE events", value: 0, state: "pass" },
    ],
    charts: [
      {
        id: "srv19-freq",
        title: "Delivered vs rated CPU frequency",
        kind: "bar",
        unit: "MHz",
        series: [{ key: "v", label: "MHz", tone: "warning" }],
        data: [
          { x: "Delivered", v: 500 },
          { x: "Base", v: 2500 },
          { x: "Max turbo", v: 3800 },
        ],
      },
      {
        id: "srv19-bw",
        title: "Bandwidth — throttled vs expected at rated clock",
        kind: "bar",
        unit: "GB/s",
        series: [
          { key: "measured", label: "@ 500 MHz", tone: "warning" },
          { key: "expected", label: "@ 3.8 GHz", tone: "neutral" },
        ],
        data: [
          { x: "memcpy", measured: 2.31, expected: 22 },
          { x: "STREAM agg", measured: 23, expected: 320 },
        ],
      },
    ],
    attachments: [
      { id: "a-srv19-pdf", name: "Netweb_Server19_Memory_Validation_Report.pdf", kind: "pdf", size: 461099, uploadedBy: ENGINEER, uploadedAt: "2026-05-28T11:10:00" },
      { id: "a-srv19-turbo", name: "turbostat_msr.txt", kind: "txt", size: 880, uploadedBy: ENGINEER, uploadedAt: "2026-05-28T11:00:00", preview: LOG_TURBOSTAT_SRV19 },
    ],
    comments: [
      c("Abhinav / Shailendra Rajput", "500 MHz across all 64 cores, survives reboot + DIMM swap — BIOS power-profile / config-TDP-low or early Granite Rapids pcode, not the memory. Set to Performance profile + flashed the latest MDI300 BIOS + microcode and marked the box maintenance; re-benchmark pending.", "2026-05-28T12:30:00"),
    ],
    notes:
      "Memory cleared for use (both SKUs). CPU 500 MHz lock must be resolved before benchmarking: (a) BIOS power profile → Performance/max TDP, (b) update BIOS + Intel microcode, (c) check VR telemetry, (d) newer kernel (6.11+). Expect ≈300+ GB/s aggregate STREAM once cores reach rated frequency.",
  },
  {
    id: "val-25g-bond",
    serverId: "tyr-a131",
    title: "25G NIC Bonding — Validation & Performance",
    type: "Network",
    status: "warning",
    engineer: ENGINEER,
    date: "2026-05-28T16:00:00",
    durationSec: 3600,
    summary:
      "Dual-port 25G Broadcom BCM57414 between Server A (172.16.12.131) and Server B (172.16.13.108), back-to-back over SFP28 fibre. Single links healthy (~24 Gb/s B→A). Bonding forms and carries traffic but does not cleanly double throughput — capped by Server A's PCIe x4 slot and marginal optics.",
    errors: 0,
    tags: ["iperf3", "25GbE", "bnxt", "bonding", "PCIe-x4", "action-needed"],
    metrics: [
      { label: "Single link B→A", value: 24.2, unit: "Gb/s", state: "pass", hint: "8 streams, 0 retr" },
      { label: "Single link A→B", value: 17.5, unit: "Gb/s", state: "pass" },
      { label: "balance-xor A→B (16)", value: 22.2, unit: "Gb/s", state: "warn" },
      { label: "Two links (sum)", value: 32.0, unit: "Gb/s", state: "pass" },
      { label: "TCP latency (qperf)", value: 18, unit: "µs", state: "pass", hint: "24 µs bonded" },
      { label: "Jumbo loss", value: "0%", state: "pass", hint: "8972 B DF" },
      { label: "balance-rr", value: "unsuitable", state: "fail", hint: "41k retransmits" },
    ],
    charts: [
      {
        id: "bond-tput",
        title: "Peak throughput by configuration",
        kind: "bar",
        unit: "Gb/s",
        series: [{ key: "v", label: "Gb/s", tone: "accent" }],
        data: [
          { x: "Single A→B", v: 17.5 },
          { x: "Single B→A", v: 24.2 },
          { x: "rr B→A", v: 25.5 },
          { x: "xor A→B(16)", v: 22.2 },
          { x: "2 links sum", v: 32.0 },
        ],
      },
      {
        id: "bond-lat",
        title: "Latency — single link vs bond",
        kind: "bar",
        unit: "µs",
        series: [
          { key: "nobond", label: "No bond", tone: "accent" },
          { key: "bond", label: "Bond (xor)", tone: "warning" },
        ],
        data: [
          { x: "TCP (qperf)", nobond: 18, bond: 24 },
          { x: "UDP (qperf)", nobond: 19, bond: 22 },
        ],
      },
      {
        id: "bond-scaling",
        title: "balance-xor throughput vs stream count (A→B)",
        kind: "line",
        unit: "Gb/s",
        xLabel: "TCP streams",
        series: [{ key: "v", label: "Throughput", tone: "accent" }],
        data: [
          { x: 1, v: 16.9 },
          { x: 8, v: 18.1 },
          { x: 16, v: 22.2 },
        ],
      },
    ],
    attachments: [
      { id: "a-25g-pdf", name: "Netweb_25G_NIC_Bonding_Benchmark_Report.pdf", kind: "pdf", size: 492124, uploadedBy: ENGINEER, uploadedAt: "2026-05-28T16:30:00" },
      { id: "a-25g-iperf", name: "iperf3_bond.log", kind: "log", size: 960, uploadedBy: ENGINEER, uploadedAt: "2026-05-28T16:05:00", preview: LOG_IPERF_BOND },
    ],
    comments: [
      c("Abhinav / Shailendra Rajput", "Both 25G NICs link at 25 Gb/s with 0% jumbo loss — NICs are healthy; the aggregation cap is purely platform (Server A's bonded ports share one PCIe x4 slot, 31.5 Gb/s). Recommendation: move the card to an x8 slot, use balance-xor / 802.3ad, never balance-rr — then expect ~45–48 Gb/s aggregate.", "2026-05-28T17:00:00"),
    ],
    notes:
      "PASS WITH PLATFORM LIMITATIONS. Single-link PASS (~24 Gb/s, ~18 µs). Bonding functional in both modes but aggregation LIMITED by host PCIe x4 slot + marginal optics (not a NIC fault). balance-rr unusable for TCP (heavy reordering). Recommend x8 slot, matching 25G-SR optics + RS-FEC, and 802.3ad via switch for production.",
  },
  {
    id: "val-100g-roce",
    serverId: "srv-218",
    title: "100 GbE / RoCE v2 NIC Benchmark — BCM57508 ↔ BCM57504",
    type: "Network",
    status: "passed",
    engineer: ENGINEER,
    date: "2026-05-21T14:00:00",
    durationSec: 1800,
    summary:
      "Two Broadcom NetXtreme-E 100G adapters (Thor) back-to-back over a single 100G DAC. Full line rate on RoCE v2 send/write/read (98.18 Gb/s), 195 Gb/s full-duplex, 2.41 µs write latency — top of the Broadcom Thor envelope. RoCE uses ~9× less host CPU than TCP at the same throughput.",
    errors: 0,
    tags: ["RoCE", "100GbE", "ib_send_bw", "iperf3", "Thor", "kernel-bypass"],
    metrics: [
      { label: "RoCE send/write/read", value: "98.18 / 98.16 / 98.17", unit: "Gb/s", state: "pass" },
      { label: "Bidir full-duplex", value: 194.99, unit: "Gb/s", state: "pass", hint: "line rate" },
      { label: "TCP iperf3 (5 min)", value: 94.04, unit: "Gb/s", state: "pass", hint: "0 retransmits" },
      { label: "ib_write_lat (min)", value: 2.41, unit: "µs", state: "pass" },
      { label: "ib_read_lat (min)", value: 4.39, unit: "µs", state: "pass" },
      { label: "sockperf PPS", value: "5.0M", unit: "pps", state: "pass" },
      { label: "CPU (RoCE vs TCP)", value: "9.2×", state: "pass", hint: "0.71% vs 6.20% server" },
      { label: "FCS / PCS errors", value: 0, state: "pass" },
    ],
    charts: [
      {
        id: "roce-bw",
        title: "Bandwidth — RoCE v2 vs TCP",
        kind: "bar",
        unit: "Gb/s",
        series: [{ key: "v", label: "Gb/s", tone: "success" }],
        data: [
          { x: "ib_send", v: 98.18 },
          { x: "ib_write", v: 98.16 },
          { x: "ib_read", v: 98.17 },
          { x: "TCP iperf3", v: 94.04 },
        ],
      },
      {
        id: "roce-lat",
        title: "RDMA latency (2 B message, min)",
        kind: "bar",
        unit: "µs",
        series: [{ key: "v", label: "µs", tone: "accent" }],
        data: [
          { x: "write", v: 2.41 },
          { x: "send", v: 2.59 },
          { x: "read", v: 4.39 },
        ],
      },
      {
        id: "roce-cpu",
        title: "Host CPU at ~100 Gb/s — TCP vs RoCE",
        kind: "bar",
        unit: "% busy",
        series: [
          { key: "tcp", label: "TCP iperf3", tone: "warning" },
          { key: "roce", label: "RoCE", tone: "success" },
        ],
        data: [
          { x: "Server (RX)", tcp: 6.2, roce: 0.71 },
          { x: "Client (TX)", tcp: 2.4, roce: 1.36 },
        ],
      },
    ],
    attachments: [
      { id: "a-roce-pdf", name: "Netweb_100G_RoCE_Benchmark_Report.pdf", kind: "pdf", size: 512822, uploadedBy: ENGINEER, uploadedAt: "2026-05-21T14:30:00" },
      { id: "a-roce-ib", name: "ib_roce_results.log", kind: "log", size: 940, uploadedBy: ENGINEER, uploadedAt: "2026-05-21T14:05:00", preview: LOG_IB_ROCE },
    ],
    comments: [
      c(ENGINEER, "98.17 Gb/s read actually exceeds the typical Broadcom Thor window (94–97) — unusually clean BIOS / PCIe / driver alignment on this pair.", "2026-05-21T15:00:00"),
      c("Abhinav / Shailendra Rajput", "The CPU-efficiency story is the selling point: ~1 core on RoCE vs ~6 on TCP at 100G. That's 50+ cores/node recovered at 10 links. Lead with that for the AI/storage customers.", "2026-05-21T15:20:00"),
    ],
    notes:
      "Full 100G line rate, RoCE v2 send/write/read at 98.18 Gb/s, 195 Gb/s bidir, 2.41 µs write latency — matches/exceeds Broadcom Thor and NVIDIA CX-6 bandwidth. Firmware 226.0.145.1, PCIe Gen4 x16, MTU 9000, NUMA-pinned. For >195 Gb/s or sub-2 µs, evaluate DPDK/AF_XDP.",
  },
  {
    id: "val-38-nvme",
    serverId: "tyr-srv19",
    title: "NVMe SSD Validation — PM9D3a (cross-server vs .217)",
    type: "Storage",
    status: "warning",
    engineer: ENGINEER,
    date: "2026-06-04T06:39:00",
    durationSec: 1440,
    summary:
      "Re-validation of the four Samsung PM9D3a drives previously tested on the MDA200A2N-224 at 172.16.13.217, now on this Tyrone MDI300 at 172.16.15.38 (Xeon 6730P, 1.0 TB DDR5) — same physical drives (serials confirmed). The 960 GB M.2 read doubled (1.87 → 3.76 GB/s) on the MDI300's Gen4 link, proving the .217 Gen3 cap was a slot fault. One 15.36 TB drive was found dead at idle (APST) and recovered in place.",
    errors: 0,
    tags: ["fio", "PM9D3a", "cross-server", "Gen4", "APST", "action-needed"],
    metrics: [
      { label: "15.36 TB seq read", value: "12.02 / 12.48", unit: "GB/s", state: "pass", hint: "Gen5 x4 · ≈ .217" },
      { label: "15.36 TB 4K randread", value: "1.51 / 1.55M", unit: "IOPS", state: "pass" },
      { label: "960 GB seq read", value: 3.76, unit: "GB/s", state: "pass", hint: "2.0× .217 (Gen4 link)" },
      { label: "960 GB 4K randread", value: "852K", unit: "IOPS", state: "pass", hint: "1.9× .217" },
      { label: "960 GB PCIe link", value: "Gen4 x2", state: "warn", hint: "speed up from Gen3; width still x2" },
      { label: "15.36 TB PCIe link", value: "Gen5 x4", state: "pass" },
      { label: "Dead drive (APST)", value: "Recovered", state: "warn", hint: "S7RKNG0YB01786 — needs APST fix" },
      { label: "SMART / media errors", value: "0", state: "pass", hint: "0% wear · ≤ 46 °C" },
    ],
    charts: [
      {
        id: "nvme38-seqread",
        title: "Sequential read by drive",
        kind: "bar",
        unit: "GB/s",
        series: [{ key: "v", label: "Seq read", tone: "accent" }],
        data: [
          { x: "960GB #0", v: 3.76 },
          { x: "960GB #1", v: 3.76 },
          { x: "15.36TB #2", v: 12.02 },
          { x: "15.36TB #3", v: 12.48 },
        ],
      },
      {
        id: "nvme38-iops",
        title: "4K random read IOPS by drive",
        kind: "bar",
        unit: "K IOPS",
        series: [{ key: "v", label: "IOPS", tone: "info" }],
        data: [
          { x: "960GB #0", v: 852 },
          { x: "960GB #1", v: 854 },
          { x: "15.36TB #2", v: 1511 },
          { x: "15.36TB #3", v: 1554 },
        ],
      },
      {
        id: "nvme38-crossserver",
        title: "Same drives: MDA200 (.217) vs MDI300 (.38) — seq read",
        kind: "bar",
        unit: "GB/s",
        series: [
          { key: "s217", label: "MDA200 ·217", tone: "neutral" },
          { key: "s38", label: "MDI300 ·38", tone: "accent" },
        ],
        data: [
          { x: "960 GB M.2", s217: 1.87, s38: 3.76 },
          { x: "15.36 TB U.2", s217: 12.22, s38: 12.48 },
        ],
      },
    ],
    attachments: [
      { id: "a-38-pdf", name: "Netweb_38_NVMe_Validation_Report.pdf", kind: "pdf", size: 554289, uploadedBy: ENGINEER, uploadedAt: "2026-06-04T07:00:00" },
      { id: "a-38-fio", name: "fio_results_38.log", kind: "log", size: 1020, uploadedBy: ENGINEER, uploadedAt: "2026-06-04T06:40:00", preview: LOG_FIO_38 },
      { id: "a-38-apst", name: "dmesg_apst_recovery.log", kind: "log", size: 1180, uploadedBy: ENGINEER, uploadedAt: "2026-06-04T06:20:00", preview: LOG_APST_38 },
    ],
    comments: [
      c("Abhinav / Shailendra Rajput", "This closes the .217 open question: the 960 GB Gen3 cap was a .217 slot/BIOS fault — the drives hit Gen4 (3.76 GB/s, 2× read) on .38. But the x2 width follows the drives on both servers, so still ~50% of a true Gen4 x4. Move them to an x4-wired M.2 slot to double read again.", "2026-06-04T08:10:00"),
      c("Abhinav / Shailendra Rajput", "nvme2 (S7RKNG0YB01786) arrived dead at idle — APST controller-down (CSTS=0xffffffff). Recovered via PCIe hot remove + rescan, ran the full suite at Gen5 x4. Holding it until the APST kernel mitigation is verified.", "2026-06-04T08:18:00"),
    ],
    notes:
      "PASS with two actions. (1) APST fix on S7RKNG0YB01786: boot with nvme_core.default_ps_max_latency_us=0 pcie_aspm=off pcie_port_pm=off (or PM9D3a FW update), then idle-soak to confirm. (2) Move 960 GB M.2 to x4-wired slots to unlock full Gen4 x4 (~7 GB/s). 960 GB write (1.62 GB/s) and random write (395K IOPS) are NAND-bound — identical on both servers, unaffected by link.",
  },
];

/* ---------------------------------------------------------------------------
   BIOS configurations
--------------------------------------------------------------------------- */
export const biosConfigs: BiosConfig[] = [
  {
    id: "bios-217",
    serverId: "tyr-217",
    version: "ES312AMS.205T8 r5.35",
    profile: "Performance · EPYC Turin 1DPC",
    capturedAt: "2026-05-31T10:00:00",
    capturedBy: ENGINEER,
    notes: "AMI BIOS, 26 Mar 2026. DDR5 platform-clamped to 6000 MT/s (1DPC). M.2 bifurcation under review — node0 51:00/52:00 negotiate Gen3 x2 (see NVMe validation).",
    settings: [
      { group: "Memory", key: "DIMM Rated Speed", value: "6400 MT/s", recommended: "6400 MT/s" },
      { group: "Memory", key: "Configured Memory Speed", value: "6000 MT/s", recommended: "6000 MT/s", note: "EPYC Turin 1DPC clamp" },
      { group: "Memory", key: "Error Correction", value: "Multi-bit ECC", recommended: "Multi-bit ECC" },
      { group: "Memory", key: "Patrol Scrub", value: "Disabled", recommended: "Enabled", note: "Recommend enable for idle CE detection" },
      { group: "Processor", key: "Determinism Control", value: "Performance", recommended: "Performance" },
      { group: "Processor", key: "NUMA Nodes Per Socket", value: "NPS1", recommended: "NPS1" },
      { group: "PCIe", key: "U.2 Slot Link Speed", value: "Gen5 x4", recommended: "Gen5 x4" },
      { group: "PCIe", key: "M.2 Slot Bifurcation (node0)", value: "Gen3 x2", recommended: "Gen4 x4", note: "Anomaly — re-seat / verify x4 wiring" },
      { group: "Power", key: "Power Profile", value: "Max Performance", recommended: "Max Performance" },
    ],
  },
  {
    id: "bios-srv19",
    serverId: "tyr-srv19",
    version: "ES418INW.M06",
    profile: "Granite Rapids · power profile under review",
    capturedAt: "2026-05-28T10:00:00",
    capturedBy: ENGINEER,
    notes: "AMI BIOS, 16 Apr 2026. Investigating a 500 MHz all-core frequency lock reproduced across reboot + DIMM swap — suspected Max-Efficiency / config-TDP-low profile or early Granite Rapids pcode.",
    settings: [
      { group: "Processor", key: "Power / Performance Profile", value: "Max Efficiency (suspected)", recommended: "Performance", note: "Likely cause of 500 MHz lock" },
      { group: "Processor", key: "Config TDP Level", value: "Low (suspected)", recommended: "Nominal / Level 2" },
      { group: "Processor", key: "Turbo Boost", value: "Enabled", recommended: "Enabled" },
      { group: "Processor", key: "Base Frequency", value: "2500 MHz", recommended: "2500 MHz" },
      { group: "Processor", key: "Max Turbo", value: "3800 MHz", recommended: "3800 MHz" },
      { group: "Memory", key: "Configured Memory Speed", value: "6400 MT/s", recommended: "6400 MT/s", note: "Full rated — memory PASS" },
      { group: "Memory", key: "Error Correction", value: "Multi-bit ECC", recommended: "Multi-bit ECC" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Firmware history
--------------------------------------------------------------------------- */
export const firmware: FirmwareEntry[] = [
  { id: "fw-217-bios", serverId: "tyr-217", component: "BIOS", version: "ES312AMS.205T8 r5.35", date: "2026-03-26T10:00:00", updatedBy: ENGINEER, status: "current", impact: "AMI BIOS; DDR5 1DPC 6000 MT/s clamp; Gen5 U.2 link training." },
  { id: "fw-217-bmc", serverId: "tyr-217", component: "BMC", version: "1.08", date: "2026-03-26T10:20:00", updatedBy: ENGINEER, status: "current" },
  { id: "fw-srv19-bios", serverId: "tyr-srv19", component: "BIOS", version: "ES418INW.M06", date: "2026-04-16T10:00:00", updatedBy: ENGINEER, status: "update-available", impact: "Granite Rapids; suspected pre-pcode-fix for 500 MHz lock — newer BIOS pending." },
  { id: "fw-srv19-bmc", serverId: "tyr-srv19", component: "BMC", version: "1.11", date: "2026-04-16T10:20:00", updatedBy: ENGINEER, status: "current" },
  { id: "fw-218-bios", serverId: "srv-218", component: "BIOS", version: "L1.14B", date: "2025-09-24T10:00:00", updatedBy: ENGINEER, status: "outdated", impact: "Sep 2025 build; clean PCIe Gen4 x16 alignment for 100G." },
  { id: "fw-218-nic", serverId: "srv-218", component: "NIC", version: "226.0.145.1", date: "2026-05-15T09:00:00", updatedBy: ENGINEER, status: "current", impact: "bnxt_en / bnxt_re — RoCE v2 at full 100G line rate." },
  { id: "fw-148-bios", serverId: "srv-148", component: "BIOS", version: "ES312AMS.205T8", date: "2026-03-26T10:00:00", updatedBy: ENGINEER, status: "current" },
  { id: "fw-148-nic", serverId: "srv-148", component: "NIC", version: "226.0.145.1", date: "2026-05-15T09:05:00", updatedBy: ENGINEER, status: "current", impact: "bnxt_re — RoCE v2; 98.18 Gb/s send/write/read." },
  { id: "fw-a131-nic", serverId: "tyr-a131", component: "NIC", version: "bnxt_en (5.15)", date: "2026-05-20T09:00:00", updatedBy: ENGINEER, status: "current", impact: "BCM57414 25GbE; bonding stressed driver under reconfiguration." },
  { id: "fw-b108-nic", serverId: "tyr-b108", component: "NIC", version: "bnxt_en (5.15)", date: "2026-05-20T09:05:00", updatedBy: ENGINEER, status: "current", impact: "BCM57414 25GbE peer." },
];

/* ---------------------------------------------------------------------------
   Standalone logs
--------------------------------------------------------------------------- */
export const logFiles: LogFile[] = [
  { id: "log-stream-217", serverId: "tyr-217", validationId: "val-217-mem-3h", name: "stream_stress-ng.log", source: "stress-ng / mbw", size: 1180, lines: 11, createdAt: "2026-06-01T08:40:00", level: "info", content: LOG_STREAM_217 },
  { id: "log-edac-217", serverId: "tyr-217", validationId: "val-217-mem-3h", name: "edac_counters.txt", source: "EDAC sysfs", size: 640, lines: 9, createdAt: "2026-06-01T08:41:00", level: "info", content: LOG_EDAC_217 },
  { id: "log-fio-217", serverId: "tyr-217", validationId: "val-217-nvme", name: "fio_results.log", source: "fio 3.28", size: 980, lines: 9, createdAt: "2026-06-02T06:46:00", level: "info", content: LOG_FIO_PM1743 },
  { id: "log-lspci-217", serverId: "tyr-217", validationId: "val-217-nvme", name: "lspci_link.txt", source: "lspci", size: 760, lines: 9, createdAt: "2026-06-02T06:47:00", level: "warning", content: LOG_LSPCI_M2 },
  { id: "log-turbostat-19", serverId: "tyr-srv19", validationId: "val-srv19-mem", name: "turbostat_msr.txt", source: "turbostat / rdmsr", size: 880, lines: 12, createdAt: "2026-05-28T11:00:00", level: "error", content: LOG_TURBOSTAT_SRV19 },
  { id: "log-iperf-25g", serverId: "tyr-a131", validationId: "val-25g-bond", name: "iperf3_bond.log", source: "iperf3 3.9", size: 960, lines: 12, createdAt: "2026-05-28T16:05:00", level: "warning", content: LOG_IPERF_BOND },
  { id: "log-ib-roce", serverId: "srv-218", validationId: "val-100g-roce", name: "ib_roce_results.log", source: "perftest / iperf3", size: 940, lines: 11, createdAt: "2026-05-21T14:05:00", level: "info", content: LOG_IB_ROCE },
  { id: "log-apst-38", serverId: "tyr-srv19", validationId: "val-38-nvme", name: "dmesg_apst_recovery.log", source: "dmesg", size: 1180, lines: 9, createdAt: "2026-06-04T06:20:00", level: "error", content: LOG_APST_38 },
  { id: "log-fio-38", serverId: "tyr-srv19", validationId: "val-38-nvme", name: "fio_results_38.log", source: "fio 3.28", size: 1020, lines: 6, createdAt: "2026-06-04T06:40:00", level: "info", content: LOG_FIO_38 },
];

/* ---------------------------------------------------------------------------
   Reports (one per source PDF — real page counts and byte sizes)
--------------------------------------------------------------------------- */
export const reports: Report[] = [
  { id: "rep-roce", title: "100 GbE / RoCE v2 NIC Benchmark", serverId: "srv-218", validationId: "val-100g-roce", type: "Network Benchmark Report", status: "approved", author: REPORT_AUTHOR, createdAt: "2026-05-21T14:30:00", updatedAt: "2026-05-21T16:00:00", pages: 12, size: 512822, file: "/docs/Netweb_100G_RoCE_Benchmark_Report.pdf" },
  { id: "rep-mem2c", title: "DDR5 Memory Validation — 256 GB + 128 GB", serverId: "tyr-217", validationId: "val-217-mem-2camp", type: "Memory Validation Report", status: "approved", author: REPORT_AUTHOR, createdAt: "2026-05-27T09:00:00", updatedAt: "2026-05-27T10:30:00", pages: 9, size: 498481, file: "/docs/Netweb_Memory_Validation_Report.pdf" },
  { id: "rep-25g", title: "25G NIC Bonding — Validation & Performance", serverId: "tyr-a131", validationId: "val-25g-bond", type: "Network Benchmark Report", status: "review", author: REPORT_AUTHOR, createdAt: "2026-05-28T16:30:00", updatedAt: "2026-05-28T17:30:00", pages: 4, size: 492124, file: "/docs/Netweb_25G_NIC_Bonding_Benchmark_Report.pdf" },
  { id: "rep-srv19", title: "Server 172.16.13.19 — Memory Validation", serverId: "tyr-srv19", validationId: "val-srv19-mem", type: "Memory Validation Report", status: "review", author: REPORT_AUTHOR, createdAt: "2026-05-28T11:10:00", updatedAt: "2026-05-28T13:10:00", pages: 6, size: 461099, file: "/docs/Netweb_Server19_Memory_Validation_Report.pdf" },
  { id: "rep-mem3h", title: "3-Hour DDR5 Memory Validation — 172.16.13.217", serverId: "tyr-217", validationId: "val-217-mem-3h", type: "Memory Validation Report", status: "approved", author: REPORT_AUTHOR, createdAt: "2026-06-01T09:10:00", updatedAt: "2026-06-01T11:45:00", pages: 6, size: 493393, file: "/docs/Netweb_217_3h_Memory_Validation_Report.pdf" },
  { id: "rep-nvme", title: "3-Hour NVMe SSD Validation — 172.16.13.217", serverId: "tyr-217", validationId: "val-217-nvme", type: "Storage Validation Report", status: "review", author: REPORT_AUTHOR, createdAt: "2026-06-02T07:00:00", updatedAt: "2026-06-02T08:20:00", pages: 5, size: 546320, file: "/docs/Netweb_217_3h_NVMe_Validation_Report.pdf" },
  { id: "rep-38-nvme", title: "NVMe SSD Validation — 172.16.15.38 (PM9D3a, cross-server)", serverId: "tyr-srv19", validationId: "val-38-nvme", type: "Storage Validation Report", status: "review", author: REPORT_AUTHOR, createdAt: "2026-06-04T07:00:00", updatedAt: "2026-06-04T08:20:00", pages: 5, size: 554289, file: "/docs/Netweb_38_NVMe_Validation_Report.pdf" },
];

/* ---------------------------------------------------------------------------
   Activity feed
--------------------------------------------------------------------------- */
export const activity: Activity[] = [
  { id: "ac-1", kind: "benchmark.completed", actor: ENGINEER, serverId: "tyr-217", serverName: "MH12XM · 217", target: "3-Hour NVMe SSD Validation", targetId: "val-217-nvme", at: "2026-06-02T06:45:00", meta: "960 GB M.2 link at Gen3 x2" },
  { id: "ac-2", kind: "validation.passed", actor: ENGINEER, serverId: "tyr-217", serverName: "MH12XM · 217", target: "3-Hour DDR5 Memory Validation", targetId: "val-217-mem-3h", at: "2026-06-01T08:38:00" },
  { id: "ac-3", kind: "report.approved", actor: "Abhinav / Shailendra Rajput", serverId: "tyr-217", serverName: "MH12XM · 217", target: "3-Hour Memory Validation Report", targetId: "rep-mem3h", at: "2026-06-01T11:45:00" },
  { id: "ac-4", kind: "comment.added", actor: "Abhinav / Shailendra Rajput", serverId: "tyr-217", serverName: "MH12XM · 217", target: "val-217-nvme", targetId: "val-217-nvme", at: "2026-06-02T08:00:00", meta: "Same M.2 Gen3 x2 downgrade we keep seeing…" },
  { id: "ac-5", kind: "validation.failed", actor: ENGINEER, serverId: "tyr-srv19", serverName: "MDI300", target: "Memory Validation — Xeon 6730P (CPU lock)", targetId: "val-srv19-mem", at: "2026-05-28T10:58:00", meta: "All cores locked at 500 MHz" },
  { id: "ac-6", kind: "validation.added", actor: ENGINEER, serverId: "tyr-a131", serverName: "EPYC 9124", target: "25G NIC Bonding benchmark", targetId: "val-25g-bond", at: "2026-05-28T16:00:00" },
  { id: "ac-7", kind: "validation.passed", actor: ENGINEER, serverId: "tyr-217", serverName: "MH12XM · 217", target: "DDR5 Memory Validation — 256/128 GB", targetId: "val-217-mem-2camp", at: "2026-05-27T08:36:00" },
  { id: "ac-8", kind: "benchmark.completed", actor: ENGINEER, serverId: "srv-218", serverName: "Hawfinch", target: "100 GbE / RoCE v2 Benchmark", targetId: "val-100g-roce", at: "2026-05-21T14:00:00", meta: "98.18 Gb/s RoCE · 195 Gb/s bidir" },
  { id: "ac-9", kind: "firmware.updated", actor: ENGINEER, serverId: "srv-148", serverName: "MH12XM · 148", target: "NIC bnxt → 226.0.145.1", targetId: "fw-148-nic", at: "2026-05-15T09:05:00" },
  { id: "ac-10", kind: "report.approved", actor: "Abhinav / Shailendra Rajput", serverId: "srv-218", serverName: "Hawfinch", target: "100G RoCE Benchmark Report", targetId: "rep-roce", at: "2026-05-21T16:00:00" },
  { id: "ac-11", kind: "bios.updated", actor: ENGINEER, serverId: "tyr-srv19", serverName: "MDI300", target: "BIOS power profile under review", targetId: "bios-srv19", at: "2026-05-28T13:10:00" },
  { id: "ac-12", kind: "file.uploaded", actor: ENGINEER, serverId: "tyr-217", serverName: "MH12XM · 217", target: "lspci_link.txt", targetId: "log-lspci-217", at: "2026-06-02T06:47:00" },
  { id: "ac-38-1", kind: "benchmark.completed", actor: ENGINEER, serverId: "tyr-srv19", serverName: "MDI300", target: "NVMe SSD Validation — PM9D3a (cross-server)", targetId: "val-38-nvme", at: "2026-06-04T06:39:00", meta: "960 GB read 2× faster on Gen4 (.38 vs .217)" },
  { id: "ac-38-2", kind: "validation.failed", actor: ENGINEER, serverId: "tyr-srv19", serverName: "MDI300", target: "Drive S7RKNG0YB01786 dead at idle (APST)", targetId: "val-38-nvme", at: "2026-06-04T06:20:00", meta: "Recovered via PCIe rescan; needs APST fix" },
];

/* ---------------------------------------------------------------------------
   Benchmark detail — the per-product "complete detail" surfaced on /benchmarks.
   Result / industry-typical / verdict, methodology, and reference comparison
   are taken verbatim from the report summary, methodology and comparison tables.
--------------------------------------------------------------------------- */
export const benchmarks: BenchmarkDetail[] = [
  {
    id: "bm-100g-roce",
    validationId: "val-100g-roce",
    product: { name: "Broadcom BCM57508 / BCM57504", sku: "BCM57508 · BCM57504", vendor: "Broadcom", category: "Network", detail: "NetXtreme-E 100GbE (Thor) · RoCE v2 · back-to-back DAC" },
    metrics: [
      { metric: "TCP iperf3 sustained (5 min, NUMA-pinned)", result: "94.04 Gb/s", typical: "92–95 Gb/s", verdict: "pass" },
      { metric: "ib_send_bw (RoCE v2, 64 KB)", result: "98.18 Gb/s", typical: "96–98 Gb/s", verdict: "pass" },
      { metric: "ib_write_bw (RoCE v2, 64 KB)", result: "98.16 Gb/s", typical: "96–98 Gb/s", verdict: "pass" },
      { metric: "ib_read_bw (RoCE v2, 64 KB)", result: "98.17 Gb/s", typical: "94–97 Gb/s", verdict: "pass" },
      { metric: "Bidirectional full-duplex aggregate", result: "194.99 Gb/s", typical: "190–196 Gb/s", verdict: "pass" },
      { metric: "ib_write_lat min (2 B msg)", result: "2.41 µs", typical: "1.6–2.5 µs", verdict: "pass" },
      { metric: "ib_send_lat min (2 B msg)", result: "2.59 µs", typical: "1.8–2.5 µs", verdict: "pass" },
      { metric: "ib_read_lat min (2 B msg)", result: "4.39 µs", typical: "3.0–4.5 µs", verdict: "pass" },
      { metric: "sockperf 64 B PPS (kernel TCP)", result: "5.0 Mpps", typical: "4–6 Mpps", verdict: "pass" },
      { metric: "Host CPU at 100 Gb/s (RoCE vs TCP)", result: "0.71% vs 6.20%", typical: "RoCE ≪ TCP", verdict: "pass" },
      { metric: "FCS / PCS / pause errors", result: "0", typical: "0", verdict: "pass" },
    ],
    methodology: [
      { step: "TCP throughput", tool: "iperf3 — 12 × instances × 4 streams, NUMA-pinned, 300 s", purpose: "Sustained 100 G TCP" },
      { step: "RoCE bandwidth", tool: "ib_send/write/read_bw -F -R -D 30 -q 4 -s {64 KB, 1 MB}", purpose: "Peak RDMA bandwidth" },
      { step: "RoCE latency", tool: "ib_send/write/read_lat -a -n 5000", purpose: "Small-message RDMA latency" },
      { step: "Bidir full-duplex", tool: "ib_send_bw -b -D 60 -q 4 -s 65536", purpose: "200 G aggregate capability" },
      { step: "UDP / PPS", tool: "iperf3 -u -b 100G -P 8 ; sockperf throughput / ping-pong", purpose: "UDP + small-msg PPS / RTT" },
      { step: "Many-QP scaling", tool: "ib_write_bw with -q {1, 16, 64, 128}", purpose: "RDMA performance vs QP count" },
      { step: "Diagnostics", tool: "ethtool -m / -S, lspci -vv (AER), rdma link, ibstat", purpose: "Counter delta, PCIe health, RoCE port state" },
    ],
    references: {
      title: "Comparison vs published references",
      columns: ["Metric", "Our Tyrone box", "Broadcom Thor 100G", "NVIDIA CX-6 100G"],
      ourColumn: 1,
      rows: [
        ["ib_send_bw peak", "98.18 Gb/s", "96–98 Gb/s", "96–98 Gb/s"],
        ["ib_write_bw peak", "98.18 Gb/s", "96–98 Gb/s", "97–98 Gb/s"],
        ["ib_read_bw peak", "98.17 Gb/s", "94–97 Gb/s", "96–98 Gb/s"],
        ["Bidir aggregate", "194.99 Gb/s", "190–196 Gb/s", "190–196 Gb/s"],
        ["ib_send_lat min", "2.59 µs", "1.8–2.5 µs", "1.0–1.3 µs"],
        ["ib_write_lat min", "2.41 µs", "1.6–2.2 µs", "0.9–1.2 µs"],
        ["ib_read_lat min", "4.39 µs", "3.0–4.0 µs", "1.5–2.0 µs"],
        ["TCP iperf3 sustained", "94.04 Gb/s", "92–95 Gb/s", "92–96 Gb/s"],
        ["TCP RTT (sockperf median)", "48.6 µs", "45–60 µs", "30–50 µs"],
      ],
    },
    verdict:
      "Both Broadcom Thor NICs operate at full 100 G line rate for RoCE v2 send/write/read (98.18 Gb/s), sustain 195 Gb/s full-duplex, and match or exceed the published envelope. Read BW actually exceeds the typical Thor window. RoCE uses ~9× less host CPU than TCP at the same throughput — ~1 core vs ~6 — freeing 50+ cores/node at 10 links.",
  },
  {
    id: "bm-217-nvme",
    validationId: "val-217-nvme",
    product: { name: "Samsung PM1743 15.36 TB", sku: "MZWL615THBLF-00AW7", vendor: "Samsung", category: "Storage", detail: "U.2 PCIe Gen5 enterprise NVMe (×2)" },
    alsoCovers: [{ name: "Samsung 960 GB M.2", sku: "MZVL6960HFLB-01AW7", vendor: "Samsung", category: "Storage", detail: "Client M.2 (×2) — link-limited" }],
    metrics: [
      { metric: "PM1743 sequential read (Gen5 x4)", result: "12.22 / 12.32 GB/s", typical: "up to 14 GB/s", verdict: "pass" },
      { metric: "PM1743 sequential write", result: "7.06 / 7.06 GB/s", typical: "~6.9–7.5 GB/s", verdict: "pass" },
      { metric: "PM1743 4K random read (QD512)", result: "1,760K / 1,745K IOPS", typical: "1.5–2.5M IOPS", verdict: "pass" },
      { metric: "PM1743 QD1 read / write latency", result: "69.1 / 11.8 µs", typical: "60–90 / 10–20 µs", verdict: "pass" },
      { metric: "PM1743 PCIe link (both)", result: "Gen5 x4 (32 GT/s)", typical: "Gen5 x4", verdict: "pass" },
      { metric: "960 GB PCIe link (both)", result: "Gen3 x2 (8 GT/s)", typical: "Gen4 x4", verdict: "fail" },
      { metric: "960 GB sequential read (link-capped)", result: "1.87 / 1.87 GB/s", typical: "~6–7 GB/s @ Gen4 x4", verdict: "warn" },
      { metric: "960 GB 4K random read", result: "443K IOPS", typical: "link-bound (1.8 GB/s wall)", verdict: "warn" },
      { metric: "SMART health (all 4 drives)", result: "0 errors · 0% wear", typical: "0 / 0", verdict: "pass" },
      { metric: "Thermals under load (peak)", result: "PM1743 ≤32 °C · 960 GB ≤42 °C", typical: "no throttle <70 °C", verdict: "pass" },
    ],
    methodology: [
      { step: "Precondition + Seq write", tool: "rw=write bs=1M iodepth=32 numjobs=4 (fio 3.28, libaio, direct=1)", purpose: "Peak write BW; fill test region for valid reads" },
      { step: "Seq read", tool: "rw=read bs=1M iodepth=32 numjobs=4", purpose: "Peak sequential read bandwidth" },
      { step: "Rand write 4K", tool: "rw=randwrite bs=4k iodepth=128 numjobs=4, 60 s", purpose: "Fresh-state 4K write IOPS" },
      { step: "Rand read 4K", tool: "rw=randread bs=4k iodepth=128 numjobs=4, 60 s", purpose: "4K read IOPS (QD512 aggregate)" },
      { step: "Mixed 70/30", tool: "rw=randrw rwmixread=70 bs=4k iodepth=64 numjobs=4", purpose: "Blended OLTP-style workload" },
      { step: "QD1 latency", tool: "bs=4k iodepth=1 numjobs=1 (read, then write), 30 s", purpose: "Single-IO service latency (avg + p99)" },
    ],
    references: {
      title: "Per-drive measured results",
      columns: ["Metric", "PM1743 #0", "PM1743 #1", "960 GB #0", "960 GB #1"],
      ourColumn: -1,
      rows: [
        ["Seq read (GB/s)", "12.22", "12.32", "1.87", "1.87"],
        ["Seq write (GB/s)", "7.06", "7.06", "1.62", "1.62"],
        ["4K rand read (IOPS)", "1,760,240", "1,744,989", "443,231", "443,237"],
        ["4K rand write (IOPS)", "1,717,838", "1,718,100", "395,459", "395,547"],
        ["QD1 read latency (µs)", "69.1", "68.5", "66.5", "66.2"],
        ["QD1 write latency (µs)", "11.8", "12.0", "15.5", "15.5"],
        ["Rand read p99 (µs)", "469", "469", "3621", "3588"],
        ["PCIe link", "Gen5 x4", "Gen5 x4", "Gen3 x2", "Gen3 x2"],
      ],
    },
    verdict:
      "The two PM1743 15.36 TB drives are production-ready at full PCIe Gen5 x4 — ~12.3 GB/s read, 7.06 GB/s write, ~1.75M 4K read IOPS, 12 µs QD1 write latency, perfect health. The two 960 GB drives are healthy but link-throttled: both negotiated Gen3 x2 instead of Gen4 x4 (~26% of capability). A platform/slot link-training fault, not a drive defect — fix slot/bifurcation, then re-qualify.",
  },
  {
    id: "bm-25g-bond",
    validationId: "val-25g-bond",
    product: { name: "Broadcom BCM57414 NetXtreme-E 25GbE", sku: "BCM57414", vendor: "Broadcom", category: "Network", detail: "dual-port 25GbE · bnxt_en · SFP28 back-to-back" },
    metrics: [
      { metric: "Single link B→A (8 streams)", result: "24.2 Gb/s", typical: "~24 Gb/s line", verdict: "pass" },
      { metric: "Single link A→B (8 streams)", result: "17.5 Gb/s", typical: "directional asymmetry", verdict: "pass" },
      { metric: "Two links simultaneous (independent)", result: "32.0 Gb/s", typical: "sum of two links", verdict: "pass" },
      { metric: "balance-xor bond A→B (16 streams)", result: "22.2 Gb/s", typical: "aggregates with flows", verdict: "warn" },
      { metric: "balance-rr bond (round-robin)", result: "heavy reorder, 41k retr", typical: "unsuitable for TCP", verdict: "fail" },
      { metric: "Jumbo-frame loss (8972 B DF)", result: "0%", typical: "0%", verdict: "pass" },
      { metric: "TCP latency (qperf) — no bond / bond", result: "18 / 24 µs", typical: "<30 µs", verdict: "pass" },
      { metric: "ICMP round-trip — no bond / bond", result: "0.45 / 0.52 ms", typical: "sub-ms", verdict: "pass" },
    ],
    methodology: [
      { step: "Link verify", tool: "ping -M do -s 8972 (jumbo, DF)", purpose: "Confirm 25 Gb/s, 0% loss with jumbo frames" },
      { step: "Baseline", tool: "iperf3 -P {1,8}, both directions (no bond)", purpose: "Single-link throughput + retransmits" },
      { step: "Bond — balance-rr", tool: "iproute2 bond mode 0 across two 25G ports", purpose: "Round-robin striping behaviour" },
      { step: "Bond — balance-xor", tool: "iproute2 bond mode 2, layer3+4 hash", purpose: "Flow-hash aggregation" },
      { step: "Latency", tool: "qperf TCP/UDP one-way ; ICMP ping", purpose: "Latency + RTT, bonded vs single" },
    ],
    references: {
      title: "Throughput by configuration and direction (iperf3, MTU 9000)",
      columns: ["Configuration", "A→B", "B→A", "Retransmits"],
      ourColumn: -1,
      rows: [
        ["Single link (1 stream)", "16.9 Gb/s", "—", "0"],
        ["Single link (8 streams)", "17.5 Gb/s", "24.2 Gb/s", "0–14"],
        ["balance-rr (mode 0, 8 str)", "17.4 Gb/s", "25.5 Gb/s", "4,373"],
        ["balance-xor (mode 2, 16 str)", "22.2 Gb/s", "9.9 Gb/s", "1 / 21,370"],
      ],
    },
    verdict:
      "Single 25G links are healthy: ~24 Gb/s (B→A), ~17 Gb/s (A→B), ~18 µs latency, near-zero loss with jumbo frames. Bonding forms and carries traffic but does not cleanly double throughput — capped by Server A's bonded ports sharing one PCIe x4 slot (31.5 Gb/s) plus marginal optics (not a NIC fault). Use balance-xor / 802.3ad, never balance-rr; move the card to an x8 slot to reach ~45–48 Gb/s aggregate.",
  },
  {
    id: "bm-217-mem-3h",
    validationId: "val-217-mem-3h",
    product: { name: "Samsung 96 GB DDR5-6400 RDIMM", sku: "MDRRWM4QDBC2-3E000", vendor: "Samsung", category: "Memory", detail: "12 × 96 GB · 1.15 TB · dual-rank · 12-of-24 channels" },
    metrics: [
      { metric: "DIMM detection (BMC / BIOS / kernel)", result: "12 / 12 / 12", typical: "12 / 12 / 12", verdict: "pass" },
      { metric: "DIMM speed (rated / configured)", result: "6400 / 6000 MT/s", typical: "6000 MT/s on EPYC 1DPC", verdict: "pass" },
      { metric: "Phase 1 — 2h stress-ng verify (832 GB set)", result: "7202.58 s, 0 errors", typical: "0 errors", verdict: "pass" },
      { metric: "Phase 2 — 30m memtester (1088 GB locked)", result: "0 failures / 64 logs", typical: "0 errors", verdict: "pass" },
      { metric: "Peak memory residency (Phase 2)", result: "1088 GB = 96.0%", typical: "≥90% target", verdict: "pass" },
      { metric: "EDAC CE / UE (mc0 + mc1)", result: "0 / 0", typical: "0 (new modules)", verdict: "pass" },
      { metric: "Per-rank EDAC (24 ranks)", result: "24 / 24 clean", typical: "24 / 24 clean", verdict: "pass" },
      { metric: "STREAM aggregate (64 wkrs, both sockets)", result: "443.3 GB/s", typical: "420–480 GB/s @ 12-of-24", verdict: "pass" },
      { metric: "STREAM single-socket (32 wkrs)", result: "168.6 GB/s", typical: "150–200 GB/s", verdict: "pass" },
      { metric: "Single-thread memcpy (MBW, NUMA-local)", result: "20.77 GB/s", typical: "18–22 GB/s on EPYC 9135", verdict: "pass" },
      { metric: "NUMA-remote bandwidth ratio", result: "1.67×", typical: "1.5–1.8×", verdict: "pass" },
      { metric: "sysbench 1 M random write (64 thr)", result: "26.9 GB/s, 2.38 ms", typical: "20–30 GB/s", verdict: "pass" },
    ],
    methodology: [
      { step: "Baseline", tool: "EDAC sysfs + dmesg snapshot; ipmitool sdr/sel", purpose: "Capture CE/UE = 0 and SEL state before load" },
      { step: "Bandwidth", tool: "stress-ng --stream 64; mbw -n 5 -t 0 4096 (local & remote); sysbench memory", purpose: "STREAM, single-thread memcpy, NUMA penalty, sustained 1 M write" },
      { step: "Phase 1 (2 h)", tool: "stress-ng --vm 64 --vm-bytes 13G --vm-method all --verify --timeout 7200s", purpose: "Touch 832 GB through 52 verify patterns; every write read back" },
      { step: "Phase 2 (30 min)", tool: "64 × memtester 17G (timeout 1800s)", purpose: "Lock 1088 GB (mlock) + 18-algorithm suite at 96% residency" },
      { step: "Post-test", tool: "EDAC sysfs + per-rank counters; dmesg | grep mce/edac; ipmitool sel", purpose: "Delta-check vs baseline; per-rank PASS/FAIL; verify 0 MCE / SEL" },
    ],
    references: {
      title: "STREAM scaling vs channel population (same EPYC 9135)",
      columns: ["Metric", "12 × 96 GB (12-of-24)", "8 × 256 GB (4-of-12)", "Full 24-of-24"],
      ourColumn: 1,
      rows: [
        ["Aggregate STREAM", "443.3 GB/s", "245.4 GB/s", "550–580 GB/s"],
        ["Per-socket STREAM", "168.6 GB/s", "113.9 GB/s", "275–290 GB/s"],
        ["Per-channel effective", "≈37 GB/s", "≈31 GB/s", "≈38–42 GB/s"],
        ["1-thread memcpy", "20.77 GB/s", "20.57 GB/s", "20–22 GB/s"],
        ["NUMA-remote penalty", "1.67×", "1.69×", "1.5–1.8×"],
      ],
    },
    verdict:
      "All 12 Samsung 96 GB DDR5-6400 modules pass a 2.5-hour campaign — 2h write-and-verify (52 patterns) + 30m at 96% RAM residency (1.09 TB pinned) — with zero ECC errors and zero machine-check events. 443 GB/s aggregate STREAM is at the top of the EPYC 9135 / DDR5-6000 envelope for the 12-of-24 layout (1.81× the 4-of-12 config). Validated for production memory-bound workloads.",
  },
  {
    id: "bm-217-mem-2camp",
    validationId: "val-217-mem-2camp",
    product: { name: "Samsung 256 GB / 128 GB DDR5-6400 RDIMM", sku: "M321RBJA0M22-CLPIL · M321RAJA0MB2-CCPWF", vendor: "Samsung", category: "Memory", detail: "8 × 256 GB (2 TB) + 8 × 128 GB (1 TB) · 4-of-12 channels" },
    metrics: [
      { metric: "STREAM aggregate (256 GB / 128 GB)", result: "245.4 / 243.6 GB/s", typical: "channel-limited 4-of-12", verdict: "pass" },
      { metric: "STREAM per-socket (256 / 128)", result: "113.9 / 114.3 GB/s", typical: "equivalent", verdict: "pass" },
      { metric: "Single-thread memcpy (256 / 128)", result: "20.57 / 19.89 GB/s", typical: "20–22 GB/s", verdict: "pass" },
      { metric: "NUMA-remote penalty (256 / 128)", result: "1.69× / 1.63×", typical: "1.5–1.8×", verdict: "pass" },
      { metric: "sysbench 1 M write (256 / 128)", result: "17.2 / 16.6 GB/s", typical: "equivalent", verdict: "pass" },
      { metric: "Phase 2 residency (256 / 128)", result: "95.8% / 96.1%", typical: "≥95% target", verdict: "pass" },
      { metric: "EDAC CE / UE (16 ranks each)", result: "0 / 0", typical: "0 / 0", verdict: "pass" },
      { metric: "MCE events (90-min window)", result: "0", typical: "0", verdict: "pass" },
    ],
    methodology: [
      { step: "Baseline", tool: "EDAC sysfs + dmesg snapshot", purpose: "Capture CE/UE = 0 before load" },
      { step: "Phase 1 (30 min)", tool: "stress-ng --vm 32 --vm-bytes {48G/24G} --vm-method all --verify --timeout 1800s", purpose: "Touch ~75% of RAM through 52 patterns; verify read-back" },
      { step: "Phase 2 (15 min)", tool: "32 × memtester {60G/30G} (timeout 900s)", purpose: "Lock ≥95% of RAM; 18-algorithm memtester suite" },
      { step: "Bandwidth", tool: "stress-ng --stream; mbw -n 5 -t 0 4096; numactl variants", purpose: "STREAM aggregate + per-socket + single-thread memcpy" },
      { step: "Latency", tool: "sysbench memory --memory-block-size=4K --threads=16 (local + remote)", purpose: "Random-write latency, NUMA-local and remote" },
    ],
    references: {
      title: "Comparison vs published references",
      columns: ["Metric", "256 GB / 2 TB", "128 GB / 1 TB", "Full 12-of-12", "DDR5-6000 spec"],
      ourColumn: 1,
      rows: [
        ["Aggregate STREAM", "245.4 GB/s", "243.6 GB/s", "460–500 GB/s", "—"],
        ["Per-socket STREAM", "113.9 GB/s", "114.3 GB/s", "230–250 GB/s", "—"],
        ["Per-channel BW", "≈30.7 GB/s", "≈30.4 GB/s", "≈38–42 GB/s", "48 GB/s rated"],
        ["1-thread memcpy", "20.57 GB/s", "19.89 GB/s", "20–22 GB/s", "—"],
        ["NUMA penalty", "1.69×", "1.63×", "1.5–1.8×", "—"],
      ],
    },
    verdict:
      "Both module sets (8 × 256 GB and 8 × 128 GB) are validated — zero ECC, zero MCE across 90 minutes. Aggregate STREAM is essentially identical (≈244 GB/s) because the 4-of-12 channel population is the bottleneck, not module density. Choose capacity by working-set size; populate more channels (toward 12-of-12 ≈ 500 GB/s) for bandwidth.",
  },
  {
    id: "bm-srv19-mem",
    validationId: "val-srv19-mem",
    product: { name: "Intel Xeon 6730P + Samsung DDR5-6400", sku: "Xeon 6730P (Granite Rapids)", vendor: "Intel / Samsung", category: "Memory", detail: "8 DIMMs (256 GB + 128 GB campaigns) · CPU-lock platform finding" },
    metrics: [
      { metric: "DIMM detect (BMC / BIOS / kernel)", result: "8 / 8 / 8", typical: "8 / 8 / 8", verdict: "pass" },
      { metric: "Configured speed", result: "6400 MT/s (full)", typical: "6400 MT/s", verdict: "pass" },
      { metric: "30-min stress-ng verify (both)", result: "0 errors", typical: "0 errors", verdict: "pass" },
      { metric: "15-min memtester (≥95% locked)", result: "0 failures", typical: "0 errors", verdict: "pass" },
      { metric: "EDAC CE / UE (16 mc)", result: "0 / 0", typical: "0 / 0", verdict: "pass" },
      { metric: "CPU core frequency (under load)", result: "500 MHz", typical: "2500 base / 3800 turbo", verdict: "fail" },
      { metric: "1-thread memcpy (consequence)", result: "2.31 GB/s", typical: "20–24 GB/s @ 3.8 GHz", verdict: "warn" },
      { metric: "STREAM aggregate (throttled)", result: "≈23 GB/s", typical: "300–340 GB/s", verdict: "warn" },
    ],
    methodology: [
      { step: "Memory verify", tool: "stress-ng --vm 64 --verify --timeout 1800s; 64 × memtester", purpose: "ECC correctness + ≥95% residency burn" },
      { step: "Bandwidth", tool: "stress-ng --stream; mbw; sysbench memory", purpose: "STREAM + memcpy (recorded under throttle)" },
      { step: "Frequency diagnosis", tool: "turbostat Bzy_MHz; rdmsr 0x771/0x774/0x199/0x64F; governor/EPP", purpose: "Confirm delivered freq vs requested; rule out thermal/power limits" },
      { step: "Platform", tool: "CoreTmp / PkgTmp; RAPL pkg power vs cap; dmesg", purpose: "Confirm not thermal (33–35 °C) / not power-capped (104 W vs 250 W)" },
    ],
    references: {
      title: "Bandwidth under throttle vs expected at rated clock (NOT representative)",
      columns: ["Test", "Campaign A @500MHz", "Campaign B @500MHz", "Expected @3.8GHz"],
      ourColumn: -1,
      rows: [
        ["MBW memcpy 1-thr local", "2.31 GB/s", "2.30 GB/s", "20–24 GB/s"],
        ["MBW memcpy 1-thr remote", "1.40 GB/s", "1.38 GB/s", "12–15 GB/s"],
        ["sysbench 1M rnd write 64thr", "2.42 GB/s", "3.49 GB/s", "15–20 GB/s"],
        ["STREAM aggregate", "≈23 GB/s", "≈23 GB/s", "300–340 GB/s"],
      ],
    },
    verdict:
      "Both DIMM sets pass memory validation — detected at all layers, full 6400 MT/s, zero ECC. Testing surfaced a platform firmware fault locking every core at 500 MHz (vs 3.8 GHz rated), reproduced across reboot + DIMM swap and independent of the memory. Bandwidth is throttled ~10× and not representative. Resolve via BIOS power-profile / config-TDP + microcode before benchmarking.",
  },
  {
    id: "bm-38-nvme",
    validationId: "val-38-nvme",
    product: { name: "Samsung PM9D3a (15.36 TB U.2 + 960 GB M.2)", sku: "MZWL615THBLF · MZVL6960HFLB", vendor: "Samsung", category: "Storage", detail: "Same drives as .217 — cross-server PCIe link comparison" },
    metrics: [
      { metric: "15.36 TB U.2 sequential read (Gen5 x4)", result: "12.02 / 12.48 GB/s", typical: "≈ .217 (12.2 GB/s)", verdict: "pass" },
      { metric: "15.36 TB U.2 sequential write", result: "7.05 / 7.05 GB/s", typical: "≈ .217 (7.06 GB/s)", verdict: "pass" },
      { metric: "15.36 TB 4K random read", result: "1.51M / 1.55M IOPS", typical: "1.5–2.5M", verdict: "pass" },
      { metric: "960 GB M.2 sequential read", result: "3.76 GB/s", typical: "2.0× .217 (1.87) — link fix", verdict: "pass" },
      { metric: "960 GB M.2 4K random read", result: "852K IOPS", typical: "1.9× .217 (443K)", verdict: "pass" },
      { metric: "960 GB M.2 seq / rand write", result: "1.62 GB/s · 395K IOPS", typical: "= .217 (NAND-bound)", verdict: "pass" },
      { metric: "960 GB M.2 PCIe link", result: "Gen4 x2", typical: "Gen4 x4 capable", verdict: "warn" },
      { metric: "15.36 TB U.2 PCIe link (both)", result: "Gen5 x4 (32 GT/s)", typical: "Gen5 x4", verdict: "pass" },
      { metric: "Drive S7RKNG0YB01786 (15.36 TB)", result: "Dead at idle (APST) → recovered, full load OK", typical: "needs APST fix before prod", verdict: "warn" },
      { metric: "SMART health (all 4)", result: "0 media errors · 0% wear · ≤ 46 °C", typical: "0 / 0 (new)", verdict: "pass" },
    ],
    methodology: [
      { step: "Precondition + Seq write", tool: "rw=write bs=1M iodepth=32 numjobs=4 (fio 3.28, libaio, direct=1, numactl node0)", purpose: "Peak write BW; fill region for valid reads" },
      { step: "Seq read", tool: "rw=read bs=1M iodepth=32 numjobs=4", purpose: "Peak sequential read bandwidth" },
      { step: "Rand read / write 4K", tool: "bs=4k iodepth=128 numjobs=4, 60 s time-based", purpose: "4K IOPS at QD512 (read & fresh-state write)" },
      { step: "Mixed 70/30", tool: "rw=randrw rwmixread=70 bs=4k iodepth=64 numjobs=4", purpose: "Blended OLTP-style workload" },
      { step: "QD1 latency", tool: "bs=4k iodepth=1 numjobs=1 (read, then write), 30 s", purpose: "Single-IO service latency (avg + p99)" },
    ],
    references: {
      title: "Cross-server — same drives, MDA200A2N-224 (.217) vs Tyrone MDI300 (.38)",
      columns: ["Metric (representative drive)", "960 GB .217", "960 GB .38", "15.36 TB .217", "15.36 TB .38"],
      ourColumn: -1,
      rows: [
        ["Seq read (GB/s)", "1.87", "3.76", "12.22", "12.48"],
        ["Seq write (GB/s)", "1.62", "1.62", "7.06", "7.05"],
        ["Rand read 4K (IOPS)", "443,237", "852,199", "1,760,240", "1,554,033"],
        ["PCIe link negotiated", "Gen3 x2", "Gen4 x2", "Gen5 x4", "Gen5 x4"],
      ],
    },
    verdict:
      "The .217 open question is answered: the 960 GB drives' sequential read doubled (1.87 → 3.76 GB/s) and random read nearly doubled (443K → 852K IOPS) simply by moving from the MDA200A2N-224 (.217) to this Tyrone MDI300 (.38) — the Gen3 cap was a .217 slot/BIOS fault, now Gen4. But the link still trains x2 width on both servers, leaving ~50% of Gen4 x4 unused. The 15.36 TB Gen5 drives are consistent across platforms (~12 GB/s). One 15.36 TB drive arrived dead from an APST controller-down fault and recovered via PCIe rescan to full Gen5 x4 — electrically sound but needs the APST mitigation before production.",
  },
];
