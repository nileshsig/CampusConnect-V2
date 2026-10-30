"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function SecurityResponderPage() {
  const { incidents, acknowledgeAlert, updateAlertStatus, addAlertNote, notes, currentUser } =
    useApp();
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const pendingAlerts = incidents.filter((i) => i.status !== "closed");

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
  };

  const handleResolve = (id: string) => {
    updateAlertStatus(id, "resolved", "Resolved on site by Designated Responder.");
  };

  const handleAddNote = (id: string) => {
    if (!noteText.trim()) return;
    addAlertNote(id, noteText.trim());
    setNoteText("");
    setActiveAlertId(null);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <h1 className="text-xl font-heading font-bold text-ink">
                Campus Safety & Incident Console
              </h1>
            </div>
            <p className="text-xs text-muted mt-1">
              Logged in: {currentUser.full_name} • Live Dispatch Queue
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded bg-paper border border-line font-mono font-bold tabular-nums">
              Active Alerts: {pendingAlerts.length}
            </span>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-sm font-heading font-bold text-ink uppercase tracking-wider">
            Queue of active alerts
          </h2>

          {pendingAlerts.length > 0 ? (
            pendingAlerts.map((inc) => {
              const alertNotes = notes.filter((n) => n.incident_id === inc.id);
              const isAcknowledged = inc.status === "acknowledged" || inc.status === "in_progress";

              return (
                <Card key={inc.id} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink">{inc.public_id}</span>
                      <StatusBadge status={inc.status} />
                      <span className="text-xs font-bold capitalize text-emergency">
                        {inc.category.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-xs text-muted tabular-nums">
                      {new Date(inc.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-ink">Location: </strong>
                        <span className="text-text font-semibold">{inc.location_text}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted">
                      <span>Reporter: </span>
                      <strong className="text-text">{inc.reporter_name}</strong>
                    </div>

                    {inc.description && (
                      <p className="text-xs text-text bg-paper p-2.5 rounded border border-line">
                        {inc.description}
                      </p>
                    )}
                  </div>

                  {/* Notes entered by responder */}
                  {alertNotes.length > 0 && (
                    <div className="p-3 bg-paper rounded border border-line space-y-1.5 text-xs">
                      <span className="font-semibold text-ink block">Responder Notes:</span>
                      {alertNotes.map((n) => (
                        <p key={n.id} className="text-muted">
                          • {n.note} <span className="text-[10px]">({n.author_name})</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveAlertId(inc.id)}
                      className="gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Add note</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      {!isAcknowledged && (
                        <Button
                          size="sm"
                          onClick={() => handleAcknowledge(inc.id)}
                          className="gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Acknowledge</span>
                        </Button>
                      )}

                      {isAcknowledged && inc.status !== "resolved" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResolve(inc.id)}
                        >
                          Mark resolved
                        </Button>
                      )}

                      {inc.status === "resolved" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateAlertStatus(inc.id, "closed")}
                        >
                          Close alert
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-8 text-center text-sm text-muted">
              All safety alerts resolved and closed.
            </Card>
          )}
        </div>

        {/* Modal for adding responder note */}
        <Modal
          isOpen={activeAlertId !== null}
          onClose={() => setActiveAlertId(null)}
          title="Add Responder Note"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Note description
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="e.g. Attending at location with medical support..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setActiveAlertId(null)}>
                Cancel
              </Button>
              <Button onClick={() => activeAlertId && handleAddNote(activeAlertId)}>
                Save note
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
