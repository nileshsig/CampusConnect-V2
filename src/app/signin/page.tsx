"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, UserCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_PROFILES } from "@/lib/mock-data";
import { UserRole } from "@/lib/database.types";

export default function SignInPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your university email address.");
      return;
    }

    const matched = INITIAL_PROFILES.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setCurrentUser(matched);
      if (matched.role === "admin") router.push("/admin");
      else if (matched.role === "security") router.push("/security");
      else if (matched.role === "faculty") router.push("/faculty");
      else router.push("/student");
    } else {
      // Allow custom email demo fallback
      const studentProfile = {
        ...INITIAL_PROFILES[0],
        email,
        full_name: email.split("@")[0].replace(/\./g, " "),
      };
      setCurrentUser(studentProfile);
      router.push("/student");
    }
  };

  const handleQuickDemoSelect = (role: UserRole) => {
    const profile = INITIAL_PROFILES.find((p) => p.role === role) || INITIAL_PROFILES[0];
    setCurrentUser(profile);
    if (role === "admin") router.push("/admin");
    else if (role === "security") router.push("/security");
    else if (role === "faculty") router.push("/faculty");
    else router.push("/student");
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-block">
          <span className="font-heading font-extrabold text-2xl text-ink tracking-tight">
            Campus Connect
          </span>
        </Link>
        <h2 className="mt-2 text-xl font-heading font-bold text-ink">
          Sign in with university email
        </h2>
        <p className="mt-1 text-xs text-muted">
          Vinoba Bhave University, Hazaribagh student and staff portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 border border-line rounded-card shadow-none space-y-6">
          {error && (
            <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] rounded text-xs text-emergency">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="University email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. asha@vbu.ac.in"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          {/* Quick Demo Switcher (FR-X10) */}
          <div className="pt-4 border-t border-line">
            <p className="text-xs font-heading font-bold text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-accent" />
              <span>One-click Demo Accounts</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoSelect("student")}
                className="p-2.5 text-left border border-line rounded bg-paper hover:bg-[#EEF2FB] hover:border-accent transition-colors"
              >
                <span className="block text-xs font-bold text-ink">Asha Kumari</span>
                <span className="block text-[11px] text-muted">Student (B.Tech CSE)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect("faculty")}
                className="p-2.5 text-left border border-line rounded bg-paper hover:bg-[#EEF2FB] hover:border-accent transition-colors"
              >
                <span className="block text-xs font-bold text-ink">Dr. S. Prasad</span>
                <span className="block text-[11px] text-muted">Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect("security")}
                className="p-2.5 text-left border border-line rounded bg-paper hover:bg-[#EEF2FB] hover:border-accent transition-colors"
              >
                <span className="block text-xs font-bold text-ink">Officer Singh</span>
                <span className="block text-[11px] text-muted">Security Officer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSelect("admin")}
                className="p-2.5 text-left border border-line rounded bg-paper hover:bg-[#EEF2FB] hover:border-accent transition-colors"
              >
                <span className="block text-xs font-bold text-ink">Registrar Admin</span>
                <span className="block text-[11px] text-muted">Administration</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
