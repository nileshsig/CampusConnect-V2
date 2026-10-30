export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'faculty' | 'admin' | 'principal';
export type IncidentStatus = 'submitted' | 'acknowledged' | 'responder_assigned' | 'in_progress' | 'resolved' | 'closed';
export type IncidentCategory = 'medical' | 'personal_safety' | 'harassment' | 'accident' | 'security_issue' | 'other';
export type DeliveryState = 'saved' | 'queued' | 'delivered' | 'acknowledged' | 'failed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department_id?: string | null;
  semester?: number | null;
  roll_no?: string | null;
  phone?: string | null;
  hostel?: string | null;
  is_resident_advisor: boolean;
  is_club_lead: boolean;
  can_publish_notices: boolean;
  language: string;
  active: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department_id?: string | null;
  semester?: number | null;
  faculty_id?: string | null;
}

export interface TimetableEntry {
  id: string;
  course_id: string;
  course_code?: string;
  course_title?: string;
  weekday: number;
  starts: string;
  ends: string;
  room: string;
  kind: 'class' | 'lab';
  status: 'scheduled' | 'cancelled' | 'moved';
  note?: string | null;
  updated_by?: string | null;
  updated_at: string;
}

export interface Notice {
  id: string;
  author_id: string;
  author_name?: string;
  category: 'holiday' | 'exam' | 'lost_found' | 'workshop' | 'general' | 'urgent';
  title: string;
  body: string;
  is_urgent: boolean;
  audience_department?: string | null;
  audience_semester?: number | null;
  attachment_path?: string | null;
  status: 'draft' | 'pending' | 'published' | 'archived';
  published_at: string;
  read_rate?: number;
}

export interface LostFoundItem {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  kind: 'lost' | 'found';
  item: string;
  details?: string | null;
  location?: string | null;
  image_path?: string | null;
  status: 'open' | 'claimed' | 'resolved';
  created_at: string;
}

export interface EventRegistrationDetails {
  roll_no: string;
  department: string;
  semester: number;
  phone: string;
  emergency_contact: string;
  note?: string;
}

export interface Event {
  id: string;
  club_id?: string | null;
  club_name?: string;
  created_by: string;
  title: string;
  description?: string | null;
  venue?: string | null;
  starts_at: string;
  ends_at?: string | null;
  capacity?: number | null;
  registered_count?: number;
  user_rsvp_status?: 'going' | 'waitlist' | null;
  category?: string | null;
  registration_details?: Record<string, EventRegistrationDetails>;
}

export interface ClubJoinDetails {
  roll_no: string;
  department: string;
  semester: number;
  phone: string;
  reason: string;
  skills: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  requires_approval: boolean;
  lead_id?: string | null;
  lead_name?: string;
  members_count: number;
  user_membership_status?: 'active' | 'pending' | null;
  archived: boolean;
}

export interface Incident {
  id: string;
  public_id: string;
  reporter_id: string;
  reporter_name?: string;
  category: IncidentCategory;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  location_text?: string | null;
  location_consented: boolean;
  status: IncidentStatus;
  delivery: DeliveryState;
  assigned_to?: string | null;
  assigned_to_name?: string | null;
  zone?: string | null;
  false_alarm?: boolean | null;
  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export interface IncidentTimelineItem {
  id: string;
  incident_id: string;
  actor_id?: string | null;
  actor_name?: string;
  event: string;
  detail?: string | null;
  at: string;
}

export interface IncidentNote {
  id: string;
  incident_id: string;
  author_id: string;
  author_name?: string;
  note: string;
  internal: boolean;
  at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  body: string;
  created_at: string;
  hidden: boolean;
}

export interface ChatThread {
  id: string;
  kind: 'direct' | 'course' | 'club';
  title: string;
  ref_id?: string | null;
  last_message?: string;
  updated_at: string;
  unread_count: number;
}

// Anti-Ragging Complaints
export interface RaggingComplaint {
  id: string;
  public_id: string;
  reporter_id: string;
  is_anonymous: boolean;
  reporter_name?: string;
  reporter_roll_no?: string;
  department?: string;
  incident_date: string;
  location: string;
  accused_details: string;
  description: string;
  witness_details?: string;
  status: 'submitted' | 'under_investigation' | 'action_taken' | 'resolved' | 'closed';
  created_at: string;
  action_notes?: string;
}

// Mental Health & Wellness
export interface MentalHealthBooking {
  id: string;
  student_id: string;
  student_name: string;
  booking_type: 'counselor' | 'peer_buddy' | 'anonymous_chat';
  preferred_slot: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface MoodCheckIn {
  id: string;
  student_id: string;
  date: string;
  mood: 'calm' | 'good' | 'stressed' | 'overwhelmed';
  note?: string;
}

// Contacts & Faculty Directory
export interface FacultyContact {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  room_number: string;
  office_hours: string;
  subjects: string[];
}

// Campus Documents
export interface CampusDocument {
  id: string;
  title: string;
  category: 'placement' | 'study_material' | 'regulations' | 'forms';
  description: string;
  file_format: string;
  file_size: string;
  uploaded_by: string;
  updated_at: string;
}

// Student Fee Record
export interface StudentFeeRecord {
  id: string;
  student_id: string;
  student_name?: string;
  student_roll_no: string;
  department?: string;
  semester: number;
  academic_year: string;
  fee_type: 'tuition' | 'hostel' | 'examination' | 'library';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  receipt_number?: string;
  paid_at?: string;
  payment_method?: string;
}
