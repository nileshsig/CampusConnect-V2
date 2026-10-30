-- Seed Data for Campus Connect Demo
-- Departments
insert into departments (id, name) values
  ('d1111111-1111-1111-1111-111111111111', 'Computer Science & Engineering'),
  ('d2222222-2222-2222-2222-222222222222', 'Department of Physics'),
  ('d3333333-3333-3333-3333-333333333333', 'Department of Chemistry'),
  ('d4444444-4444-4444-4444-444444444444', 'Department of Mathematics');

-- Profiles
insert into profiles (id, full_name, email, role, department_id, semester, roll_no, phone, hostel, is_resident_advisor, is_club_lead, can_publish_notices) values
  ('11111111-1111-1111-1111-111111111111', 'Asha Kumari', 'asha@vbu.ac.in', 'student', 'd1111111-1111-1111-1111-111111111111', 4, 'CS2023-042', '+919876543210', 'Gargi Hostel Block A', false, true, false),
  ('22222222-2222-2222-2222-222222222222', 'Dr. S. Prasad', 'prasad@vbu.ac.in', 'faculty', 'd1111111-1111-1111-1111-111111111111', null, null, '+919876543211', null, false, false, true),
  ('33333333-3333-3333-3333-333333333333', 'Officer Vikram Singh', 'officer.singh@vbu.ac.in', 'security', null, null, null, '+919876543212', null, false, false, false),
  ('44444444-4444-4444-4444-444444444444', 'Registrar Office Admin', 'admin@vbu.ac.in', 'admin', null, null, null, '+919876543213', null, false, false, true),
  ('55555555-5555-5555-5555-555555555555', 'Priya Sharma (Resident Advisor)', 'priya.ra@vbu.ac.in', 'student', 'd2222222-2222-2222-2222-222222222222', 6, 'PH2022-019', '+919876543214', 'Gargi Hostel Block B', true, false, false);

-- Courses
insert into courses (id, code, title, department_id, semester, faculty_id) values
  ('c1111111-1111-1111-1111-111111111111', 'CS401', 'Operating Systems', 'd1111111-1111-1111-1111-111111111111', 4, '22222222-2222-2222-2222-222222222222'),
  ('c2222222-2222-2222-2222-222222222222', 'CS402', 'Data Structures & Algorithms', 'd1111111-1111-1111-1111-111111111111', 4, '22222222-2222-2222-2222-222222222222'),
  ('c3333333-3333-3333-3333-333333333333', 'CS403', 'Database Management Lab', 'd1111111-1111-1111-1111-111111111111', 4, '22222222-2222-2222-2222-222222222222');

-- Enrollments
insert into enrollments (student_id, course_id) values
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333');

-- Timetable
insert into timetable_entries (course_id, weekday, starts, ends, room, kind, status, note) values
  ('c1111111-1111-1111-1111-111111111111', 1, '09:30:00', '10:30:00', 'Room 204', 'class', 'scheduled', 'Main Lecture Hall'),
  ('c2222222-2222-2222-2222-222222222222', 1, '10:45:00', '11:45:00', 'Room 102', 'class', 'moved', 'Shifted to Room 102 for projector setup'),
  ('c3333333-3333-3333-3333-333333333333', 1, '14:00:00', '16:00:00', 'Computer Lab 3', 'lab', 'scheduled', 'Bring your practical journal');

-- Clubs
insert into clubs (id, name, category, description, requires_approval, lead_id) values
  ('b1111111-1111-1111-1111-111111111111', 'Literature & Debating Society', 'Culture', 'Open to all students interested in book reading, creative writing and parliamentary debates.', false, '11111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222', 'Sports & Athletics Club', 'Sports', 'Organizes campus badminton, football, cricket leagues and morning runs.', false, null),
  ('b3333333-3333-3333-3333-333333333333', 'Science and Innovation Forum', 'Academic', 'Hackathons, engineering projects, robotics and astronomy workshops.', true, null),
  ('b4444444-4444-4444-4444-444444444444', 'Art and Culture Wing', 'Culture', 'Classical music, street play, folk dance and painting exhibitions.', false, null),
  ('b5555555-5555-5555-5555-555555555555', 'National Service Scheme (NSS)', 'Social Service', 'Community outreach, blood donation camps, literacy campaigns in adopted villages.', false, null),
  ('b6666666-6666-6666-6666-666666666666', 'National Cadet Corps (NCC)', 'Service', 'Discipline, drill training, outdoor camps and national service preparation.', true, null);

-- Notices
insert into notices (id, author_id, category, title, body, is_urgent, published_at) values
  ('n1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'urgent', 'Pre-Cyclone Heavy Rain Warning: Classes Online After 2 PM', 'Due to state weather advisory, all physical classes after 2:00 PM today will transition online. Hostel wardens ensure students stay indoors.', true, now()),
  ('n2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'exam', 'Mid-Term Examination Seating Plan Released', 'Seating plans for Semester 4 examinations have been posted under the Academics section. Verify your room and seat number before Monday.', false, now() - interval '1 day'),
  ('n3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'holiday', 'University Holiday Announcement for Diwali and Chhath Puja', 'The University administrative offices and teaching departments will remain closed from November 10 to November 16.', false, now() - interval '2 days');

-- Events
insert into events (id, club_id, created_by, title, description, venue, starts_at, ends_at, capacity, category) values
  ('e1111111-1111-1111-1111-111111111111', 'b3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Annual University Innovation Challenge 2026', 'Showcase software, green energy and hardware prototypes. Prizes awarded by university alumni.', 'Central Auditorium & Lawn', now() + interval '3 days', now() + interval '3 days 6 hours', 200, 'Innovation'),
  ('e2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Inter-College Parliamentary Debate', 'Topic: Artificial intelligence in higher education. Registration open for pairs.', 'Senate Hall, Room 101', now() + interval '5 days', now() + interval '5 days 3 hours', 60, 'Debate');

-- Example Incidents
insert into incidents (id, public_id, reporter_id, category, description, location_text, status, delivery, assigned_to, created_at) values
  ('i1111111-1111-1111-1111-111111111111', 'INC-20261031-0001', '11111111-1111-1111-1111-111111111111', 'medical', 'Student slipped near Library staircase, needs first-aid assistance.', 'Central Library, Ground Floor East Wing', 'acknowledged', 'delivered', '33333333-3333-3333-3333-333333333333', now() - interval '15 minutes');

insert into incident_timeline (incident_id, actor_id, event, detail, at) values
  ('i1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'created', 'Alert created by student', now() - interval '15 minutes'),
  ('i1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'acknowledged', 'Officer Singh acknowledged and is responding with medical kit', now() - interval '12 minutes');
