"use client";

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Plus,
  Eye,
  CheckCircle,
  HelpCircle,
  Tag,
  Search,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/lib/database.types";

export default function NoticesPage() {
  const {
    notices,
    lostFound,
    currentUser,
    publishNotice,
    markNoticeAsRead,
    reportLostFound,
    resolveLostFound,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"notices" | "lost_found">("notices");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Publish Modal State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<Notice["category"]>("general");
  const [isUrgent, setIsUrgent] = useState(false);

  // Lost & Found Modal State
  const [lfModalOpen, setLfModalOpen] = useState(false);
  const [lfKind, setLfKind] = useState<"lost" | "found">("lost");
  const [lfItem, setLfItem] = useState("");
  const [lfDetails, setLfDetails] = useState("");
  const [lfLocation, setLfLocation] = useState("");

  const categories = [
    { key: "all", label: "All" },
    { key: "urgent", label: "Urgent" },
    { key: "exam", label: "Exams" },
    { key: "holiday", label: "Holidays" },
    { key: "workshop", label: "Workshops" },
    { key: "general", label: "General" },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === "all" || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeBody) return;

    publishNotice({
      title: noticeTitle,
      body: noticeBody,
      category: noticeCategory,
      is_urgent: isUrgent,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      status: "published",
    });

    setPublishModalOpen(false);
    setNoticeTitle("");
    setNoticeBody("");
    setIsUrgent(false);
  };

  const handleCreateLf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfItem) return;

    reportLostFound({
      reporter_id: currentUser.id,
      kind: lfKind,
      item: lfItem,
      details: lfDetails,
      location: lfLocation,
    });

    setLfModalOpen(false);
    setLfItem("");
    setLfDetails("");
    setLfLocation("");
  };

  const canPublish =
    currentUser.role === "admin" ||
    (currentUser.role === "faculty" && currentUser.can_publish_notices);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">Official Notices</h1>
            <p className="text-sm text-muted">
              Announcements, exams, holidays, workshops and lost-and-found items.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canPublish && (
              <Button onClick={() => setPublishModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Publish notice</span>
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                setActiveTab("lost_found");
                setLfModalOpen(true);
              }}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Report lost/found</span>
            </Button>
          </div>
        </div>

        {/* Top Segment Tabs */}
        <div className="flex items-center justify-between border-b border-line">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("notices")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "notices"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              Notice Feed ({notices.length})
            </button>
            <button
              onClick={() => setActiveTab("lost_found")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "lost_found"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              Lost and Found ({lostFound.length})
            </button>
          </div>

          <div className="hidden sm:block relative w-56 mb-2">
            <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-line rounded-input text-xs text-text focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {activeTab === "notices" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                    selectedCategory === c.key
                      ? "bg-ink text-surface border-ink"
                      : "bg-surface text-muted border-line hover:border-accent"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Notices List */}
            <div className="space-y-4">
              {filteredNotices.map((n) => (
                <Card
                  key={n.id}
                  onClick={() => markNoticeAsRead(n.id)}
                  className={`p-5 transition-colors ${
                    n.is_urgent ? "border-l-4 border-l-emergency" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-paper border border-line font-medium text-muted capitalize">
                        {n.category}
                      </span>
                      {n.is_urgent && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#FDF2F2] border border-[#F8D7DA] font-bold text-emergency flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted tabular-nums">
                      {new Date(n.published_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-ink mb-1.5">{n.title}</h3>
                  <p className="text-sm text-text leading-relaxed font-normal">{n.body}</p>

                  <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between text-xs text-muted">
                    <span>Published by: {n.author_name || "Administration"}</span>
                    {canPublish && (
                      <span className="flex items-center gap-1 text-accent font-medium">
                        <Eye className="w-3.5 h-3.5" /> Read by {n.read_rate || 75}% students
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "lost_found" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lostFound.map((item) => (
                <Card key={item.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border font-bold ${
                          item.kind === "lost"
                            ? "bg-[#FDF2F2] text-emergency border-[#F8D7DA]"
                            : "bg-[#EEF2FB] text-accent border-line"
                        }`}
                      >
                        {item.kind === "lost" ? "Lost item" : "Found item"}
                      </span>
                      <StatusBadge status={item.status === "open" ? "active" : "resolved"} />
                    </div>
                    <h3 className="text-base font-heading font-bold text-ink">{item.item}</h3>
                    {item.details && <p className="text-xs text-muted mt-1">{item.details}</p>}
                    {item.location && (
                      <p className="text-xs text-text mt-2 font-medium">
                        Location: {item.location}
                      </p>
                    )}
                  </div>

                  {item.status === "open" && (
                    <div className="mt-4 pt-3 border-t border-line flex justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => resolveLostFound(item.id)}
                      >
                        Mark claimed / resolved
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Publish Notice Modal (FR-N6) */}
        <Modal
          isOpen={publishModalOpen}
          onClose={() => setPublishModalOpen(false)}
          title="Publish Official Notice"
        >
          <form onSubmit={handlePublish} className="space-y-4">
            <Input
              label="Title"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g. Schedule for University Annual Convocation"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Category</label>
              <select
                value={noticeCategory}
                onChange={(e) => setNoticeCategory(e.target.value as Notice["category"])}
                className="w-full min-h-[44px] p-2 bg-surface border border-line rounded-input text-sm text-text"
              >
                <option value="general">General</option>
                <option value="exam">Exams</option>
                <option value="holiday">Holidays</option>
                <option value="workshop">Workshops</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Notice content</label>
              <textarea
                value={noticeBody}
                onChange={(e) => setNoticeBody(e.target.value)}
                rows={4}
                placeholder="Write the full notice text clearly..."
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isUrgentCheck"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-accent"
              />
              <label htmlFor="isUrgentCheck" className="text-sm font-semibold text-emergency">
                Mark as urgent notice (pins to top and notifies students)
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPublishModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Publish notice</Button>
            </div>
          </form>
        </Modal>

        {/* Report Lost/Found Modal (FR-N7) */}
        <Modal
          isOpen={lfModalOpen}
          onClose={() => setLfModalOpen(false)}
          title="Report Lost or Found Item"
        >
          <form onSubmit={handleCreateLf} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLfKind("lost")}
                  className={`p-2.5 rounded border text-xs font-semibold ${
                    lfKind === "lost"
                      ? "bg-[#FDF2F2] border-[#F8D7DA] text-emergency"
                      : "bg-surface border-line text-text"
                  }`}
                >
                  I lost something
                </button>
                <button
                  type="button"
                  onClick={() => setLfKind("found")}
                  className={`p-2.5 rounded border text-xs font-semibold ${
                    lfKind === "found"
                      ? "bg-[#EEF2FB] border-accent text-accent"
                      : "bg-surface border-line text-text"
                  }`}
                >
                  I found something
                </button>
              </div>
            </div>

            <Input
              label="Item name"
              value={lfItem}
              onChange={(e) => setLfItem(e.target.value)}
              placeholder="e.g. Scientific Calculator Casio fx-991EX"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Details</label>
              <textarea
                value={lfDetails}
                onChange={(e) => setLfDetails(e.target.value)}
                placeholder="Colour, distinctive marks, or brand..."
                rows={2}
                className="w-full p-2.5 bg-surface border border-line rounded-input text-sm text-text focus:outline-none focus:border-accent"
              />
            </div>

            <Input
              label="Location"
              value={lfLocation}
              onChange={(e) => setLfLocation(e.target.value)}
              placeholder="e.g. Near Library front desk"
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setLfModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit report</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
