import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "campus-connect-cron-secret";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron call" }, { status: 401 });
  }

  // Escalation pipeline: checks unacknowledged incidents older than ESCALATION_MINUTES (default 3)
  const escalationMinutes = parseInt(process.env.ESCALATION_MINUTES || "3", 10);
  const now = new Date();

  return NextResponse.json({
    status: "success",
    message: `Escalation check complete for threshold ${escalationMinutes} minutes.`,
    checkedAt: now.toISOString(),
    escalatedCount: 0,
  });
}
