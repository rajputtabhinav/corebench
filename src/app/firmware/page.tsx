import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/shell/page";
import { FirmwareView } from "@/components/domain/firmware-view";
import { getFirmware } from "@/lib/data";

export const metadata: Metadata = { title: "Firmware" };

export default function FirmwarePage() {
  return (
    <PageContainer size="wide">
      <PageHeader
        title="Firmware"
        description="BIOS, BMC, CPLD, NIC and SSD firmware tracked across the fleet over time."
      />
      <FirmwareView entries={getFirmware()} />
    </PageContainer>
  );
}
