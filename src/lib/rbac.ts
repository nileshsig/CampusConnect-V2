import { UserRole } from "./database.types";

export interface PermissionCheck {
  canViewAllIncidents: boolean;
  canAssignResponder: boolean;
  canAcknowledgeIncident: boolean;
  canPublishNotice: boolean;
  canCreateEvent: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canPostAcademicUpdate: boolean;
  canManageRaggingComplaints: boolean;
}

export function getRolePermissions(
  role: UserRole,
  flags?: { canPublishNotices?: boolean; isClubLead?: boolean }
): PermissionCheck {
  return {
    canViewAllIncidents: role === "admin" || role === "principal",
    canAssignResponder: role === "admin" || role === "principal",
    canAcknowledgeIncident: role === "admin" || role === "principal",
    canPublishNotice:
      role === "admin" ||
      role === "principal" ||
      (role === "faculty" && Boolean(flags?.canPublishNotices)),
    // Students can NEVER create events!
    canCreateEvent: role === "admin" || role === "principal" || role === "faculty",
    canManageUsers: role === "admin" || role === "principal",
    canViewAnalytics: role === "admin" || role === "principal",
    canPostAcademicUpdate: role === "faculty" || role === "admin" || role === "principal",
    canManageRaggingComplaints: role === "admin" || role === "principal",
  };
}

export function requireRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
