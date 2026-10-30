import React from "react";
import { IncidentTimelineItem } from "@/lib/database.types";

export function Timeline({ items }: { items: IncidentTimelineItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-line">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-surface" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{item.event}</span>
            <span className="text-xs text-muted tabular-nums">
              {new Date(item.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {item.actor_name && (
            <span className="text-xs text-muted block mt-0.5">{item.actor_name}</span>
          )}
          {item.detail && (
            <p className="mt-1 text-sm text-text leading-relaxed bg-paper p-2.5 rounded border border-line">
              {item.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
