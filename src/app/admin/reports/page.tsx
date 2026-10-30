"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsToReviewPage() {
  const [reports, setReports] = useState([
    {
      id: "rep-1",
      reporter: "Asha Kumari",
      reportedUser: "Student account #CS2023-091",
      reason: "Repeated spam in society discussion thread",
      preview: "Offering unofficial examination notes for sale.",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: "rep-2",
      reporter: "Officer Vikram Singh",
      reportedUser: "Unverified visitor email",
      reason: "Suspicious message sent to hostel resident",
      preview: "Requesting personal room numbers.",
      time: "Yesterday",
      status: "pending",
    },
  ]);

  const handleAction = (id: string, action: "resolved" | "dismissed") => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Reports to review</h1>
          <p className="text-sm text-muted">
            Reported messages, conduct concerns, and student safety requests requiring administrative review.
          </p>
        </div>

        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((r) => (
              <Card key={r.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emergency" />
                    <span className="text-xs font-bold text-emergency">Reported message</span>
                  </div>
                  <span className="text-xs text-muted tabular-nums">{r.time}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p>
                    <span className="text-muted">Reported by:</span>{" "}
                    <strong className="text-text">{r.reporter}</strong>
                  </p>
                  <p>
                    <span className="text-muted">Concern:</span>{" "}
                    <strong className="text-text">{r.reason}</strong>
                  </p>
                </div>

                <div className="p-3 bg-paper border border-line rounded text-xs text-text italic">
                  "{r.preview}"
                </div>

                <div className="pt-3 border-t border-line flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(r.id, "dismissed")}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAction(r.id, "resolved")}
                  >
                    Block person & resolve
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-sm text-muted">
              No reports currently waiting for review.
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
