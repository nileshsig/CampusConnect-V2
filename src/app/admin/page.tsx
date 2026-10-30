"use client";

import React, { useState } from "react";
import {
  BarChart2,
  Users,
  ShieldAlert,
  Bell,
  Sparkles,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { INITIAL_PROFILES } from "@/lib/mock-data";

export default function AdminPage() {
  const { incidents, notices, events, clubs, assignResponder } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState("user-officer-singh");
  const [spreadsheetUploaded, setSpreadsheetUploaded] = useState(false);

  // Recharts metric data
  const incidentChartData = [
    { day: "Mon", alerts: 3, resolved: 3 },
    { day: "Tue", alerts: 5, resolved: 4 },
    { day: "Wed", alerts: 2, resolved: 2 },
    { day: "Thu", alerts: 6, resolved: 5 },
    { day: "Fri", alerts: 4, resolved: 4 },
    { day: "Sat", alerts: 1, resolved: 1 },
    { day: "Sun", alerts: 2, resolved: 2 },
  ];

  const noticeReadRateData = [
    { name: "Rain Warning", rate: 89 },
    { name: "Mid-Term Seating", rate: 74 },
    { name: "Diwali Holidays", rate: 95 },
    { name: "Embedded Workshop", rate: 61 },
  ];

  const handleAssign = () => {
    if (selectedIncidentId) {
      assignResponder(selectedIncidentId, assigneeId);
      setSelectedIncidentId(null);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSpreadsheetUploaded(true);
      setTimeout(() => setSpreadsheetUploaded(false), 4000);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <h1 className="text-xl font-heading font-bold text-ink">
              University Administration Overview
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Registrar Office Oversight • Safety, Notices, Events & System Metrics
            </p>
          </div>

          <label className="cursor-pointer bg-paper border border-line hover:border-accent px-4 py-2 rounded-button text-xs font-semibold text-ink flex items-center gap-2 self-start sm:self-auto min-h-[44px]">
            <Upload className="w-4 h-4 text-accent" />
            <span>Upload a spreadsheet</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>

        {spreadsheetUploaded && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>Student spreadsheet processed successfully. 48 student accounts updated.</span>
          </div>
        )}

        {/* Top Metric Numbers Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total students" value="3,420" sublabel="Enrolled in 2026 academic year" />
          <StatCard
            label="Active safety alerts"
            value={incidents.filter((i) => i.status !== "closed").length}
            sublabel="Under response"
          />
          <StatCard
            label="Notices published"
            value={notices.length}
            sublabel="Across all departments"
          />
          <StatCard
            label="Average response time"
            value="2.4 min"
            sublabel="Target: under 3 minutes"
          />
        </div>

        {/* Charts & Numbers Section (Recharts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-ink">
                Incident Volume & Resolution (This Week)
              </h2>
              <span className="text-xs text-muted">Weekly trend</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#5A6574" fontSize={12} />
                  <YAxis stroke="#5A6574" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E1E5EB",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="alerts" fill="#152A4E" name="Alerts raised" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#2A56C6" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-ink">
                Notice Read Rate (% of enrolled students)
              </h2>
              <span className="text-xs text-muted">Last 4 notices</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={noticeReadRateData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#5A6574" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#5A6574" fontSize={11} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E1E5EB",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="rate" fill="#2A56C6" name="Read rate %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Safety Incidents Oversight Table (FR-S8) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-ink">
              Safety Alerts Oversight & Responder Assignment
            </h2>
            <span className="text-xs text-muted">Admin live oversight</span>
          </div>

          <div className="bg-surface border border-line rounded-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-line text-muted uppercase font-heading">
                <tr>
                  <th className="p-3.5">Reference ID</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Reporter</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Responder</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-paper">
                    <td className="p-3.5 font-mono font-bold text-ink">{inc.public_id}</td>
                    <td className="p-3.5 font-medium capitalize text-text">
                      {inc.category.replace(/_/g, " ")}
                    </td>
                    <td className="p-3.5 text-text">{inc.reporter_name}</td>
                    <td className="p-3.5 text-muted max-w-[200px] truncate">{inc.location_text}</td>
                    <td className="p-3.5">
                      <StatusBadge status={inc.status} />
                    </td>
                    <td className="p-3.5 font-medium text-text">
                      {inc.assigned_to_name || "Unassigned"}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedIncidentId(inc.id)}
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Responder Modal */}
        <Modal
          isOpen={selectedIncidentId !== null}
          onClose={() => setSelectedIncidentId(null)}
          title="Assign Security Responder"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted">
              Select an on-duty security officer or resident advisor to take ownership of this alert.
            </p>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Security Responder
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="user-officer-singh">Officer Vikram Singh (Gate 1 Post)</option>
                <option value="user-admin">Registrar Duty Officer</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setSelectedIncidentId(null)}>
                Cancel
              </Button>
              <Button onClick={handleAssign}>Assign responder</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
