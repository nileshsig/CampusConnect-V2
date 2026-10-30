// Official Knowledge Base for Vinoba Bhave University (Hazaribagh)
// Trained on University Documents, Faculty Directory, Fee Schedules, Academic Rules, and Safety

export interface KnowledgeChunk {
  id: string;
  category: 'document' | 'faculty' | 'safety' | 'fees' | 'wellness' | 'campus';
  title: string;
  source: string;
  keywords: string[];
  content: string;
}

export const UNIVERSITY_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // 1. Placement Documents
  {
    id: 'kb-placement-1',
    category: 'document',
    title: 'University Campus Placement Statistics Report 2025-26',
    source: 'University Campus Placement Statistics Report 2025-26 (Training & Placement Cell)',
    keywords: ['placement', 'package', 'salary', 'highest', 'median', 'average', 'recruiter', 'company', 'tcs', 'infosys', 'wipro', 'jobs', 'alok verma'],
    content: `Vinoba Bhave University Campus Placement Statistics 2025-26:
- Highest Placement Package: INR 14.5 Lakhs per Annum (LPA) offered by TCS Digital and Infosys Specialist Program.
- Median Compensation Package: INR 5.2 Lakhs per Annum (LPA).
- Overall Student Placement Rate: 84.6% across Computer Science, Electronics, and Mechanical streams.
- Major Recruiting Companies: Tata Consultancy Services (TCS), Wipro, Infosys, Tech Mahindra, Vedanta Resources, Cognizant, and Coal India Limited.
- Department with Highest Offers: Computer Science & Engineering (92% placed), followed by Electronics & Communication (81%).
- Training & Placement Officer: Prof. Alok Verma.
- Placement Office Location: Senate Hall Ground Floor, Room 14.
- Contact: placements@vbu.ac.in, Phone: +91-9876543244. Office hours: 11:00 AM to 4:00 PM (Monday to Friday).`,
  },

  // 2. Study Materials: CS401 Operating Systems
  {
    id: 'kb-study-os',
    category: 'document',
    title: 'CS401 Operating Systems Lecture Notes & Lab Manual',
    source: 'CS401 Operating Systems Lecture Notes & Lab Manual by Dr. S. Prasad',
    keywords: ['operating systems', 'cs401', 'prasad', 'syllabus', 'notes', 'study material', 'processes', 'threads', 'semaphore', 'deadlock', 'paging', 'lab manual'],
    content: `CS401 Operating Systems Course Details & Study Materials:
- Course Instructor: Dr. S. Prasad (Head of Computer Science & Engineering).
- Key Syllabus Topics Covered in Document:
  1. Process Management: Process control block (PCB), context switching, CPU scheduling algorithms (FCFS, Round Robin, Priority, Shortest Job First).
  2. Concurrency & Synchronization: Critical section problem, Peterson's algorithm, Semaphores, Mutex locks, Classical IPC problems (Producer-Consumer, Dining Philosophers).
  3. Deadlocks: Characterization, Banker's Algorithm for deadlock avoidance, resource allocation graph, deadlock detection and recovery.
  4. Memory Management: Paging, segmentation, virtual memory, demand paging, FIFO, LRU, and Optimal page replacement policies.
  5. Storage & File Systems: Disk scheduling (SCAN, C-SCAN, LOOK), file allocation methods.
- Practical Lab Submissions: Weekly lab assignments must be submitted on Fridays in Teaching Block Room 201 before 4:00 PM.
- Mid-semester examination weightage: 30 marks theory, 20 marks practical assessment.`,
  },

  // 3. Rules & Regulations: Student Code of Conduct & Anti-Ragging
  {
    id: 'kb-ragging-ordinance',
    category: 'document',
    title: 'Student Code of Conduct & Anti-Ragging Statutory Ordinance',
    source: 'VBU Student Code of Conduct & Anti-Ragging Statutory Ordinance (Office of the Principal)',
    keywords: ['ragging', 'anti-ragging', 'complaint', 'ordinance', 'rules', 'regulation', 'conduct', 'discipline', 'punishment', 'helpline', 'committee', 'principal'],
    content: `Vinoba Bhave University Anti-Ragging Policy & Statutory Ordinance:
- Anti-Ragging Policy: Zero tolerance policy in strict compliance with University Grants Commission (UGC) Regulations 2009 and Supreme Court directives.
- What constitutes ragging: Any disorderly conduct, verbal abuse, physical harassment, forced tasks, asking freshers to perform unauthorized drills, or financial extortion in classrooms, hostels, or campus premises.
- Statutory Penalties for Offenders: Suspension from classes and hostels, cancellation of admission, withholding examination results, debarment from campus recruitment, and mandatory lodging of First Information Report (FIR) under IPC with Jharkhand State Police.
- Anti-Ragging Committee Head: Prof. Dr. R. K. Sharma (Principal).
- National 24/7 Anti-Ragging Helpline (Toll-Free): 1800-180-5522.
- Anti-Ragging National Portal Email: helpline@antiragging.in.
- Campus Quick Response Security Post: 06546-261234.
- Confidential & Anonymous Reporting: Students can submit anonymous reports directly via the Campus Connect Anti-Ragging Portal (/ragging). All complaints are reviewed by the dedicated Anti-Ragging Squad within 2 hours.`,
  },

  // 4. University Application Forms: Concessions & Verification
  {
    id: 'kb-forms-concession',
    category: 'document',
    title: 'Student Railway & Bus Concession Certificate Application Form',
    source: 'University Application Forms Repository: Concession Certificates (Student Welfare Section)',
    keywords: ['concession', 'railway', 'bus', 'travel', 'form', 'holiday', 'vacation', 'discount', 'welfare'],
    content: `Student Travel Concession Procedure:
- Purpose: Application for Indian Railways and State Road Transport bus fare concessions for traveling to hometown during vacation or educational tours.
- Eligibility: Regular full-time enrolled undergraduate and postgraduate students with no outstanding semester dues.
- Required Documents: Duly filled concession application form, current semester fee payment receipt, and valid student identity card copy.
- Submission Office: Student Welfare Section, Administrative Block Room 108.
- Processing Time: 3 working days from submission.`,
  },
  {
    id: 'kb-forms-verification',
    category: 'document',
    title: 'Grade Card, Migration Certificate & Document Verification',
    source: 'University Examination Division Regulations: Certificate Verification',
    keywords: ['grade card', 'marksheet', 'duplicate', 'migration', 'certificate', 'degree', 'verification', 'transcript'],
    content: `University Examination Division Document Verification & Duplicate Records:
- Duplicate Grade Sheet Fee: INR 200 per semester card payable via university bank counter.
- Migration Certificate: Requires surrender of original registration slip and clearance certificate from central library and hostel warden.
- Processing Time: 7 working days for migration certificates, 10 working days for duplicate degree certificates.
- Office: Registrar Examination Division, Ground Floor Room 12. Office hours: 10:30 AM to 3:00 PM.`,
  },

  // 5. Faculty & Staff Directory Contacts
  {
    id: 'kb-fac-principal',
    category: 'faculty',
    title: 'Prof. Dr. R. K. Sharma (Principal & Professor)',
    source: 'Faculty & Staff Directory: Principal Office',
    keywords: ['principal', 'sharma', 'r k sharma', 'head', 'vc', 'physics', 'director'],
    content: `Prof. Dr. R. K. Sharma:
- Designation: Principal & Professor of Physics.
- Department: Administrative Block & Department of Physics.
- Email: principal@vbu.ac.in.
- Telephone: +91-6546-261234.
- Cabin Location: Principal Office, Administrative Block Ground Floor.
- Student Consultation Hours: 11:00 AM to 1:00 PM (Monday to Friday).
- Academic Subjects: Solid State Physics, Quantum Mechanics.`,
  },
  {
    id: 'kb-fac-prasad',
    category: 'faculty',
    title: 'Dr. S. Prasad (Head of Computer Science & Engineering)',
    source: 'Faculty & Staff Directory: Computer Science Department',
    keywords: ['prasad', 'hod', 'computer science', 'cse', 'operating systems', 'dsa', 'data structures'],
    content: `Dr. S. Prasad:
- Designation: Head of Department (HOD) & Associate Professor.
- Department: Computer Science & Engineering.
- Email: prasad@vbu.ac.in.
- Mobile / Phone: +91-9876543211.
- Cabin Location: Teaching Block, Room 201 (Second Floor).
- Student Consultation Hours: 2:00 PM to 4:00 PM (Tuesday and Thursday).
- Subjects Taught: Operating Systems, Data Structures & Algorithms.`,
  },
  {
    id: 'kb-fac-ananya',
    category: 'faculty',
    title: 'Dr. Ananya Sen (Assistant Professor - CSE)',
    source: 'Faculty & Staff Directory: Computer Science Department',
    keywords: ['ananya', 'sen', 'dbms', 'database', 'software engineering', 'assistant professor'],
    content: `Dr. Ananya Sen:
- Designation: Assistant Professor.
- Department: Computer Science & Engineering.
- Email: ananya.sen@vbu.ac.in.
- Mobile: +91-9876543222.
- Cabin Location: Teaching Block, Room 206 (Second Floor).
- Student Consultation Hours: 10:00 AM to 12:00 PM (Wednesday and Friday).
- Subjects Taught: Database Management Systems (DBMS), Software Engineering.`,
  },
  {
    id: 'kb-fac-mishra',
    category: 'faculty',
    title: 'Dr. Manoj Mishra (Dean of Sciences & Professor of Chemistry)',
    source: 'Faculty & Staff Directory: Chemistry Department',
    keywords: ['mishra', 'dean', 'chemistry', 'science', 'environmental'],
    content: `Dr. Manoj Mishra:
- Designation: Professor & Dean of Sciences.
- Department: Department of Chemistry.
- Email: m.mishra@vbu.ac.in.
- Mobile: +91-9876543233.
- Cabin Location: Chemistry Block, Room 105 (First Floor).
- Consultation Hours: 1:00 PM to 3:00 PM (Monday and Wednesday).
- Subjects Taught: Organic Chemistry, Environmental Sciences.`,
  },
  {
    id: 'kb-fac-counselor',
    category: 'faculty',
    title: 'Dr. Sunita Roy (Campus Student Counselor & Psychologist)',
    source: 'Faculty & Staff Directory: Student Welfare & Counseling Centre',
    keywords: ['counselor', 'psychologist', 'sunita roy', 'mental health', 'therapy', 'stress', 'anxiety'],
    content: `Dr. Sunita Roy:
- Designation: Campus Student Counselor & Licensed Clinical Psychologist.
- Department: Student Welfare & Counseling Centre.
- Email: counselor@vbu.ac.in.
- Direct Helpline: +91-9876543299.
- Cabin Location: Health & Wellness Centre, Room 12.
- Consultation Hours: 9:00 AM to 5:00 PM (Monday to Saturday, Free confidential walk-in or booked appointment).
- Areas of Support: Exam stress management, anxiety, depression, adjustment issues, academic burnout, and career counseling.`,
  },
  {
    id: 'kb-fac-verma',
    category: 'faculty',
    title: 'Prof. Alok Verma (Training and Placement Officer)',
    source: 'Faculty & Staff Directory: Placement Cell',
    keywords: ['placement officer', 'alok verma', 'recruitment', 'internship', 'training'],
    content: `Prof. Alok Verma:
- Designation: Placement Officer & Associate Professor.
- Department: Training and Placement Cell.
- Email: placements@vbu.ac.in.
- Phone: +91-9876543244.
- Cabin Location: Senate Hall Placement Office, Room 14.
- Consultation Hours: 11:00 AM to 4:00 PM (Monday through Friday).
- Specialization: Industry partnerships, campus recruitment drives, student internships.`,
  },

  // 6. Mental Health & Support Services
  {
    id: 'kb-mental-health',
    category: 'wellness',
    title: 'Student Mental Health & Wellness Services',
    source: 'Student Health & Wellness Centre Guidelines',
    keywords: ['mental health', 'tele-manas', 'counseling', 'psychologist', '14416', 'breathing', 'stress', 'depression', 'wellness'],
    content: `Vinoba Bhave University Student Mental Health Services:
- Tele-MANAS Government of India 24/7 Helpline: 14416 (Toll-Free national psychiatric & psychological emergency service).
- On-Campus Psychologist Appointments: Free confidential 45-minute counseling sessions available with Dr. Sunita Roy or Dr. Rajesh Kumar via the Campus Connect Wellness Portal (/wellness).
- Privacy Guarantee: Consultations are strictly confidential and are not recorded on student academic transcripts.
- Interactive Relaxation Tools: Guided 4-7-8 breathing relaxation pacing and daily private mood logs available on the app.
- Location: Health & Wellness Centre, Ground Floor Room 12 (adjacent to Campus Pharmacy).`,
  },

  // 7. Student Fee Structure & Schedules
  {
    id: 'kb-fee-structure',
    category: 'fees',
    title: 'Vinoba Bhave University Student Fee Structure & Payment Guidelines',
    source: 'University Accounts & Finance Division Fee Schedule 2025-26',
    keywords: ['fee', 'tuition', 'hostel', 'examination', 'library', 'amount', 'due date', 'fine', 'late fee', 'payment'],
    content: `Vinoba Bhave University Fee Structure (Academic Year 2025-26):
- B.Tech Tuition Fee: INR 18,500 per semester (due within 15 days of semester commencement).
- Hostel & Mess Charges: INR 9,200 per semester (includes lodging, electricity, water, and mess charges).
- Semester Examination Fee: INR 1,400 per semester (Upcoming due date: November 15, 2026).
- Central Library Annual Fee: INR 500 per year.
- Payment Methods Accepted:
  1. Online Payment via Campus Connect Student Portal (/fees) using UPI, Debit Card, or NetBanking. Instant receipt generated.
  2. Offline Payment: Bank Demand Draft (in favor of "Registrar, Vinoba Bhave University") or Campus Bank Cash Challan at Central Bank of India campus branch.
- Late Fee Policy: A fine of INR 50 per day applies after the specified due date until cleared. Admit cards are issued only upon clearing all fee dues.`,
  },

  // 8. Campus Timings & Infrastructure
  {
    id: 'kb-campus-timings',
    category: 'campus',
    title: 'University Campus Timings, Library & Infrastructure',
    source: 'Vinoba Bhave University Campus Handbook & Administration',
    keywords: ['timings', 'library hours', 'campus hours', 'location', 'address', 'gate', 'security', 'canteen'],
    content: `Campus Infrastructure & Operating Timings:
- Campus Address: Vinoba Bhave University, Sindoor, Hazaribagh, Jharkhand 825301.
- Academic Blocks: Open from 8:30 AM to 5:30 PM (Monday to Saturday).
- Central Library Timings: 8:00 AM to 9:00 PM (Monday to Saturday). Extended till 11:00 PM during semester examination weeks.
- Computer Center & High-Performance Lab: Open 9:00 AM to 7:00 PM.
- Campus Security Control Post: 24 hours / 7 days operational (Phone: 06546-261234, National Police: 112).
- Student Cafeteria & Canteen: Open 8:00 AM to 8:30 PM.
- Campus Health Clinic & Pharmacy: 8:30 AM to 6:00 PM (Emergency nurse available 24/7).`,
  },
];

// Helper to retrieve the most relevant knowledge chunks for a query
export function retrieveKnowledgeChunks(query: string, topK = 3): KnowledgeChunk[] {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleanQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = UNIVERSITY_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();

    for (const word of words) {
      if (chunk.keywords.some((k) => k.includes(word) || word.includes(k))) {
        score += 8;
      }
      if (titleLower.includes(word)) {
        score += 5;
      }
      if (contentLower.includes(word)) {
        score += 2;
      }
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return topK chunks that have at least some match, or top 2 default chunks if score is low
  const positive = scored.filter((s) => s.score > 0);
  if (positive.length > 0) {
    return positive.slice(0, topK).map((s) => s.chunk);
  }

  // Fallback: return general overview chunks
  return [UNIVERSITY_KNOWLEDGE_BASE[0], UNIVERSITY_KNOWLEDGE_BASE[2]];
}
