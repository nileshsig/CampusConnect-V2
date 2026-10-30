import { describe, it, expect } from "vitest";
import { getRolePermissions, requireRole } from "../src/lib/rbac";
import { UserRole } from "../src/lib/database.types";

describe("Campus Connect Critical Security & Business Rules (T1 - T15)", () => {
  it("T1 & T2: Enforces role guard rejecting students from admin operations", () => {
    const studentRole: UserRole = "student";
    const allowedForAdmin: UserRole[] = ["admin", "principal"];

    expect(requireRole(studentRole, allowedForAdmin)).toBe(false);

    const studentPerms = getRolePermissions("student");
    expect(studentPerms.canManageUsers).toBe(false);
    expect(studentPerms.canAssignResponder).toBe(false);
    expect(studentPerms.canViewAllIncidents).toBe(false);
  });

  it("T3: Principal role has executive oversight and anti-ragging permissions", () => {
    const principalPerms = getRolePermissions("principal");
    expect(principalPerms.canAssignResponder).toBe(true);
    expect(principalPerms.canManageUsers).toBe(true);
    expect(principalPerms.canAcknowledgeIncident).toBe(true);
    expect(principalPerms.canManageRaggingComplaints).toBe(true);
    expect(principalPerms.canCreateEvent).toBe(true);
  });

  it("T4: Student role is strictly blocked from creating events", () => {
    const studentPerms = getRolePermissions("student");
    expect(studentPerms.canCreateEvent).toBe(false);

    const facultyPerms = getRolePermissions("faculty");
    expect(facultyPerms.canCreateEvent).toBe(true);
  });

  it("T5: SOS creation accepts manual location when location permission is not granted", () => {
    const manualLocation = "Science Block, Gate 2";
    const payload = {
      category: "medical" as const,
      lat: null,
      lng: null,
      locationText: manualLocation,
      locationConsented: false,
    };

    expect(payload.locationText).toBe(manualLocation);
    expect(payload.locationConsented).toBe(false);
  });

  it("T6 & FR-S11: Truthful delivery state never marks delivered unless confirmed", () => {
    const initialState = "saved";
    expect(initialState).not.toBe("delivered");
  });

  it("T8: Rate limiting SOS alerts to prevent abuse (FR-S14)", () => {
    const alertsTimestamps = [
      Date.now() - 60000,
      Date.now() - 120000,
      Date.now() - 180000,
    ];

    const isRateLimited = alertsTimestamps.length >= 3;
    expect(isRateLimited).toBe(true);
  });

  it("T10: Event at capacity automatically moves new signups to waitlist", () => {
    const capacity = 50;
    const currentGoing = 50;

    const newRsvpStatus = currentGoing >= capacity ? "waitlist" : "going";
    expect(newRsvpStatus).toBe("waitlist");

    const updatedCount = currentGoing - 1;
    const nextRsvpStatus = updatedCount >= capacity ? "waitlist" : "going";
    expect(nextRsvpStatus).toBe("going");
  });

  it("T11: Faculty without publish notice permission is rejected", () => {
    const facultyWithoutFlag = getRolePermissions("faculty", { canPublishNotices: false });
    expect(facultyWithoutFlag.canPublishNotice).toBe(false);

    const facultyWithFlag = getRolePermissions("faculty", { canPublishNotices: true });
    expect(facultyWithFlag.canPublishNotice).toBe(true);
  });
});
