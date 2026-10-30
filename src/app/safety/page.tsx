"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";
import { SOSFlowModal } from "@/components/safety/sos-flow-modal";

export default function SafetyHubPage() {
  const { incidents, timeline, currentUser } = useApp();
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [submittedReport, setSubmittedReport] = useState(false);

  const myIncidents = incidents.filter(
    (i) => i.reporter_id === currentUser.id || currentUser.role === "admin" || currentUser.role === "principal"
  );

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;
    setSubmittedReport(true);
    setReportTitle("");
    setReportDetails("");
    setReportLocation("");
    setTimeout(() => setSubmittedReport(false), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">Campus Safety Hub</h1>
            <p className="text-sm text-muted">
              Emergency assistance, incident tracking, non-emergency reports, and safety helplines.
            </p>
          </div>

          <Button
            variant="danger"
            onClick={() => setSosModalOpen(true)}
            size="lg"
            className="gap-2 self-start sm:self-auto"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Send alert</span>
          </Button>
        </div>

        {/* Helpline Call Cards (FR-S13) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-surface border border-line rounded-card flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Campus Security & Principal Dispatch</p>
              <p className="text-lg font-heading font-bold text-ink tabular-nums mt-0.5">
                06546-261234
              </p>
              <p className="text-xs text-muted">Available 24 hours at Main Gate & Office</p>
            </div>
            <a
              href="tel:06546261234"
              className="p-3 rounded-full bg-paper border border-line text-accent hover:border-accent"
              title="Call Campus Security"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          <div className="p-4 bg-[#FDF2F2] border border-[#F8D7DA] rounded-card flex items-center justify-between">
            <div>
              <p className="text-xs text-emergency font-bold">National Emergency Helpline</p>
              <p className="text-lg font-heading font-bold text-emergency tabular-nums mt-0.5">
                112
              </p>
              <p className="text-xs text-emergency">Police, Ambulance, Fire</p>
            </div>
            <a
              href="tel:112"
              className="p-3 rounded-full bg-surface border border-[#F8D7DA] text-emergency hover:bg-[#FDF2F2]"
              title="Call 112"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* My Incident Tracking (FR-S5, FR-S7, FR-S11) */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-bold text-ink">
            {currentUser.role === "student" ? "My recent alerts" : "All campus safety alerts"}
          </h2>

          {myIncidents.length > 0 ? (
            <div className="space-y-4">
              {myIncidents.map((inc) => {
                const incTimeline = timeline.filter((t) => t.incident_id === inc.id);
                return (
                  <Card key={inc.id} className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">{inc.public_id}</span>
                        <StatusBadge status={inc.status} />
                        <span className="text-xs text-muted capitalize">
                          {inc.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="text-xs text-muted tabular-nums">
                        {new Date(inc.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted block">Location:</span>
                        <span className="font-semibold text-text">{inc.location_text}</span>
                      </div>
                      <div>
                        <span className="text-muted block">Assigned Responder:</span>
                        <span className="font-semibold text-text">
                          {inc.assigned_to_name || "Unassigned"}
                        </span>
                      </div>
                      {inc.description && (
                        <div className="md:col-span-2">
                          <span className="text-muted block">Details:</span>
                          <span className="text-text">{inc.description}</span>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="pt-2 border-t border-line">
                      <p className="text-xs font-heading font-semibold text-muted uppercase tracking-wider mb-2">
                        Status timeline
                      </p>
                      <Timeline items={incTimeline} />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center text-sm text-muted">
              No safety alerts on record.
            </Card>
          )}
        </div>

        {/* Non-Emergency Safety Reporting Form (FR-S9) */}
        <div className="pt-6 border-t border-line space-y-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-ink">
              Non-emergency safety report
            </h2>
            <p className="text-sm text-muted">
              Report campus maintenance safety hazards, broken pathway lights, or slippery floor areas.
            </p>
          </div>

          {submittedReport && (
            <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Report submitted. Campus safety maintenance has been informed.</span>
            </div>
          )}

          <Card className="p-6">
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <Input
                label="What is the concern?"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Broken streetlight on path between hostel and library"
                required
              />

              <Input
                label="Campus Location"
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
                placeholder="e.g. Near Gargi Hostel pathway gate"
              />

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Additional details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Describe the hazard in detail..."
                  rows={3}
                  className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Submit safety report</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <SOSFlowModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </AppShell>
  );
}
