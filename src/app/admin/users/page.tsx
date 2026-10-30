"use client";

import React, { useState } from "react";
import { Users, Upload, CheckCircle, Shield } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_PROFILES } from "@/lib/mock-data";
import { Profile, UserRole } from "@/lib/database.types";

export default function UsersAdminPage() {
  const [usersList, setUsersList] = useState<Profile[]>(INITIAL_PROFILES);
  const [search, setSearch] = useState("");
  const [spreadsheetNotice, setSpreadsheetNotice] = useState(false);

  const filtered = usersList.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSpreadsheetNotice(true);
      setTimeout(() => setSpreadsheetNotice(false), 4000);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-line rounded-card">
          <div>
            <h1 className="text-xl font-heading font-bold text-ink">Students and Staff</h1>
            <p className="text-xs text-muted mt-0.5">
              Manage accounts, verify university departments, and adjust permissions.
            </p>
          </div>

          <label className="cursor-pointer bg-paper border border-line hover:border-accent px-4 py-2 rounded-button text-xs font-semibold text-ink flex items-center gap-2 self-start sm:self-auto min-h-[44px]">
            <Upload className="w-4 h-4 text-accent" />
            <span>Upload a spreadsheet</span>
            <input type="file" accept=".csv" onChange={handleCsv} className="hidden" />
          </label>
        </div>

        {spreadsheetNotice && (
          <div className="p-4 bg-[#F0F5EE] border border-line rounded-card flex items-center gap-2 text-xs font-semibold text-ink">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>Spreadsheet parsed: New batch of student roll numbers imported.</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search student or staff by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <span className="text-xs text-muted tabular-nums">{filtered.length} accounts found</span>
        </div>

        <div className="bg-surface border border-line rounded-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper border-b border-line text-muted uppercase font-heading">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Account type</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5 text-right">Update role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-paper">
                  <td className="p-3.5 font-semibold text-ink">{user.full_name}</td>
                  <td className="p-3.5 text-muted">{user.email}</td>
                  <td className="p-3.5 capitalize font-medium text-text">{user.role}</td>
                  <td className="p-3.5 text-muted">
                    {user.roll_no || user.phone || "Faculty / Staff"}
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="p-1.5 bg-surface border border-line rounded text-xs text-text focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="security">Security</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
