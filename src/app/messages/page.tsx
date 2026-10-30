"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  ShieldAlert,
  Slash,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { AppShell } from "@/components/shell/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessagesPage() {
  const { threads, messages, currentUser, sendMessage, blockPerson } = useApp();
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || "");
  const [inputText, setInputText] = useState("");
  const [reported, setReported] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const threadMessages = messages.filter((m) => m.thread_id === activeThreadId && !m.hidden);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;

    sendMessage(activeThreadId, inputText.trim());
    setInputText("");
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Messages</h1>
          <p className="text-sm text-muted">
            Direct communication with your course faculty, advisors and society leads.
          </p>
        </div>

        <div className="bg-surface border border-line rounded-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          {/* Threads list */}
          <div className="md:col-span-5 border-r border-line p-3 space-y-1">
            <h2 className="text-xs font-heading font-bold text-muted uppercase tracking-wider px-3 py-2">
              Conversations
            </h2>
            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-card cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#EEF2FB] border border-line"
                      : "hover:bg-paper border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink truncate">{thread.title}</p>
                    <span className="text-[11px] text-muted capitalize">{thread.kind}</span>
                  </div>
                  <p className="text-xs text-muted truncate mt-1">{thread.last_message}</p>
                </div>
              );
            })}
          </div>

          {/* Active Chat Conversation */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {/* Chat Header with Block / Report (FR-M3) */}
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper">
              <div>
                <h3 className="text-sm font-heading font-bold text-ink">{activeThread?.title}</h3>
                <span className="text-xs text-muted">Official University Channel</span>
              </div>

              <div className="flex items-center gap-2">
                {reported && (
                  <span className="text-xs text-emergency font-semibold">Reported for review</span>
                )}
                <button
                  onClick={handleReport}
                  className="text-xs px-2.5 py-1 rounded border border-line bg-surface text-muted hover:text-emergency hover:border-emergency"
                  title="Report inappropriate message to university administration"
                >
                  Report
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
              {threadMessages.map((msg) => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[11px] text-muted mb-0.5 px-1">{msg.sender_name}</span>
                    <div
                      className={`max-w-xs md:max-w-sm p-3 rounded-card text-sm leading-relaxed ${
                        isMe
                          ? "bg-ink text-surface rounded-br-none"
                          : "bg-paper text-text border border-line rounded-bl-none"
                      }`}
                    >
                      {msg.body}
                    </div>
                    <span className="text-[10px] text-muted mt-0.5 px-1 tabular-nums">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-line flex gap-2 bg-surface">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="md" className="gap-1.5 shrink-0">
                <Send className="w-4 h-4" />
                <span>Send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
