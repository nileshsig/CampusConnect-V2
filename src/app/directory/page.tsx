"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  Building,
  User,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DirectoryPage() {
  const { facultyContacts } = useApp();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const departments = [
    { key: "all", label: "All departments" },
    { key: "Computer Science", label: "Computer Science" },
    { key: "Physics", label: "Physics & Admin" },
    { key: "Chemistry", label: "Chemistry" },
    { key: "Student Welfare", label: "Counseling & Welfare" },
    { key: "Training and Placement", label: "Placements Cell" },
  ];

  const filteredContacts = facultyContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.designation.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDept =
      selectedDept === "all" || c.department.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesDept;
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Faculty and Staff Directory
          </h1>
          <p className="text-sm text-muted">
            Find verified phone numbers, email addresses, office locations, and consultation hours for professors and university officers.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by faculty name, subject, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-2 bg-surface border border-line rounded-input text-xs font-semibold text-text min-h-[44px]"
          >
            {departments.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((fac) => (
              <Card key={fac.id} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-heading font-bold text-ink">{fac.name}</h3>
                      <p className="text-xs font-medium text-accent">{fac.designation}</p>
                      <p className="text-xs text-muted mt-0.5">{fac.department}</p>
                    </div>
                    <span className="p-2 rounded bg-paper border border-line text-ink">
                      <User className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs border-t border-line pt-3">
                    <div className="flex items-center gap-2 text-text">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{fac.room_number}</span>
                    </div>

                    <div className="flex items-center gap-2 text-text">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>Office hours: {fac.office_hours}</span>
                    </div>

                    {fac.subjects.length > 0 && (
                      <div className="flex items-start gap-2 text-muted">
                        <BookOpen className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>Subjects: {fac.subjects.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                  <a
                    href={`tel:${fac.phone.replace(/[^0-9+]/g, "")}`}
                    className="flex-1 py-2 px-3 rounded border border-line bg-paper hover:bg-[#EEF2FB] hover:border-accent text-xs font-semibold text-ink flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>{fac.phone}</span>
                  </a>

                  <a
                    href={`mailto:${fac.email}`}
                    className="py-2 px-3 rounded border border-line bg-paper hover:bg-[#EEF2FB] hover:border-accent text-xs font-semibold text-ink flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>Email</span>
                  </a>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-sm text-muted bg-surface border border-line rounded-card">
              No faculty contacts found matching your search.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
