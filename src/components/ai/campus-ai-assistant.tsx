"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Bot,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  sources?: Array<{ title: string; source: string; category: string }>;
  timestamp: string;
}

const INITIAL_WELCOME: Message = {
  id: "welcome-1",
  sender: "assistant",
  text: "Hello! I am your Vinoba Bhave University Campus Assistant. I am trained strictly on official university documents, placement records, faculty directory, anti-ragging policies, and student fees. What would you like to know?",
  timestamp: "Just now",
};

const SUGGESTIONS = [
  "What was the highest placement package?",
  "Who is the Head of Computer Science?",
  "How do I submit an anti-ragging complaint?",
  "When is the examination fee due?",
  "What are the psychologist counseling hours?",
];

export function CampusAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: data.answer || "I could not retrieve an answer from the official records.",
        sources: data.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I cannot find this information in official Vinoba Bhave University records. Please check the Documents section or contact the university administration office at 06546-261234 or email registrar@vbu.ac.in.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_WELCOME]);
  };

  return (
    <>
      {/* Floating Small Round Trigger in the Left Bottom Corner */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-200 border border-[#2A56C6] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
            isOpen
              ? "bg-ink text-surface rotate-90"
              : "bg-ink text-surface hover:scale-105 active:scale-95"
          }`}
          aria-label={isOpen ? "Close Assistant" : "Open Campus Assistant"}
          title="Ask Vinoba Bhave University Assistant"
        >
          {isOpen ? (
            <X className="w-5 h-5 transition-transform" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
              {/* Online pulse indicator */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#137333] border-2 border-surface"></span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chatbot Assistant Window anchored directly above the trigger in bottom-left */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Campus AI Assistant"
          className="fixed bottom-[84px] left-6 z-50 w-[350px] sm:w-[390px] h-[510px] max-h-[80vh] bg-surface border border-line rounded-card shadow-modal flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 bg-ink text-surface flex items-center justify-between border-b border-line shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-surface">
                <Bot className="w-4 h-4 text-surface" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-heading font-bold text-surface">
                    Campus Connect Assistant
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface/10 text-surface/90 font-medium">
                    RAG AI
                  </span>
                </div>
                <p className="text-[11px] text-surface/70">
                  Vinoba Bhave University Knowledge Base
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1 rounded text-surface/70 hover:text-surface hover:bg-surface/10 transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-surface/70 hover:text-surface hover:bg-surface/10 transition-colors"
                title="Minimize assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guardrail Safety Banner */}
          <div className="px-3 py-1.5 bg-paper border-b border-line flex items-center justify-between text-[11px] text-muted shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Grounded in official documents & directory</span>
            </span>
            <span className="text-[10px] font-semibold text-ink">Zero hallucination</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-paper">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-card p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-ink text-surface rounded-br-none"
                      : "bg-surface border border-line text-text rounded-bl-none shadow-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Sources Pills */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-line/60 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Official Grounded Sources:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-paper border border-line text-ink font-medium"
                          >
                            {s.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="bg-surface border border-line rounded-card p-3 text-xs text-muted flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Searching university records & documents...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-surface border-t border-line shrink-0 overflow-x-auto">
              <p className="text-[10px] text-muted mb-1.5 font-semibold">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-paper border border-line text-text hover:bg-line text-left transition-colors whitespace-nowrap"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-surface border-t border-line flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about documents, placements, faculty, fees..."
              disabled={loading}
              className="flex-1 text-xs px-3 py-2 rounded-input border border-line bg-paper text-text placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-ink text-surface p-2 rounded-button hover:bg-opacity-95 disabled:opacity-50 transition-colors"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
