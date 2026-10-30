"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  UserRole,
  Incident,
  IncidentCategory,
  IncidentTimelineItem,
  IncidentNote,
  Notice,
  Event,
  Club,
  LostFoundItem,
  NotificationItem,
  TimetableEntry,
  ChatThread,
  ChatMessage,
} from "./database.types";
import {
  INITIAL_PROFILES,
  INITIAL_INCIDENTS,
  INITIAL_TIMELINE,
  INITIAL_NOTES,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_CLUBS,
  INITIAL_LOST_FOUND,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMETABLE,
  INITIAL_THREADS,
  INITIAL_MESSAGES,
} from "./mock-data";

interface AppContextType {
  currentUser: Profile;
  setCurrentUser: (user: Profile) => void;
  switchRole: (role: UserRole) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;

  // Safety
  incidents: Incident[];
  activeIncident: Incident | null;
  timeline: IncidentTimelineItem[];
  notes: IncidentNote[];
  createSOSAlert: (data: {
    category: IncidentCategory;
    description?: string;
    locationText?: string;
    lat?: number | null;
    lng?: number | null;
    locationConsented: boolean;
  }) => Promise<{ success: boolean; incident?: Incident; error?: string }>;
  acknowledgeAlert: (incidentId: string) => void;
  updateAlertStatus: (incidentId: string, status: Incident["status"], noteText?: string) => void;
  assignResponder: (incidentId: string, responderId: string) => void;
  addAlertNote: (incidentId: string, noteText: string) => void;

  // Notices
  notices: Notice[];
  publishNotice: (notice: Omit<Notice, "id" | "published_at">) => void;
  markNoticeAsRead: (id: string) => void;

  // Lost & Found
  lostFound: LostFoundItem[];
  reportLostFound: (item: Omit<LostFoundItem, "id" | "created_at" | "status">) => void;
  resolveLostFound: (id: string) => void;

  // Events
  events: Event[];
  toggleRsvp: (eventId: string) => void;
  createEvent: (event: Omit<Event, "id" | "created_by" | "registered_count" | "user_rsvp_status">) => void;

  // Clubs
  clubs: Club[];
  toggleJoinClub: (clubId: string) => void;

  // Academics
  timetable: TimetableEntry[];
  updateTimetableStatus: (id: string, status: TimetableEntry["status"], note?: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Messages
  threads: ChatThread[];
  messages: ChatMessage[];
  sendMessage: (threadId: string, body: string) => void;
  blockPerson: (senderId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[0]);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [timeline, setTimeline] = useState<IncidentTimelineItem[]>(INITIAL_TIMELINE);
  const [notes, setNotes] = useState<IncidentNote[]>(INITIAL_NOTES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(INITIAL_TIMETABLE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  // Load / persist state locally
  useEffect(() => {
    try {
      const storedIncidents = localStorage.getItem("cc_incidents");
      if (storedIncidents) setIncidents(JSON.parse(storedIncidents));

      const storedUser = localStorage.getItem("cc_current_user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const switchRole = (role: UserRole) => {
    const matched = INITIAL_PROFILES.find((p) => p.role === role) || INITIAL_PROFILES[0];
    setCurrentUser(matched);
    try {
      localStorage.setItem("cc_current_user", JSON.stringify(matched));
    } catch {}
  };

  // SOS Creation Pipeline (FR-S1 to FR-S14)
  const createSOSAlert = async (data: {
    category: IncidentCategory;
    description?: string;
    locationText?: string;
    lat?: number | null;
    lng?: number | null;
    locationConsented: boolean;
  }): Promise<{ success: boolean; incident?: Incident; error?: string }> => {
    // Check rate limit: max 3 per 10 mins
    const recentAlerts = incidents.filter(
      (inc) =>
        inc.reporter_id === currentUser.id &&
        Date.now() - new Date(inc.created_at).getTime() < 10 * 60 * 1000
    );

    if (recentAlerts.length >= 3) {
      return {
        success: false,
        error: "You've sent several alerts in a few minutes. Call campus security if you still need help.",
      };
    }

    const publicId = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      incidents.length + 1
    ).padStart(4, "0")}`;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      public_id: publicId,
      reporter_id: currentUser.id,
      reporter_name: currentUser.full_name,
      category: data.category,
      description: data.description || null,
      lat: data.lat || null,
      lng: data.lng || null,
      location_text: data.locationText || "Location entered manually",
      location_consented: data.locationConsented,
      status: "submitted",
      delivery: "saved",
      assigned_to: "user-officer-singh",
      assigned_to_name: "Officer Vikram Singh",
      zone: "Central Campus",
      created_at: new Date().toISOString(),
    };

    const firstTimeline: IncidentTimelineItem = {
      id: `tl-${Date.now()}`,
      incident_id: newIncident.id,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      event: "Alert saved",
      detail: "Emergency alert recorded on server.",
      at: new Date().toISOString(),
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setTimeline((prev) => [firstTimeline, ...prev]);

    // Simulate backend delivery confirmation
    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === newIncident.id ? { ...inc, delivery: "delivered" } : inc))
      );
      setTimeline((prev) => [
        {
          id: `tl-${Date.now()}-del`,
          incident_id: newIncident.id,
          actor_id: null,
          actor_name: "Campus Security Post",
          event: "Received by security",
          detail: `Security console received your alert at ${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}.`,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }, 1200);

    return { success: true, incident: newIncident };
  };

  const acknowledgeAlert = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "acknowledged",
              delivery: "acknowledged",
              acknowledged_at: new Date().toISOString(),
            }
          : inc
      )
    );
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        incident_id: incidentId,
        actor_id: currentUser.id,
        actor_name: currentUser.full_name,
        event: "Acknowledged",
        detail: `${currentUser.full_name} has seen your alert and is responding.`,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateAlertStatus = (incidentId: string, status: Incident["status"], noteText?: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status,
              resolved_at: status === "resolved" ? new Date().toISOString() : inc.resolved_at,
            }
          : inc
      )
    );
    if (noteText) {
      setNotes((prev) => [
        {
          id: `in-${Date.now()}`,
          incident_id: incidentId,
          author_id: currentUser.id,
          author_name: currentUser.full_name,
          note: noteText,
          internal: false,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const assignResponder = (incidentId: string, responderId: string) => {
    const officer = INITIAL_PROFILES.find((p) => p.id === responderId);
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              assigned_to: responderId,
              assigned_to_name: officer ? officer.full_name : "Security Officer",
              status: "responder_assigned",
            }
          : inc
      )
    );
  };

  const addAlertNote = (incidentId: string, noteText: string) => {
    setNotes((prev) => [
      {
        id: `in-${Date.now()}`,
        incident_id: incidentId,
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        note: noteText,
        internal: false,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Notices
  const publishNotice = (notice: Omit<Notice, "id" | "published_at">) => {
    const newNotice: Notice = {
      ...notice,
      id: `notice-${Date.now()}`,
      published_at: new Date().toISOString(),
      read_rate: 0,
    };
    setNotices((prev) => [newNotice, ...prev]);

    // Send in-app notification if urgent
    if (newNotice.is_urgent) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          user_id: "all",
          kind: "urgent_notice",
          title: `Urgent: ${newNotice.title}`,
          body: newNotice.body.slice(0, 100) + "...",
          link: "/notices",
          read_at: null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const markNoticeAsRead = (id: string) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_rate: Math.min(100, (n.read_rate || 50) + 2) } : n
      )
    );
  };

  // Lost & Found
  const reportLostFound = (item: Omit<LostFoundItem, "id" | "created_at" | "status">) => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      status: "open",
      created_at: new Date().toISOString(),
    };
    setLostFound((prev) => [newItem, ...prev]);
  };

  const resolveLostFound = (id: string) => {
    setLostFound((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "resolved" } : item))
    );
  };

  // Events RSVP
  const toggleRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const currentStatus = evt.user_rsvp_status;
        const capacity = evt.capacity || 100;
        const currentCount = evt.registered_count || 0;

        if (currentStatus === "going" || currentStatus === "waitlist") {
          return {
            ...evt,
            user_rsvp_status: null,
            registered_count: Math.max(0, currentCount - 1),
          };
        } else {
          const isFull = currentCount >= capacity;
          return {
            ...evt,
            user_rsvp_status: isFull ? "waitlist" : "going",
            registered_count: currentCount + 1,
          };
        }
      })
    );
  };

  const createEvent = (
    event: Omit<Event, "id" | "created_by" | "registered_count" | "user_rsvp_status">
  ) => {
    const newEvent: Event = {
      ...event,
      id: `evt-${Date.now()}`,
      created_by: currentUser.id,
      registered_count: 0,
      user_rsvp_status: null,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Clubs
  const toggleJoinClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        if (club.user_membership_status === "active") {
          return {
            ...club,
            user_membership_status: null,
            members_count: Math.max(0, club.members_count - 1),
          };
        } else {
          return {
            ...club,
            user_membership_status: club.requires_approval ? "pending" : "active",
            members_count: club.requires_approval ? club.members_count : club.members_count + 1,
          };
        }
      })
    );
  };

  // Academics
  const updateTimetableStatus = (
    id: string,
    status: TimetableEntry["status"],
    note?: string
  ) => {
    setTimetable((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status, note: note || entry.note } : entry
      )
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  // Messages
  const sendMessage = (threadId: string, body: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      thread_id: threadId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_role: currentUser.role,
      body,
      created_at: new Date().toISOString(),
      hidden: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setThreads((prev) =>
      prev.map((th) =>
        th.id === threadId
          ? { ...th, last_message: body, updated_at: new Date().toISOString() }
          : th
      )
    );
  };

  const blockPerson = (senderId: string) => {
    setMessages((prev) => prev.filter((m) => m.sender_id !== senderId));
  };

  const activeIncident =
    incidents.find((i) => i.reporter_id === currentUser.id && i.status !== "closed") || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        language,
        setLanguage,
        incidents,
        activeIncident,
        timeline,
        notes,
        createSOSAlert,
        acknowledgeAlert,
        updateAlertStatus,
        assignResponder,
        addAlertNote,
        notices,
        publishNotice,
        markNoticeAsRead,
        lostFound,
        reportLostFound,
        resolveLostFound,
        events,
        toggleRsvp,
        createEvent,
        clubs,
        toggleJoinClub,
        timetable,
        updateTimetableStatus,
        notifications,
        markNotificationRead,
        threads,
        messages,
        sendMessage,
        blockPerson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
