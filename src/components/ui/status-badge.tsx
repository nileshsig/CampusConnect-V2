import React from "react";

export type StatusType =
  | "saved"
  | "queued"
  | "delivered"
  | "submitted"
  | "responder_assigned"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "closed"
  | "failed"
  | "active"
  | "pending"
  | "scheduled"
  | "moved"
  | "cancelled"
  | "urgent";

export function StatusBadge({ status, label }: { status: StatusType; label?: string }) {
  // Word plus shape according to Section 6.2:
  // Circle, Square, Diamond, Triangle shapes
  const config: Record<
    StatusType,
    { shape: "circle" | "square" | "diamond" | "triangle"; text: string; bg: string; textCol: string; shapeCol: string }
  > = {
    saved: { shape: "circle", text: "Saved", bg: "bg-paper", textCol: "text-muted", shapeCol: "bg-muted" },
    submitted: { shape: "circle", text: "Submitted", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    queued: { shape: "square", text: "Waiting to send", bg: "bg-paper", textCol: "text-muted", shapeCol: "bg-muted" },
    delivered: { shape: "circle", text: "Received by security", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    responder_assigned: { shape: "diamond", text: "Responder assigned", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    acknowledged: { shape: "diamond", text: "Acknowledged", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    in_progress: { shape: "square", text: "In progress", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    resolved: { shape: "circle", text: "Resolved", bg: "bg-[#F0F5EE]", textCol: "text-ink", shapeCol: "bg-ink" },
    closed: { shape: "circle", text: "Closed", bg: "bg-paper", textCol: "text-muted", shapeCol: "bg-muted" },
    failed: { shape: "triangle", text: "Failed", bg: "bg-[#FDF2F2]", textCol: "text-emergency", shapeCol: "bg-emergency" },
    active: { shape: "circle", text: "Active", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    pending: { shape: "square", text: "Pending", bg: "bg-paper", textCol: "text-muted", shapeCol: "bg-muted" },
    scheduled: { shape: "circle", text: "Scheduled", bg: "bg-paper", textCol: "text-text", shapeCol: "bg-ink" },
    moved: { shape: "triangle", text: "Moved", bg: "bg-[#EEF2FB]", textCol: "text-accent", shapeCol: "bg-accent" },
    cancelled: { shape: "square", text: "Cancelled", bg: "bg-paper", textCol: "text-muted", shapeCol: "bg-muted" },
    urgent: { shape: "triangle", text: "Urgent", bg: "bg-[#FDF2F2]", textCol: "text-emergency", shapeCol: "bg-emergency" },
  };

  const item = config[status] || config.saved;
  const displayText = label || item.text;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border border-line ${item.bg} ${item.textCol}`}
    >
      {item.shape === "circle" && <span className={`w-2 h-2 rounded-full ${item.shapeCol}`} />}
      {item.shape === "square" && <span className={`w-2 h-2 rounded-sm ${item.shapeCol}`} />}
      {item.shape === "diamond" && <span className={`w-2 h-2 rotate-45 ${item.shapeCol}`} />}
      {item.shape === "triangle" && (
        <span
          className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px]"
          style={{ borderBottomColor: status === "failed" || status === "urgent" ? "#C62828" : "#2A56C6" }}
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}
