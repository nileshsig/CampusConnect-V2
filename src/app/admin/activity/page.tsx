"use client";

import React from "react";
import { FileText, Shield, Clock, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";

export default function ActivityRecordPage() {
  const records = [
    {
      id: "act-1",
      actor: "Officer Vikram Singh",
      action: "Alert status updated to Acknowledged",
      entity: "Alert INC-20261031-0012",
      time: "22 minutes ago",
    },
    {
      id: "act-2",
      actor: "Registrar Office Admin",
      action: "Published urgent weather safety notice",
      entity: "Notices bulletin",
      time: "1 hour ago",
    },
    {
      id: "act-3",
      actor: "Dr. S. Prasad",
      action: "Updated classroom for CS402 to Room 102",
      entity: "Academics Timetable",
      time: "3 hours ago",
    },
    {
      id: "act-4",
      actor: "Registrar Office Admin",
      action: "Assigned Officer Singh as responder",
      entity: "Alert INC-20261031-0008",
      time: "Yesterday",
    },
    {
      id: "act-5",
      actor: "Registrar Office Admin",
      action: "Created new society: Science and Innovation Forum",
      entity: "Student Clubs",
      time: "3 days ago",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Activity Record</h1>
          <p className="text-sm text-muted">
            Every administrative update, responder assignment, and notice publication is recorded.
          </p>
        </div>

        <div className="bg-surface border border-line rounded-card overflow-hidden">
          <div className="p-4 bg-paper border-b border-line flex items-center justify-between text-xs text-muted">
            <span>Immutable University System Record</span>
            <span>Total records: {records.length}</span>
          </div>

          <div className="divide-y divide-line">
            {records.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-paper">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">{r.action}</p>
                  <p className="text-xs text-muted">
                    Responsible person: <strong className="text-text">{r.actor}</strong> • Area: {r.entity}
                  </p>
                </div>
                <span className="text-xs text-muted shrink-0 tabular-nums">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
