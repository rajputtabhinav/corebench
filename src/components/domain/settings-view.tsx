"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/data";

function PrefRow({
  title,
  description,
  defaultOn = false,
}: {
  title: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-foreground">{title}</p>
        <p className="text-[12.5px] text-muted-foreground">{description}</p>
      </div>
      <Toggle checked={on} onChange={setOn} aria-label={title} />
    </div>
  );
}

export function SettingsView({ user, team }: { user: User; team: User[] }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-foreground">{user.name}</p>
              <Badge tone="accent" size="sm" className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Full name</label>
              <Input defaultValue={user.name} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Email</label>
              <Input defaultValue={user.email} type="email" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="accent" size="sm">
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border py-0">
          <PrefRow title="Show context panel" description="Display the right-hand details panel by default." defaultOn />
          <PrefRow title="Email on validation failure" description="Get notified when a validation fails or regresses." defaultOn />
          <PrefRow title="Compact density" description="Tighter spacing across tables and lists." />
          <PrefRow title="Weekly digest" description="A Monday summary of fleet activity and pending reviews." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <span className="text-[12px] text-muted-foreground">{team.length} members</span>
        </CardHeader>
        <CardContent className="pt-1">
          {team.map((m, i) => (
            <div key={m.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 py-3">
                <Avatar name={m.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-foreground">{m.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">{m.email}</p>
                </div>
                <Badge tone={m.role === "Admin" ? "accent" : m.role === "Viewer" ? "neutral" : "outline"} size="sm">
                  {m.role}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
