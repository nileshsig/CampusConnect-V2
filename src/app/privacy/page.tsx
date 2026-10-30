"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  const [locationConsent, setLocationConsent] = useState(true);
  const [alertInboxConsent, setAlertInboxConsent] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-paper text-text py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl font-heading font-bold text-ink mt-3">
          Privacy and Consent Policy
        </h1>
        <p className="text-sm text-muted mt-1">
          Vinoba Bhave University, Hazaribagh student privacy commitments and data retention settings.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-bold text-ink">
            How your location is handled
          </h2>
          <p className="text-sm text-text leading-relaxed">
            Your location is requested strictly only during emergency alert creation. The application never tracks, logs, or stores your background location during normal day-to-day browsing.
          </p>
          <div className="p-3 bg-paper border border-line rounded text-xs text-muted">
            Students always have the option to deny location permission and type their building, room, or campus gate manually.
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-bold text-ink">
            Preferences and data retention
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={locationConsent}
                onChange={(e) => setLocationConsent(e.target.checked)}
                className="w-4 h-4 rounded text-accent mt-1"
              />
              <div>
                <span className="text-sm font-semibold text-ink block">
                  Allow browser prompt for location during emergencies
                </span>
                <span className="text-xs text-muted">
                  Enables one-tap location attachment so security responders can find you quickly.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alertInboxConsent}
                onChange={(e) => setAlertInboxConsent(e.target.checked)}
                className="w-4 h-4 rounded text-accent mt-1"
              />
              <div>
                <span className="text-sm font-semibold text-ink block">
                  Receive urgent notices in message inbox
                </span>
                <span className="text-xs text-muted">
                  Notifies you of campus weather closures, security advisories, and exam schedule revisions.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-semibold text-accent flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved
              </span>
            ) : (
              <span className="text-xs text-muted">Updates take effect straight away</span>
            )}
            <Button onClick={handleSave}>Save preferences</Button>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-heading font-bold text-ink">Accountability and Records</h2>
          <p className="text-sm text-text leading-relaxed">
            Every status update, responder acknowledgement, and official notice is permanently written to an immutable activity record. No administrative actions can be erased or tampered with.
          </p>
        </Card>
      </div>
    </div>
  );
}
