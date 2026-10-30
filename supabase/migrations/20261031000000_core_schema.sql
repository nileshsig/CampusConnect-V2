-- Core Schema for Campus Connect (Vinoba Bhave University)
create extension if not exists pgcrypto;

create type user_role as enum ('student','faculty','admin','security');
create type incident_status as enum ('submitted','acknowledged','responder_assigned','in_progress','resolved','closed');
create type incident_category as enum ('medical','personal_safety','harassment','accident','security_issue','other');
create type delivery_state as enum ('saved','queued','delivered','acknowledged','failed');

create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role user_role not null default 'student',
  department_id uuid references departments(id),
  semester int,
  roll_no text unique,
  phone text,
  hostel text,
  is_resident_advisor boolean not null default false,
  is_club_lead boolean not null default false,
  can_publish_notices boolean not null default false,
  language text not null default 'en',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  department_id uuid references departments(id),
  semester int,
  faculty_id uuid references profiles(id)
);

create table enrollments (
  student_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  primary key (student_id, course_id)
);

create table timetable_entries (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  weekday int not null check (weekday between 1 and 7),
  starts time not null,
  ends time not null,
  room text not null,
  kind text not null default 'class' check (kind in ('class','lab')),
  status text not null default 'scheduled' check (status in ('scheduled','cancelled','moved')),
  note text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create table academic_updates (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  author_id uuid not null references profiles(id),
  title text not null,
  body text,
  due_at timestamptz,
  kind text not null default 'update' check (kind in ('update','assignment','exam')),
  created_at timestamptz not null default now()
);

create table exam_seating (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  student_id uuid references profiles(id),
  exam_date date not null,
  room text not null,
  seat text not null
);

create table notices (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id),
  category text not null check (category in ('holiday','exam','lost_found','workshop','general','urgent')),
  title text not null,
  body text not null,
  is_urgent boolean not null default false,
  audience_department uuid references departments(id),
  audience_semester int,
  attachment_path text,
  status text not null default 'published' check (status in ('draft','pending','published','archived')),
  published_at timestamptz default now()
);

create table notice_reads (
  notice_id uuid references notices(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notice_id, user_id)
);

create table lost_found (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id),
  kind text not null check (kind in ('lost','found')),
  item text not null,
  details text,
  location text,
  image_path text,
  status text not null default 'open' check (status in ('open','claimed','resolved')),
  created_at timestamptz not null default now()
);

create table clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  description text,
  requires_approval boolean not null default false,
  lead_id uuid references profiles(id),
  archived boolean not null default false
);

create table club_members (
  club_id uuid references clubs(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('pending','active')),
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id),
  created_by uuid not null references profiles(id),
  title text not null,
  description text,
  venue text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity int,
  category text
);

create table event_rsvps (
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text not null default 'going' check (status in ('going','waitlist')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table threads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('direct','course','club')),
  ref_id uuid,
  created_at timestamptz not null default now()
);

create table thread_members (
  thread_id uuid references threads(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null check (length(body) <= 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table incidents (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  reporter_id uuid not null references profiles(id),
  category incident_category not null,
  description text,
  lat double precision,
  lng double precision,
  location_text text,
  location_consented boolean not null default false,
  status incident_status not null default 'submitted',
  delivery delivery_state not null default 'saved',
  assigned_to uuid references profiles(id),
  zone text,
  false_alarm boolean,
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);
create index idx_incidents_status on incidents (status, created_at desc);
create index idx_incidents_reporter on incidents (reporter_id);
create index idx_incidents_assigned on incidents (assigned_to);

create table incident_timeline (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents(id) on delete cascade,
  actor_id uuid references profiles(id),
  event text not null,
  detail text,
  at timestamptz not null default now()
);

create table incident_notes (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents(id) on delete cascade,
  author_id uuid not null references profiles(id),
  note text not null,
  internal boolean not null default true,
  at timestamptz not null default now()
);

create table safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id),
  title text not null,
  details text,
  location_text text,
  image_path text,
  status text not null default 'open' check (status in ('open','in_review','resolved','closed')),
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table delivery_attempts (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references notifications(id) on delete cascade,
  incident_id uuid references incidents(id) on delete cascade,
  channel text not null check (channel in ('in_app','email','push')),
  state delivery_state not null,
  provider_ref text,
  error text,
  at timestamptz not null default now()
);

create table audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb,
  at timestamptz not null default now()
);

-- RLS setup
alter table profiles enable row level security;
alter table incidents enable row level security;
alter table incident_timeline enable row level security;
alter table incident_notes enable row level security;
alter table notices enable row level security;
alter table notifications enable row level security;
alter table messages enable row level security;
alter table audit_log enable row level security;

create or replace function auth_role() returns user_role
  language sql stable security definer set search_path = public
  as $$ select role from profiles where id = auth.uid() $$;

-- Incidents policies
create policy inc_owner_read on incidents for select using (reporter_id = auth.uid());
create policy inc_admin_read on incidents for select using (auth_role() = 'admin');
create policy inc_security_read on incidents for select using (auth_role() = 'security' and (assigned_to = auth.uid() or assigned_to is null));
create policy inc_create on incidents for insert with check (reporter_id = auth.uid());
create policy inc_update on incidents for update using (auth_role() = 'admin' or (auth_role() = 'security' and assigned_to = auth.uid()));

-- Profile update policy
create policy profile_self_update on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
