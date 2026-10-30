"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  MapPin,
  CheckCircle,
  Phone,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { IncidentCategory, Incident } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";

export function SOSFlowModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createSOSAlert, timeline, incidents, activeIncident } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory] = useState<IncidentCategory>("medical");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationConsented, setLocationConsented] = useState(false);
  const [locating, setLocating] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);

  if (!isOpen) return null;

  const categories: { key: IncidentCategory; label: string }[] = [
    { key: "medical", label: "Medical emergency" },
    { key: "personal_safety", label: "Personal safety" },
    { key: "harassment", label: "Harassment" },
    { key: "accident", label: "Accident" },
    { key: "security_issue", label: "Security issue" },
    { key: "other", label: "Other" },
  ];

  const handleShareLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      setLocationText("Science Block, Gate 2 (Location service unavailable)");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationConsented(true);
        setLocationText(`Campus coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setLocationConsented(false);
        setLocating(false);
        setLocationText("Central Quadrangle near Admin Block");
      },
      { timeout: 8000 }
    );
  };

  const handleSendAlert = async () => {
    setRateLimitError("");
    const res = await createSOSAlert({
      category,
      description,
      locationText: locationText || "Central Campus Gate",
      lat,
      lng,
      locationConsented,
    });

    if (res.success && res.incident) {
      setCurrentIncident(res.incident);
      setStep(4);
    } else if (res.error) {
      setRateLimitError(res.error);
    }
  };

  const displayedIncident: Incident | null =
    currentIncident || activeIncident || (incidents.length > 0 ? incidents[0] : null);

  const incidentTimeline = displayedIncident
    ? timeline.filter((t) => t.incident_id === displayedIncident.id)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <div
        className="relative w-full max-w-lg bg-surface border border-line rounded-modal shadow-modal p-6 max-h-[95vh] overflow-y-auto"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emergency" />
            <h2 className="font-heading font-bold text-lg text-ink">
              {step === 1 && "What happened?"}
              {step === 2 && "Where are you?"}
              {step === 3 && "Check and send"}
              {step === 4 && "Alert status"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-text hover:bg-paper"
            aria-label="Close alert dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {rateLimitError && (
          <div className="mb-4 p-3 bg-[#FDF2F2] border border-[#F8D7DA] rounded text-xs text-emergency font-medium">
            {rateLimitError}
          </div>
        )}

        {/* STEP 1: What happened? */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Choose the category that matches your emergency. Help will be notified straight away.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`min-h-[50px] p-3 text-left rounded-card border font-medium text-sm transition-colors ${
                    category === c.key
                      ? "bg-[#EEF2FB] border-accent text-accent font-semibold"
                      : "bg-surface border-line text-text hover:bg-paper"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-text mb-1">
                Short note (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief description of the situation..."
                rows={2}
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setStep(2)} className="gap-2">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Where are you? */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Share your location so security officers can reach you fast without delay.
            </p>

            <button
              type="button"
              onClick={handleShareLocation}
              disabled={locating}
              className="w-full py-3.5 px-4 bg-paper border border-line rounded-card flex items-center justify-center gap-2 text-ink font-semibold hover:border-accent hover:bg-[#EEF2FB] transition-colors"
            >
              <MapPin className="w-5 h-5 text-accent" />
              <span>{locating ? "Getting your location..." : "Share my location"}</span>
            </button>

            {locationConsented && (
              <p className="text-xs text-accent font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Your location was captured with permission.
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Or type your building, room or gate
              </label>
              <Input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Science Block, 2nd Floor, Room 204 or Main Gate 1"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <Button variant="secondary" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button onClick={() => setStep(3)} className="gap-1.5">
                <span>Check details</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Check and send */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-paper border border-line rounded-card space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Category:</span>
                <span className="font-semibold text-ink">
                  {categories.find((c) => c.key === category)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Location:</span>
                <span className="font-semibold text-ink text-right max-w-[240px]">
                  {locationText || "Entered location"}
                </span>
              </div>
              {description && (
                <div className="pt-2 border-t border-line text-xs text-text">
                  <strong>Note:</strong> {description}
                </div>
              )}
            </div>

            <div className="p-3 bg-[#EEF2FB] border border-line rounded text-xs text-text">
              <strong>Who will see this:</strong> Campus security on duty, hostel warden/advisor, and the registrar administration.
            </div>

            <div className="pt-3 flex items-center justify-between gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSendAlert} className="gap-2 flex-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Send alert</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Alert status */}
        {step === 4 && displayedIncident && (
          <div className="space-y-5">
            <div className="p-4 bg-paper border border-line rounded-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Reference number</span>
                <span className="font-mono text-xs font-bold text-ink">
                  {displayedIncident.public_id}
                </span>
              </div>

              {/* Exact status copy from Section 6.5 */}
              <div className="my-3">
                {displayedIncident.delivery === "saved" && (
                  <p className="text-sm font-semibold text-muted">
                    Alert saved. Sending it to security now.
                  </p>
                )}
                {displayedIncident.delivery === "queued" && (
                  <p className="text-sm font-semibold text-muted">
                    Not sent yet. We keep trying. If it's urgent, call now.
                  </p>
                )}
                {displayedIncident.delivery === "delivered" && (
                  <p className="text-sm font-semibold text-accent">
                    Security received your alert at {new Date(displayedIncident.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
                  </p>
                )}
                {displayedIncident.status === "acknowledged" && (
                  <p className="text-sm font-semibold text-accent">
                    Officer Singh has seen your alert and is on the way.
                  </p>
                )}
                {displayedIncident.delivery === "failed" && (
                  <p className="text-sm font-semibold text-emergency">
                    Your alert did not go through. Call campus security now.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={displayedIncident.status} />
                <span className="text-xs text-muted">
                  Category: {categories.find((c) => c.key === displayedIncident.category)?.label}
                </span>
              </div>
            </div>

            {/* Updates timeline */}
            <div>
              <h4 className="text-xs font-heading font-semibold text-ink uppercase tracking-wider mb-3">
                Activity Record
              </h4>
              <Timeline items={incidentTimeline} />
            </div>

            {/* Always visible fallback helpline phone calls (FR-S13 & Section 6.5) */}
            <div className="pt-3 border-t border-line space-y-2">
              <p className="text-xs text-muted">
                Need immediate response or network is weak? Use these helplines directly:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:06546261234"
                  className="p-2.5 bg-surface border border-line rounded-button flex items-center justify-center gap-2 text-xs font-semibold text-ink hover:bg-paper transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Call campus security</span>
                </a>
                <a
                  href="tel:112"
                  className="p-2.5 bg-[#FDF2F2] border border-[#F8D7DA] rounded-button flex items-center justify-center gap-2 text-xs font-semibold text-emergency hover:bg-opacity-80 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emergency" />
                  <span>Call emergency 112</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
