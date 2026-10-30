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
}

export function getRolePermissions(role: UserRole, flags?: { canPublishNotices?: boolean; isClubLead?: boolean }): PermissionCheck {
  return {
    canViewAllIncidents: role === "admin" || role === "security",
    canAssignResponder: role === "admin",
    canAcknowledgeIncident: role === "admin" || role === "security",
    canPublishNotice: role === "admin" || (role === "faculty" && Boolean(flags?.canPublishNotices)),
    canCreateEvent: role === "admin" || Boolean(flags?.isClubLead),
    canManageUsers: role === "admin",
    canViewAnalytics: role === "admin" || role === "security",
    canPostAcademicUpdate: role === "faculty" || role === "admin",
  };
}

export function requireRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
