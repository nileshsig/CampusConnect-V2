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
  EventRegistrationDetails,
  Club,
  ClubJoinDetails,
  LostFoundItem,
  NotificationItem,
  TimetableEntry,
  ChatThread,
  ChatMessage,
  RaggingComplaint,
  MentalHealthBooking,
  MoodCheckIn,
  FacultyContact,
  CampusDocument,
  StudentFeeRecord,
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
  INITIAL_RAGGING_COMPLAINTS,
  INITIAL_MENTAL_HEALTH_BOOKINGS,
  INITIAL_FACULTY_CONTACTS,
  INITIAL_CAMPUS_DOCUMENTS,
  INITIAL_FEE_RECORDS,
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

  // Lost & Found (Resolution restricted to creator/admin)
  lostFound: LostFoundItem[];
  reportLostFound: (item: Omit<LostFoundItem, "id" | "created_at" | "status">) => void;
  resolveLostFound: (id: string) => { success: boolean; error?: string };

  // Events (Creation strictly blocked for students, personal details required on RSVP)
  events: Event[];
  registerForEvent: (eventId: string, details: EventRegistrationDetails) => void;
  cancelEventRegistration: (eventId: string) => void;
  createEvent: (
    event: Omit<Event, "id" | "created_by" | "registered_count" | "user_rsvp_status">
  ) => { success: boolean; error?: string };

  // Clubs (Personal details required when joining)
  clubs: Club[];
  joinClubWithDetails: (clubId: string, details: ClubJoinDetails) => void;
  leaveClub: (clubId: string) => void;

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

  // Anti-Ragging Complaints
  raggingComplaints: RaggingComplaint[];
  submitRaggingComplaint: (
    data: Omit<RaggingComplaint, "id" | "public_id" | "created_at" | "status">
  ) => void;
  updateRaggingStatus: (
    complaintId: string,
    status: RaggingComplaint["status"],
    actionNotes?: string
  ) => void;

  // Mental Health & Wellness
  mentalHealthBookings: MentalHealthBooking[];
  bookCounselorSession: (
    data: Omit<MentalHealthBooking, "id" | "student_id" | "student_name" | "status" | "created_at">
  ) => void;
  moodLogs: MoodCheckIn[];
  logMood: (mood: MoodCheckIn["mood"], note?: string) => void;

  // Contacts & Faculty Directory
  facultyContacts: FacultyContact[];

  // Campus Documents
  campusDocuments: CampusDocument[];

  // Student Fee Management
  feeRecords: StudentFeeRecord[];
  payFee: (feeId: string) => void;
  recordOfflineFeePayment: (feeId: string, paymentMethod: string, transactionRef?: string) => void;
  sendFeeReminder: (feeId: string) => void;
  signOut: () => void;
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

  // New modules states
  const [raggingComplaints, setRaggingComplaints] =
    useState<RaggingComplaint[]>(INITIAL_RAGGING_COMPLAINTS);
  const [mentalHealthBookings, setMentalHealthBookings] =
    useState<MentalHealthBooking[]>(INITIAL_MENTAL_HEALTH_BOOKINGS);
  const [moodLogs, setMoodLogs] = useState<MoodCheckIn[]>([
    {
      id: "mood-1",
      student_id: "user-asha",
      date: new Date().toISOString().slice(0, 10),
      mood: "good",
      note: "Attended lab on time.",
    },
  ]);
  const [facultyContacts] = useState<FacultyContact[]>(INITIAL_FACULTY_CONTACTS);
  const [campusDocuments] = useState<CampusDocument[]>(INITIAL_CAMPUS_DOCUMENTS);
  const [feeRecords, setFeeRecords] = useState<StudentFeeRecord[]>(INITIAL_FEE_RECORDS);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("cc_current_user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch {}
  }, []);

  const switchRole = (role: UserRole) => {
    const matched = INITIAL_PROFILES.find((p) => p.role === role) || INITIAL_PROFILES[0];
    setCurrentUser(matched);
    try {
      localStorage.setItem("cc_current_user", JSON.stringify(matched));
    } catch {}
  };

  // SOS Creation Pipeline
  const createSOSAlert = async (data: {
    category: IncidentCategory;
    description?: string;
    locationText?: string;
    lat?: number | null;
    lng?: number | null;
    locationConsented: boolean;
  }): Promise<{ success: boolean; incident?: Incident; error?: string }> => {
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
      assigned_to: "user-principal",
      assigned_to_name: "Prof. Dr. R. K. Sharma (Principal)",
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

    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === newIncident.id ? { ...inc, delivery: "delivered" } : inc))
      );
      setTimeline((prev) => [
        {
          id: `tl-${Date.now()}-del`,
          incident_id: newIncident.id,
          actor_id: null,
          actor_name: "Principal & Security Command",
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
        detail: `${currentUser.full_name} has seen your alert and dispatched assistance.`,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Update status: resolve option should only be available to creator or principal/admin
  const updateAlertStatus = (incidentId: string, status: Incident["status"], noteText?: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    if (
      status === "resolved" &&
      inc.reporter_id !== currentUser.id &&
      currentUser.role !== "principal" &&
      currentUser.role !== "admin"
    ) {
      alert("Only the person who created this alert (or the Principal / Admin) can mark it resolved.");
      return;
    }

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === incidentId
          ? {
              ...item,
              status,
              resolved_at: status === "resolved" ? new Date().toISOString() : item.resolved_at,
            }
          : item
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
    const profile = INITIAL_PROFILES.find((p) => p.id === responderId);
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              assigned_to: responderId,
              assigned_to_name: profile ? profile.full_name : "Designated Officer",
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
  };

  const markNoticeAsRead = (id: string) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_rate: Math.min(100, (n.read_rate || 50) + 2) } : n
      )
    );
  };

  // Lost & Found: RESOLVE OPTION ONLY AVAILABLE TO CREATOR OR PRINCIPAL/ADMIN
  const reportLostFound = (item: Omit<LostFoundItem, "id" | "created_at" | "status">) => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      reporter_id: currentUser.id,
      reporter_name: currentUser.full_name,
      status: "open",
      created_at: new Date().toISOString(),
    };
    setLostFound((prev) => [newItem, ...prev]);
  };

  const resolveLostFound = (id: string): { success: boolean; error?: string } => {
    const item = lostFound.find((i) => i.id === id);
    if (!item) return { success: false, error: "Item not found." };

    if (
      item.reporter_id !== currentUser.id &&
      currentUser.role !== "principal" &&
      currentUser.role !== "admin"
    ) {
      return {
        success: false,
        error: "Only the person who posted this item can mark it resolved.",
      };
    }

    setLostFound((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "resolved" } : i))
    );
    return { success: true };
  };

  // Events: Student cannot create events! Personal details needed on registration
  const createEvent = (
    event: Omit<Event, "id" | "created_by" | "registered_count" | "user_rsvp_status">
  ): { success: boolean; error?: string } => {
    if (currentUser.role === "student") {
      return {
        success: false,
        error: "Students are not permitted to create events. Only Principal, Faculty and Administration can publish campus events.",
      };
    }

    const newEvent: Event = {
      ...event,
      id: `evt-${Date.now()}`,
      created_by: currentUser.id,
      registered_count: 0,
      user_rsvp_status: null,
      registration_details: {},
    };
    setEvents((prev) => [newEvent, ...prev]);
    return { success: true };
  };

  const registerForEvent = (eventId: string, details: EventRegistrationDetails) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const capacity = evt.capacity || 100;
        const currentCount = evt.registered_count || 0;
        const isFull = currentCount >= capacity;

        const regDetails = evt.registration_details || {};
        regDetails[currentUser.id] = details;

        return {
          ...evt,
          user_rsvp_status: isFull ? "waitlist" : "going",
          registered_count: currentCount + 1,
          registration_details: regDetails,
        };
      })
    );
  };

  const cancelEventRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const regDetails = evt.registration_details || {};
        delete regDetails[currentUser.id];

        return {
          ...evt,
          user_rsvp_status: null,
          registered_count: Math.max(0, (evt.registered_count || 1) - 1),
          registration_details: regDetails,
        };
      })
    );
  };

  // Clubs: Personal details needed when joining
  const joinClubWithDetails = (clubId: string, details: ClubJoinDetails) => {
    setClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          user_membership_status: club.requires_approval ? "pending" : "active",
          members_count: club.requires_approval ? club.members_count : club.members_count + 1,
        };
      })
    );
  };

  const leaveClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          user_membership_status: null,
          members_count: Math.max(0, club.members_count - 1),
        };
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

  // Anti-Ragging Complaints
  const submitRaggingComplaint = (
    data: Omit<RaggingComplaint, "id" | "public_id" | "created_at" | "status">
  ) => {
    const publicId = `ARC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      raggingComplaints.length + 1
    ).padStart(4, "0")}`;

    const newComplaint: RaggingComplaint = {
      ...data,
      id: `rag-${Date.now()}`,
      public_id: publicId,
      status: "submitted",
      created_at: new Date().toISOString(),
    };
    setRaggingComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateRaggingStatus = (
    complaintId: string,
    status: RaggingComplaint["status"],
    actionNotes?: string
  ) => {
    setRaggingComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              action_notes: actionNotes || c.action_notes,
            }
          : c
      )
    );
  };

  // Mental Health & Wellness
  const bookCounselorSession = (
    data: Omit<MentalHealthBooking, "id" | "student_id" | "student_name" | "status" | "created_at">
  ) => {
    const newBooking: MentalHealthBooking = {
      ...data,
      id: `mh-${Date.now()}`,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };
    setMentalHealthBookings((prev) => [newBooking, ...prev]);
  };

  const logMood = (mood: MoodCheckIn["mood"], note?: string) => {
    const newMood: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      student_id: currentUser.id,
      date: new Date().toISOString().slice(0, 10),
      mood,
      note,
    };
    setMoodLogs((prev) => [newMood, ...prev]);
  };

  // Student Fee Management
  const payFee = (feeId: string) => {
    const receipt = `REC-VBU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFeeRecords((prev) =>
      prev.map((fee) =>
        fee.id === feeId
          ? {
              ...fee,
              status: "paid",
              receipt_number: receipt,
              paid_at: new Date().toISOString().slice(0, 10),
              payment_method: "Online Student Portal",
            }
          : fee
      )
    );
  };

  const recordOfflineFeePayment = (
    feeId: string,
    paymentMethod: string,
    transactionRef?: string
  ) => {
    const receipt = `REC-VBU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFeeRecords((prev) =>
      prev.map((fee) =>
        fee.id === feeId
          ? {
              ...fee,
              status: "paid",
              receipt_number: receipt,
              paid_at: new Date().toISOString().slice(0, 10),
              payment_method: transactionRef
                ? `${paymentMethod} (Ref: ${transactionRef})`
                : paymentMethod,
            }
          : fee
      )
    );
  };

  const sendFeeReminder = (feeId: string) => {
    const fee = feeRecords.find((f) => f.id === feeId);
    if (!fee) return;
    const reminderNotif: NotificationItem = {
      id: `notif-fee-${Date.now()}`,
      user_id: fee.student_id,
      kind: "urgent_notice",
      title: `Fee Due Reminder: ${fee.fee_type.toUpperCase()}`,
      body: `Your ${fee.fee_type} fee of INR ${fee.amount.toLocaleString()} is due on ${fee.due_date}. Please clear dues to prevent examination admit card hold.`,
      link: "/fees",
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [reminderNotif, ...prev]);
  };

  const signOut = () => {
    // Reset to student default and navigate to signin
    setCurrentUser(INITIAL_PROFILES[0]);
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
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
        registerForEvent,
        cancelEventRegistration,
        createEvent,
        clubs,
        joinClubWithDetails,
        leaveClub,
        timetable,
        updateTimetableStatus,
        notifications,
        markNotificationRead,
        threads,
        messages,
        sendMessage,
        blockPerson,
        raggingComplaints,
        submitRaggingComplaint,
        updateRaggingStatus,
        mentalHealthBookings,
        bookCounselorSession,
        moodLogs,
        logMood,
        facultyContacts,
        campusDocuments,
        feeRecords,
        payFee,
        recordOfflineFeePayment,
        sendFeeReminder,
        signOut,
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
