"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  BookOpen,
  FolderOpen,
  ArrowRight,
  CreditCard,
  FileText,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export default function PrincipalPage() {
  const { incidents, raggingComplaints, currentUser, timetable, notices } = useApp();

  const activeIncidents = incidents.filter((i) => i.status !== "closed");
  const pendingRagging = raggingComplaints.filter((r) => r.status !== "closed");

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h1 className="text-xl font-heading font-bold text-ink">
                Office of the Principal
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Executive University Supervision • {currentUser.full_name} • Principal Desk
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/ragging">
              <Button variant="danger" size="sm" className="gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Anti-Ragging Squad ({pendingRagging.length})</span>
              </Button>
            </Link>
            <Link href="/security">
              <Button size="sm" className="gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety Alerts Queue ({activeIncidents.length})</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Active safety alerts"
            value={activeIncidents.length}
            sublabel="Under immediate response"
          />
          <StatCard
            label="Anti-ragging cases"
            value={pendingRagging.length}
            sublabel="Under squad investigation"
          />
          <StatCard
            label="Today's scheduled classes"
            value={timetable.length}
            sublabel="Across all teaching blocks"
          />
          <StatCard
            label="Official notices"
            value={notices.length}
            sublabel="Published by administration"
          />
        </div>

        {/* Priority Queues: Anti-Ragging & Active Safety */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anti-Ragging Panel */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emergency" />
                <h2 className="text-sm font-heading font-bold text-ink">
                  Anti-Ragging Committee Queue
                </h2>
              </div>
              <Link href="/ragging" className="text-xs font-semibold text-accent hover:underline">
                View all cases
              </Link>
            </div>

            <div className="space-y-2.5">
              {raggingComplaints.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-ink">{r.public_id}</span>
                    <StatusBadge
                      status={r.status === "resolved" ? "resolved" : "in_progress"}
                      label={r.status.replace(/_/g, " ")}
                    />
                  </div>
                  <p className="text-xs font-semibold text-text">{r.location}</p>
                  <p className="text-xs text-muted truncate">{r.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Safety Alerts */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-heading font-bold text-ink">
                  Emergency Dispatch Queue
                </h2>
              </div>
              <Link href="/security" className="text-xs font-semibold text-accent hover:underline">
                View alerts console
              </Link>
            </div>

            <div className="space-y-2.5">
              {activeIncidents.slice(0, 3).map((inc) => (
                <div key={inc.id} className="p-3 bg-paper rounded border border-line space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-ink">{inc.public_id}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <p className="text-xs font-semibold text-text capitalize">
                    {inc.category.replace(/_/g, " ")}: {inc.location_text}
                  </p>
                  <p className="text-xs text-muted">Reporter: {inc.reporter_name}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Links for Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link href="/directory">
            <Card className="p-4 hover:border-accent transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Faculty Directory</p>
                <p className="text-xs text-muted">Consultation hours & contacts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Card>
          </Link>

          <Link href="/documents">
            <Card className="p-4 hover:border-accent transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">University Documents</p>
                <p className="text-xs text-muted">Placements, rules & forms</p>
              </div>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Card>
          </Link>

          <Link href="/fees">
            <Card className="p-4 hover:border-accent transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Fee Records</p>
                <p className="text-xs text-muted">Student payment receipts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-accent" />
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
