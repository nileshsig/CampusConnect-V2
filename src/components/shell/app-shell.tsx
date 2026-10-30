"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Calendar,
  Bell,
  Sparkles,
  Users,
  MessageSquare,
  BarChart2,
  FileText,
  User,
  Phone,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { UserRole } from "@/lib/database.types";
import { SOSFlowModal } from "@/components/safety/sos-flow-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, switchRole, language, setLanguage, notifications } = useApp();
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read_at).length;

  const getNavLinks = (role: UserRole) => {
    switch (role) {
      case "student":
        return [
          { href: "/student", label: "Home", icon: User },
          { href: "/today", label: "Today", icon: Calendar },
          { href: "/notices", label: "Notices", icon: Bell },
          { href: "/events", label: "Events", icon: Sparkles },
          { href: "/clubs", label: "Clubs", icon: Users },
          { href: "/messages", label: "Messages", icon: MessageSquare },
          { href: "/safety", label: "Safety", icon: ShieldAlert },
        ];
      case "faculty":
        return [
          { href: "/faculty", label: "Home", icon: User },
          { href: "/today", label: "My classes", icon: Calendar },
          { href: "/notices", label: "Notices", icon: Bell },
          { href: "/messages", label: "Messages", icon: MessageSquare },
          { href: "/safety", label: "Safety", icon: ShieldAlert },
        ];
      case "security":
        return [
          { href: "/security", label: "Alerts queue", icon: ShieldAlert },
          { href: "/notices", label: "Notices", icon: Bell },
          { href: "/messages", label: "Messages", icon: MessageSquare },
          { href: "/safety", label: "Safety", icon: ShieldAlert },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Overview", icon: BarChart2 },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/notices", label: "Notices", icon: Bell },
          { href: "/events", label: "Events", icon: Sparkles },
          { href: "/clubs", label: "Clubs", icon: Users },
          { href: "/admin/reports", label: "Reports to review", icon: AlertTriangle },
          { href: "/admin/activity", label: "Activity record", icon: FileText },
          { href: "/safety", label: "Safety alerts", icon: ShieldAlert },
        ];
    }
  };

  const navLinks = getNavLinks(currentUser.role);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-text">
      {/* Pilot Warning Top Banner (FR-S13 & Pilot Notice requirement) */}
      <div className="bg-ink text-surface text-xs py-2 px-4 border-b border-line flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-2xl">
          <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
          <span>
            <strong>Campus Connect Pilot:</strong> Until the university formally adopts this app, also call campus security helpline in an emergency.
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold tabular-nums">
          <a href="tel:06546261234" className="hover:underline flex items-center gap-1 text-surface">
            <Phone className="w-3.5 h-3.5" /> Security: 06546-261234
          </a>
          <a href="tel:112" className="hover:underline text-surface font-bold">
            Emergency: 112
          </a>
        </div>
      </div>

      {/* Demo Switcher & Global Header */}
      <header className="bg-surface border-b border-line sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-heading font-extrabold text-lg text-ink tracking-tight">
              Campus Connect
            </Link>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded bg-paper border border-line text-muted">
              Vinoba Bhave University
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="text-xs px-2.5 py-1.5 rounded border border-line bg-paper text-text font-medium hover:border-accent"
              title="Toggle language"
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>

            {/* Role switcher for presentation (FR-X10) */}
            <div className="flex items-center gap-1.5 bg-paper p-1 rounded-input border border-line">
              <span className="text-xs text-muted font-medium pl-1 hidden md:inline">Account:</span>
              {(["student", "faculty", "security", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                    currentUser.role === r
                      ? "bg-ink text-surface shadow-none"
                      : "text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  {r === "student" && "Asha (Student)"}
                  {r === "faculty" && "Dr. Prasad (Faculty)"}
                  {r === "security" && "Officer Singh"}
                  {r === "admin" && "Admin"}
                </button>
              ))}
            </div>

            {/* SOS Primary Button in Header */}
            <button
              onClick={() => setSosModalOpen(true)}
              className="bg-emergency text-surface font-semibold text-xs px-3.5 py-2 rounded-button flex items-center gap-1.5 hover:bg-opacity-90 active:bg-opacity-80 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Send alert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar on Desktop */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (Fixed 240px width on desktop) */}
        <aside className="hidden md:block w-60 border-r border-line bg-surface p-4 shrink-0">
          <div className="p-3 mb-4 rounded-card border border-line bg-paper">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="text-sm font-semibold text-ink truncate">{currentUser.full_name}</p>
            <p className="text-xs text-muted capitalize">{currentUser.role}</p>
          </div>

          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-button text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EEF2FB] text-accent border border-line"
                      : "text-text hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.href === "/notices" && unreadNotifs > 0 && (
                    <span className="text-xs bg-accent text-surface px-1.5 py-0.5 rounded-full font-bold tabular-nums">
                      {unreadNotifs}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0 pb-20 md:pb-8">{children}</main>
      </div>

      {/* Mobile Floating SOS Button (FR-S1) */}
      <div className="md:hidden fixed bottom-16 right-4 z-40">
        <button
          onClick={() => setSosModalOpen(true)}
          className="bg-emergency text-surface shadow-modal font-bold text-sm px-5 py-3 rounded-full flex items-center gap-2 active:scale-95 transition-transform"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>Send alert</span>
        </button>
      </div>

      {/* Mobile Bottom Tab Navigation (FR-S1 & Section 6.7) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-line flex items-center justify-around z-30 px-2">
        {navLinks.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 text-[11px] font-medium min-w-[50px] ${
                isActive ? "text-accent font-semibold" : "text-muted"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* SOS Multi-step Flow Dialog Modal (Section 6.5) */}
      <SOSFlowModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </div>
  );
}
