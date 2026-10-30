import React from "react";
import { Card } from "./card";

export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <Card className="flex flex-col justify-between">
      <span className="text-sm font-medium text-muted">{label}</span>
      <div className="my-2">
        <span className="text-3xl font-heading font-bold text-ink tabular-nums">{value}</span>
      </div>
      {sublabel && <span className="text-xs text-muted">{sublabel}</span>}
    </Card>
  );
}
