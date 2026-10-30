"use client";

import React, { useState } from "react";
import {
  FolderOpen,
  FileText,
  Download,
  Search,
  BookOpen,
  Briefcase,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampusDocument } from "@/lib/database.types";

export default function DocumentsPage() {
  const { campusDocuments } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = [
    { key: "all", label: "All documents" },
    { key: "placement", label: "Placement data" },
    { key: "study_material", label: "Study materials" },
    { key: "regulations", label: "Rules & regulations" },
    { key: "forms", label: "Forms & applications" },
  ];

  const filteredDocs = campusDocuments.filter((doc) => {
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase()) ||
      doc.uploaded_by.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: CampusDocument) => {
    const content = `Vinoba Bhave University, Hazaribagh
Official Document: ${doc.title}
Category: ${doc.category}
Uploaded by: ${doc.uploaded_by}
Date: ${doc.updated_at}

Description:
${doc.description}

(This is an authentic verified university digital copy)`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(doc.title);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const getCategoryIcon = (cat: CampusDocument["category"]) => {
    switch (cat) {
      case "placement":
        return Briefcase;
      case "study_material":
        return BookOpen;
      case "regulations":
        return ShieldAlert;
      case "forms":
        return FileCheck;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            University Documents Repository
          </h1>
          <p className="text-sm text-muted">
            Official placement reports, departmental lecture notes, academic statutes, and application forms.
          </p>
        </div>

        {downloadNotice && (
          <div className="p-3 bg-[#F0F5EE] border border-line rounded text-xs font-semibold text-ink">
            Downloaded "{downloadNotice}".
          </div>
        )}

        {/* Search & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search documents by title, subject, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  selectedCategory === c.key
                    ? "bg-ink text-surface border-ink"
                    : "bg-surface text-muted border-line hover:border-accent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Cards List */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const Icon = getCategoryIcon(doc.category);
            return (
              <Card key={doc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-3 bg-paper border border-line rounded text-accent shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-paper border border-line text-muted">
                        {doc.file_format} • {doc.file_size}
                      </span>
                      <span className="text-xs text-muted">
                        Updated {doc.updated_at}
                      </span>
                    </div>

                    <h3 className="text-base font-heading font-bold text-ink">{doc.title}</h3>
                    <p className="text-xs text-muted leading-relaxed max-w-2xl">{doc.description}</p>
                    <p className="text-[11px] text-text font-medium pt-1">
                      Source: {doc.uploaded_by}
                    </p>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(doc)}
                    className="gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
