// StudyVault Production-Grade Mock Data

export const MOCK_USER = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@college.edu',
  role: 'student', // 'student' | 'teacher'
  department: 'Computer Science & Engineering',
  semester: 6,
  college: 'National Institute of Technology',
  avatarInitials: 'AS',
  studyGoalProgress: 68,
};

export const MOCK_TEACHER = {
  id: 'tch_101',
  name: 'Dr. Sarah Thomas',
  email: 'sarah.thomas@college.edu',
  role: 'teacher',
  department: 'Computer Science & Engineering',
  designation: 'Professor & Head of Dept',
  avatarInitials: 'ST',
};

export const MOCK_SUBJECTS = [
  {
    id: 'sub_dbms',
    code: 'CS301',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    semester: 6,
    materialCount: 38,
    verifiedCount: 12,
    color: 'blue',
    icon: 'Database',
  },
  {
    id: 'sub_os',
    code: 'CS302',
    name: 'Operating Systems',
    shortName: 'OS',
    semester: 6,
    materialCount: 32,
    verifiedCount: 9,
    color: 'indigo',
    icon: 'Cpu',
  },
  {
    id: 'sub_cn',
    code: 'CS303',
    name: 'Computer Networks',
    shortName: 'Networks',
    semester: 6,
    materialCount: 24,
    verifiedCount: 7,
    color: 'emerald',
    icon: 'Globe',
  },
  {
    id: 'sub_se',
    code: 'CS304',
    name: 'Software Engineering',
    shortName: 'SE',
    semester: 6,
    materialCount: 16,
    verifiedCount: 4,
    color: 'purple',
    icon: 'Layers',
  },
  {
    id: 'sub_dsa',
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    semester: 4,
    materialCount: 42,
    verifiedCount: 15,
    color: 'amber',
    icon: 'GitFork',
  },
  {
    id: 'sub_web',
    code: 'CS305',
    name: 'Web Development',
    shortName: 'Web Dev',
    semester: 6,
    materialCount: 19,
    verifiedCount: 5,
    color: 'cyan',
    icon: 'Code',
  },
];

export const MOCK_MATERIALS = [
  {
    id: 'mat_01',
    title: 'DBMS Unit 3 Normalization Complete Notes',
    filename: 'DBMS_Unit3_Normalization.pdf',
    subject: 'Database Management Systems',
    subjectCode: 'CS301',
    unit: 'Unit 3',
    topic: 'Normalization',
    type: 'pdf', // 'pdf' | 'notes' | 'image' | 'link' | 'video' | 'question-paper' | 'ppt'
    fileSize: 2457600, // 2.4 MB
    uploadedDate: '2026-03-22',
    uploadedBy: 'Prof. Sarah Thomas',
    source: 'Faculty Portal',
    isTeacherVerified: true,
    teacherName: 'Dr. Sarah Thomas',
    verificationDate: '2026-03-23',
    healthScore: 94,
    examImportance: 5,
    viewCount: 342,
    downloadCount: 189,
    isBookmarked: true,
    tags: ['Normalization', '1NF', '2NF', '3NF', 'BCNF', 'Functional Dependencies'],
    summary: 'Comprehensive lecture notes covering database normalization anomalies, functional dependency preservation, Armstrong axioms, 3NF synthesis, and lossless join decomposition with step-by-step exam proofs.',
    keyConcepts: [
      'Functional Dependency (FD) and Closure',
      'Armstrong Axioms (Reflexivity, Augmentation, Transitivity)',
      '1NF: Eliminating repeating groups & multi-valued attributes',
      '2NF: Eliminating partial dependency on primary key candidate',
      '3NF: Removing transitive dependencies (A → B, B → C)',
      'BCNF (Boyce-Codd): Determinant must be a super key',
      'Lossless Join Decomposition algorithm'
    ],
    matchReasons: 'Matched because this document contains dedicated sections for 3NF vs BCNF comparisons, closure tests, and university exam step-by-step algorithms.',
  },
  {
    id: 'mat_02',
    title: 'Deadlock Prevention, Avoidance & Banker’s Algorithm Handout',
    filename: 'OS_Unit4_Deadlocks.pdf',
    subject: 'Operating Systems',
    subjectCode: 'CS302',
    unit: 'Unit 4',
    topic: 'Deadlock',
    type: 'pdf',
    fileSize: 1887436, // 1.8 MB
    uploadedDate: '2026-03-24',
    uploadedBy: 'Rahul Verma',
    source: 'Class WhatsApp Group',
    isTeacherVerified: true,
    teacherName: 'Prof. A. Nambiar',
    verificationDate: '2026-03-25',
    healthScore: 96,
    examImportance: 5,
    viewCount: 420,
    downloadCount: 260,
    isBookmarked: true,
    tags: ['Deadlocks', 'Bankers Algorithm', 'Resource Allocation Graph', 'Safety Algorithm'],
    summary: 'Detailed explanation of the 4 Coffman deadlock conditions, Resource Allocation Graph (RAG) cycle detection, Banker’s Safety Algorithm with matrices, and recovery mechanisms.',
    keyConcepts: [
      'Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait',
      'Resource Allocation Graph (RAG) with single vs multiple resource units',
      'Banker’s Algorithm: Allocation, Max, Available, Need matrix computation',
      'Deadlock Detection and Recovery through Process Termination'
    ],
    matchReasons: 'Matched because this document directly details deadlock prevention, Banker’s safety algorithm tables, and resource allocation cycle checks.',
  },
  {
    id: 'mat_03',
    title: 'TCP vs UDP Header Format & 3-Way Handshake Architecture',
    filename: 'Networks_Transport_Layer_TCP.pdf',
    subject: 'Computer Networks',
    subjectCode: 'CS303',
    unit: 'Unit 4',
    topic: 'Transport Layer Protocols',
    type: 'pdf',
    fileSize: 3145728, // 3.1 MB
    uploadedDate: '2026-03-18',
    uploadedBy: 'Ananya Pillai',
    source: 'Telegram Batch',
    isTeacherVerified: true,
    teacherName: 'Dr. Sarah Thomas',
    verificationDate: '2026-03-19',
    healthScore: 91,
    examImportance: 4,
    viewCount: 295,
    downloadCount: 140,
    isBookmarked: false,
    tags: ['TCP', 'UDP', 'Handshake', 'Flow Control', 'Sliding Window'],
    summary: 'Technical breakdown of transport layer protocols including TCP header bitfields, 3-way SYN-ACK handshake sequence, TCP Reno congestion avoidance, and UDP audio/video streaming benefits.',
    keyConcepts: [
      'TCP 20-byte header structure (Sequence numbers, Flags SYN/ACK/FIN/RST)',
      'Connection establishment: 3-Way Handshake with ISN (Initial Seq Number)',
      'Flow Control using Sliding Window Protocol',
      'TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit)'
    ],
    matchReasons: 'Matched because this document covers TCP 3-way handshake diagrams, flow control window equations, and packet header structures.',
  },
  {
    id: 'mat_04',
    title: 'DBMS Normalization Handwritten Formula Sheet & Cheatsheet',
    filename: 'IMG_2026_09_23_Normalization.jpg',
    subject: 'Database Management Systems',
    subjectCode: 'CS301',
    unit: 'Unit 3',
    topic: 'Normalization',
    type: 'image',
    fileSize: 1048576, // 1.0 MB
    uploadedDate: '2026-03-25',
    uploadedBy: 'Arjun Sharma',
    source: 'WhatsApp Camera Upload',
    isTeacherVerified: false,
    teacherName: null,
    verificationDate: null,
    healthScore: 82,
    examImportance: 4,
    viewCount: 110,
    downloadCount: 45,
    isBookmarked: false,
    tags: ['Cheatsheet', 'Formula', 'FD Rules', 'Decomposition'],
    summary: 'High-contrast handwritten notes summarizing decomposition formulas, functional dependency closure calculation steps, and table decomposition examples for quick 15-minute exam revision.',
    keyConcepts: [
      'Closure of Attribute Set X+ Algorithm',
      'Canonical Cover derivation rules',
      'Quick checklist for 1NF -> 2NF -> 3NF -> BCNF'
    ],
    matchReasons: 'Matched because this handwritten image sheet contains compact formula summaries for calculating attribute closures and identifying prime attributes.',
  },
  {
    id: 'mat_05',
    title: 'Operating Systems Previous Year University Solved Question Paper',
    filename: 'OS_EndSem_Solved_PYQ_2025.pdf',
    subject: 'Operating Systems',
    subjectCode: 'CS302',
    unit: 'All Units',
    topic: 'University Exam Papers',
    type: 'question-paper',
    fileSize: 4194304, // 4.2 MB
    uploadedDate: '2026-03-10',
    uploadedBy: 'Exam Cell Archive',
    source: 'College Portal',
    isTeacherVerified: true,
    teacherName: 'Prof. A. Nambiar',
    verificationDate: '2026-03-11',
    healthScore: 98,
    examImportance: 5,
    viewCount: 880,
    downloadCount: 650,
    isBookmarked: true,
    tags: ['PYQ', 'Solved', 'University Exam', 'Model Answers'],
    summary: 'Official end-semester question paper with model marking scheme and university standard answers for CPU scheduling, paging tables, Semaphore implementation, and disk scheduling.',
    keyConcepts: [
      'Dining Philosophers Problem with Semaphores',
      'Page Replacement Algorithms: FIFO, LRU, Optimal simulation tables',
      'CPU Scheduling comparison: Round Robin vs Shortest Job First (SJF)'
    ],
    matchReasons: 'Matched because this solved question paper contains direct 15-mark questions on deadlock avoidance, paging hardware, and semaphore synchronization.',
  },
  {
    id: 'mat_06',
    title: 'Subnetting, CIDR & IP Addressing Lecture Slides',
    filename: 'CN_Unit2_Subnetting_CIDR.ppt',
    subject: 'Computer Networks',
    subjectCode: 'CS303',
    unit: 'Unit 2',
    topic: 'Network Layer Addressing',
    type: 'ppt',
    fileSize: 5242880, // 5.0 MB
    uploadedDate: '2026-03-14',
    uploadedBy: 'Prof. Meenakshi Sundaram',
    source: 'Faculty Portal',
    isTeacherVerified: true,
    teacherName: 'Prof. M. Sundaram',
    verificationDate: '2026-03-15',
    healthScore: 95,
    examImportance: 4,
    viewCount: 310,
    downloadCount: 160,
    isBookmarked: false,
    tags: ['Subnetting', 'CIDR', 'IPv4', 'Subnet Mask', 'FLSM', 'VLSM'],
    summary: 'Slide presentation with animated diagrams for classful IPv4 addressing, FLSM (Fixed Length) and VLSM (Variable Length) subnet partitioning, and default routing table lookups.',
    keyConcepts: [
      'Class A, B, C network ID and host ID boundaries',
      'Subnet Mask calculation and binary ANDing',
      'CIDR prefix slash notation (/24, /26, /28)',
      'Subnet broadcast address and usable host range calculations'
    ],
    matchReasons: 'Matched because these slides contain step-by-step numeric walkthroughs of university subnetting problems.',
  },
  {
    id: 'mat_07',
    title: 'Stanford YouTube Lecture Series: Concurrency & Lock Scheduling',
    filename: 'https://youtube.com/watch?v=sample_stanford_dbms',
    subject: 'Database Management Systems',
    subjectCode: 'CS301',
    unit: 'Unit 4',
    topic: 'Transactions & Concurrency',
    type: 'video',
    fileSize: 0,
    uploadedDate: '2026-03-21',
    uploadedBy: 'Kavita Nair',
    source: 'Class Study Group',
    isTeacherVerified: false,
    teacherName: null,
    verificationDate: null,
    healthScore: 88,
    examImportance: 4,
    viewCount: 185,
    downloadCount: 0,
    isBookmarked: false,
    tags: ['ACID', 'Two Phase Locking', 'Serializability', 'Timestamp Ordering'],
    summary: 'Curated 45-minute video lecture illustrating strict Two-Phase Locking (2PL), conflict serializability precedence graphs, and phantom read prevention.',
    keyConcepts: [
      'ACID Properties (Atomicity, Consistency, Isolation, Durability)',
      'Conflict Serializability vs View Serializability',
      'Precedence Graph (Cycle indicates non-serializable)',
      'Two-Phase Locking (Growing phase & Shrinking phase)'
    ],
    matchReasons: 'Matched because this video demonstrates lock scheduling conflicts, cascading aborts, and recoverability.',
  },
  {
    id: 'mat_08',
    title: 'Virtual Memory & Multi-Level Page Table Translation Notes',
    filename: 'OS_Unit5_Paging_Virtual_Memory.pdf',
    subject: 'Operating Systems',
    subjectCode: 'CS302',
    unit: 'Unit 5',
    topic: 'Memory Management',
    type: 'notes',
    fileSize: 2202009, // 2.1 MB
    uploadedDate: '2026-03-12',
    uploadedBy: 'Siddharth Roy',
    source: 'Class WhatsApp Group',
    isTeacherVerified: true,
    teacherName: 'Prof. A. Nambiar',
    verificationDate: '2026-03-16',
    healthScore: 93,
    examImportance: 5,
    viewCount: 390,
    downloadCount: 215,
    isBookmarked: false,
    tags: ['Paging', 'TLB', 'Page Fault', 'Page Table', 'Inverted Page Table'],
    summary: 'Class notes breaking down logical to physical address translation with MMU and Translation Lookaside Buffer (TLB), effective memory access time calculations, and multi-level paging schemes.',
    keyConcepts: [
      'Page Number (p) and Page Offset (d) translation',
      'TLB hit ratio & Effective Access Time (EAT) formulas',
      'Internal vs External Fragmentation comparison',
      'Inverted Page Tables and Two-Level Paging architectures'
    ],
    matchReasons: 'Matched because this document contains mathematical memory access time numericals and TLB architecture diagrams.',
  },
  {
    id: 'mat_09',
    title: 'B+ Tree Indexing & Query Optimization Algorithms',
    filename: 'DBMS_Unit5_BPlusTree_Indexing.pdf',
    subject: 'Database Management Systems',
    subjectCode: 'CS301',
    unit: 'Unit 5',
    topic: 'Indexing & Hashing',
    type: 'pdf',
    fileSize: 2726297, // 2.6 MB
    uploadedDate: '2026-03-19',
    uploadedBy: 'Prof. Sarah Thomas',
    source: 'Faculty Portal',
    isTeacherVerified: true,
    teacherName: 'Dr. Sarah Thomas',
    verificationDate: '2026-03-20',
    healthScore: 97,
    examImportance: 5,
    viewCount: 330,
    downloadCount: 195,
    isBookmarked: true,
    tags: ['B+ Tree', 'Dense Index', 'Sparse Index', 'Query Execution Plan'],
    summary: 'Detailed explanation of multi-level indexing structures, insertion and deletion rebalancing in B+ trees, linked leaf node traversals for range queries, and disk I/O estimation.',
    keyConcepts: [
      'B-Tree vs B+ Tree structural differences',
      'Node split and merge criteria based on order m',
      'Clustered vs Non-Clustered index comparison',
      'Cost estimation of table scans vs index scans'
    ],
    matchReasons: 'Matched because this resource includes complete step-by-step node splitting diagrams for insertion into order-4 B+ trees.',
  },
  {
    id: 'mat_10',
    title: 'Agile Scrum Framework & Sprint Planning Guidelines',
    filename: 'SE_Unit2_Agile_Scrum_Model.pdf',
    subject: 'Software Engineering',
    subjectCode: 'CS304',
    unit: 'Unit 2',
    topic: 'Agile Process Models',
    type: 'pdf',
    fileSize: 1572864, // 1.5 MB
    uploadedDate: '2026-03-05',
    uploadedBy: 'Vikram Joshi',
    source: 'Class Study Group',
    isTeacherVerified: false,
    teacherName: null,
    verificationDate: null,
    healthScore: 84,
    examImportance: 3,
    viewCount: 140,
    downloadCount: 65,
    isBookmarked: false,
    tags: ['Agile', 'Scrum', 'Sprint', 'User Stories', 'Kanban'],
    summary: 'Overview of Agile manifesto values, Scrum ceremonies (Sprint planning, Daily standup, Sprint review, Retrospective), and burndown chart metrics.',
    keyConcepts: [
      'Agile Manifesto 4 core values & 12 principles',
      'Scrum Roles: Product Owner, Scrum Master, Development Team',
      'Sprint backlog grooming and velocity tracking'
    ],
    matchReasons: 'Matched because this document contrasts traditional Waterfall with iterative Agile development cycles.',
  },
  {
    id: 'mat_11',
    title: 'Graph Algorithms: Dijkstra, Bellman-Ford & Floyd-Warshall',
    filename: 'DSA_Unit4_Graph_Shortest_Paths.pdf',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS201',
    unit: 'Unit 4',
    topic: 'Graph Algorithms',
    type: 'pdf',
    fileSize: 3670016, // 3.5 MB
    uploadedDate: '2026-02-28',
    uploadedBy: 'Prof. Anirudh Sen',
    source: 'Faculty Portal',
    isTeacherVerified: true,
    teacherName: 'Prof. A. Sen',
    verificationDate: '2026-03-01',
    healthScore: 99,
    examImportance: 5,
    viewCount: 620,
    downloadCount: 410,
    isBookmarked: true,
    tags: ['Graphs', 'Dijkstra', 'Bellman Ford', 'Shortest Path', 'Dynamic Programming'],
    summary: 'Rigorous analysis of single-source and all-pairs shortest path algorithms, handling of negative weight edges and cycle detection, time and space complexity proofs.',
    keyConcepts: [
      'Dijkstra Greedy Algorithm with Min-Heap O((V + E) log V)',
      'Bellman-Ford Algorithm with edge relaxation for negative cycles',
      'Floyd-Warshall All-Pairs matrix dynamic programming'
    ],
    matchReasons: 'Matched because this document provides pseudo-code, trace tables, and asymptotic proof comparisons.',
  },
  {
    id: 'mat_12',
    title: 'React 19 Hooks, Fiber Reconciliation & State Flow Reference',
    filename: 'WebDev_React_Architecture.pdf',
    subject: 'Web Development',
    subjectCode: 'CS305',
    unit: 'Unit 3',
    topic: 'Modern Frontend Frameworks',
    type: 'pdf',
    fileSize: 2097152, // 2.0 MB
    uploadedDate: '2026-03-20',
    uploadedBy: 'Arjun Sharma',
    source: 'Dev Community Link',
    isTeacherVerified: false,
    teacherName: null,
    verificationDate: null,
    healthScore: 87,
    examImportance: 3,
    viewCount: 220,
    downloadCount: 95,
    isBookmarked: false,
    tags: ['React', 'Virtual DOM', 'Reconciliation', 'Hooks', 'State Management'],
    summary: 'Modern frontend development reference explaining Virtual DOM diffing algorithms, fiber tree node structures, closure pitfalls in useEffect, and server component concepts.',
    keyConcepts: [
      'Virtual DOM reconciliation algorithm heuristic O(n)',
      'Fiber scheduler priority phases: Render vs Commit',
      'Custom hooks implementation and Context API'
    ],
    matchReasons: 'Matched because this document contains clean diagrams of component lifecycle and state updates.',
  },
];

export const MOCK_REVISION_TASKS = [
  {
    id: 'rev_01',
    title: 'DBMS Normalization & BCNF Proofs',
    subject: 'Database Management Systems',
    unit: 'Unit 3',
    difficulty: 'Medium',
    scheduledFor: 'Today',
    lastStudied: '3 days ago',
    materialId: 'mat_01',
    masteryPercentage: 72,
    status: 'pending', // 'pending' | 'completed'
    keyPoints: [
      'Review conditions for 3NF (transitive dependency removal)',
      'Understand Boyce-Codd Normal Form determinant rule',
      'Solve 2 decomposition questions from 2025 PYQ'
    ],
  },
  {
    id: 'rev_02',
    title: 'Deadlock Banker’s Safety Algorithm Numericals',
    subject: 'Operating Systems',
    unit: 'Unit 4',
    difficulty: 'Hard',
    scheduledFor: 'Today',
    lastStudied: '2 days ago',
    materialId: 'mat_02',
    masteryPercentage: 58,
    status: 'pending',
    keyPoints: [
      'Recalculate Need Matrix = Max - Allocation',
      'Trace safe sequence path with Available vector',
      'Identify whether resource request can be granted immediately'
    ],
  },
  {
    id: 'rev_03',
    title: 'TCP 3-Way Handshake & State Transition Diagram',
    subject: 'Computer Networks',
    unit: 'Unit 4',
    difficulty: 'Easy',
    scheduledFor: 'Today',
    lastStudied: '5 days ago',
    materialId: 'mat_03',
    masteryPercentage: 88,
    status: 'completed',
    keyPoints: [
      'SYN, SYN-ACK, ACK packet exchange sequence',
      'TIME_WAIT state rationale in socket closing',
      'Sequence number synchronization under packet loss'
    ],
  },
  {
    id: 'rev_04',
    title: 'B+ Tree Indexing Node Split Operations',
    subject: 'Database Management Systems',
    unit: 'Unit 5',
    difficulty: 'Hard',
    scheduledFor: 'Tomorrow',
    lastStudied: '4 days ago',
    materialId: 'mat_09',
    masteryPercentage: 45,
    status: 'pending',
    keyPoints: [
      'Order of tree properties (minimum & maximum keys per node)',
      'Leaf node overflow handling vs internal node overflow',
      'Range query pointer traversal along leaf linked list'
    ],
  },
  {
    id: 'rev_05',
    title: 'Page Replacement Algorithms (FIFO, LRU, Optimal)',
    subject: 'Operating Systems',
    unit: 'Unit 5',
    difficulty: 'Medium',
    scheduledFor: 'In 2 days',
    lastStudied: '6 days ago',
    materialId: 'mat_08',
    masteryPercentage: 80,
    status: 'pending',
    keyPoints: [
      'Belady’s Anomaly demonstration in FIFO',
      'Stack algorithm properties of LRU',
      'Hit ratio calculation over 12-frame reference strings'
    ],
  },
  {
    id: 'rev_06',
    title: 'CIDR Subnet Masking Numerical Problems',
    subject: 'Computer Networks',
    unit: 'Unit 2',
    difficulty: 'Medium',
    scheduledFor: 'In 3 days',
    lastStudied: '1 week ago',
    materialId: 'mat_06',
    masteryPercentage: 65,
    status: 'pending',
    keyPoints: [
      'Determining network ID by bitwise AND operation',
      'Calculating total usable hosts: 2^(32-prefix) - 2',
      'VLSM hierarchical IP address block allocation'
    ],
  },
  {
    id: 'rev_07',
    title: 'Dijkstra Shortest Path Greedy Algorithm Proof',
    subject: 'Data Structures & Algorithms',
    unit: 'Unit 4',
    difficulty: 'Hard',
    scheduledFor: 'In 4 days',
    lastStudied: '1 week ago',
    materialId: 'mat_11',
    masteryPercentage: 50,
    status: 'pending',
    keyPoints: [
      'Greedy choice property why negative edges break Dijkstra',
      'Fibonacci heap vs Binary heap time complexities',
      'Path reconstruction from predecessor array'
    ],
  },
];

export const MOCK_WEEKLY_REVISION = [
  { day: 'Mon', count: 6, label: '6 reviews' },
  { day: 'Tue', count: 4, label: '4 reviews' },
  { day: 'Wed', count: 8, label: '8 reviews' },
  { day: 'Thu', count: 3, label: '3 reviews' },
  { day: 'Fri', count: 7, label: '7 reviews' },
  { day: 'Sat', count: 5, label: '5 reviews' },
  { day: 'Sun', count: 2, label: '2 reviews' },
];

export const MOCK_KNOWLEDGE_MAP = {
  dbms: {
    subject: 'Database Management Systems',
    root: 'DBMS Core Architecture',
    nodes: [
      { id: '1', title: 'ER & Relational Model', level: 1, parent: null },
      { id: '2', title: 'Functional Dependencies', level: 2, parent: '1' },
      { id: '3', title: 'Normalization', level: 2, parent: '1', highlight: true },
      { id: '4', title: '1NF & 2NF', level: 3, parent: '3' },
      { id: '5', title: '3NF (Transitive)', level: 3, parent: '3', highlight: true },
      { id: '6', title: 'BCNF (Boyce-Codd)', level: 3, parent: '3', highlight: true },
      { id: '7', title: 'Lossless Decomposition', level: 3, parent: '3' },
      { id: '8', title: 'Transactions & ACID', level: 1, parent: null },
      { id: '9', title: 'Two-Phase Locking (2PL)', level: 2, parent: '8' },
      { id: '10', title: 'B+ Tree Indexing', level: 2, parent: '8' },
    ]
  },
  os: {
    subject: 'Operating Systems',
    root: 'Kernel Architecture',
    nodes: [
      { id: 'os1', title: 'Process Management', level: 1, parent: null },
      { id: 'os2', title: 'CPU Scheduling', level: 2, parent: 'os1' },
      { id: 'os3', title: 'Process Synchronization', level: 2, parent: 'os1' },
      { id: 'os4', title: 'Semaphores & Mutex', level: 3, parent: 'os3' },
      { id: 'os5', title: 'Deadlocks', level: 2, parent: 'os1', highlight: true },
      { id: 'os6', title: 'Prevention (Coffman)', level: 3, parent: 'os5' },
      { id: 'os7', title: 'Avoidance (Banker’s)', level: 3, parent: 'os5', highlight: true },
      { id: 'os8', title: 'Detection & Recovery', level: 3, parent: 'os5' },
      { id: 'os9', title: 'Memory Management', level: 1, parent: null },
      { id: 'os10', title: 'Virtual Memory & Paging', level: 2, parent: 'os9', highlight: true },
    ]
  }
};

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_01',
    category: 'verification',
    title: 'Teacher Verified Your Upload',
    message: 'Dr. Sarah Thomas approved and verified "DBMS Unit 3 Normalization Complete Notes" with an Official Handout badge.',
    timestamp: '25 mins ago',
    isRead: false,
    materialId: 'mat_01',
    badge: '✓ Verified',
  },
  {
    id: 'notif_02',
    category: 'duplicate',
    title: 'Duplicate Detected During Auto-Scan',
    message: 'Uploaded file "DBMS_Unit3_Final.pdf" has 92% semantic overlap with existing "DBMS Unit 3 Normalization Complete Notes".',
    timestamp: '2 hours ago',
    isRead: false,
    materialId: 'mat_01',
    badge: '⚡ Duplicate Alert',
  },
  {
    id: 'notif_03',
    category: 'materials',
    title: 'New High-Yield Material Added to OS',
    message: 'Prof. A. Nambiar published official end-semester model question papers for Operating Systems Unit 1-5.',
    timestamp: 'Yesterday',
    isRead: true,
    materialId: 'mat_05',
    badge: '📚 New Material',
  },
  {
    id: 'notif_04',
    category: 'revision',
    title: 'Spaced Repetition Revision Due Today',
    message: '2 key topics in Database Management Systems and Operating Systems are due for your morning review.',
    timestamp: 'Yesterday',
    isRead: true,
    badge: '🧠 Revision Due',
  },
  {
    id: 'notif_05',
    category: 'quiz',
    title: 'Quiz Completed With High Score',
    message: 'You scored 4/5 (80%) on the DBMS Normalization Exam Readiness Quiz. Added 1 weak subtopic to your revision queue.',
    timestamp: '2 days ago',
    isRead: true,
    badge: '🎯 Quiz Evaluated',
  },
];

export const MOCK_QUIZ_QUESTIONS = {
  dbms: [
    {
      id: 'q1',
      question: 'Which normal form guarantees the removal of all partial functional dependencies on a candidate key?',
      options: [
        'First Normal Form (1NF)',
        'Second Normal Form (2NF)',
        'Third Normal Form (3NF)',
        'Boyce-Codd Normal Form (BCNF)'
      ],
      correctAnswer: 1,
      explanation: 'Second Normal Form (2NF) enforces that every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies.'
    },
    {
      id: 'q2',
      question: 'In a relational schema with functional dependency X → Y, what is the strict condition required for the relation to be in BCNF?',
      options: [
        'Y must be a prime attribute',
        'X must be a super key for the relation',
        'X and Y must belong to the same composite key',
        'There must be no transitive dependency between X and Y'
      ],
      correctAnswer: 1,
      explanation: 'In BCNF, for every non-trivial functional dependency X → Y, X must be a super key. Unlike 3NF, BCNF does not allow exceptions even if Y is a prime attribute.'
    },
    {
      id: 'q3',
      question: 'What is the primary trade-off when decomposing a relation from 3NF into BCNF?',
      options: [
        'Loss of Lossless Join property',
        'Loss of Dependency Preservation',
        'Introduction of multi-valued anomalies',
        'Exponential increase in table rows'
      ],
      correctAnswer: 1,
      explanation: 'While every 3NF relation can be decomposed into BCNF with a lossless join, it is not always possible to preserve all functional dependencies in BCNF.'
    },
    {
      id: 'q4',
      question: 'Given relation R(A, B, C) and functional dependencies {A → B, B → C}. Which normal form is R in, and what anomaly exists?',
      options: [
        '1NF only; Partial dependency anomaly',
        '2NF; Transitive dependency anomaly (A → C via B)',
        '3NF; No anomaly exists',
        'BCNF; Redundancy anomaly'
      ],
      correctAnswer: 1,
      explanation: 'The candidate key is A. A → B and B → C create a transitive dependency where non-prime attribute C depends on A through non-prime attribute B. Therefore it is in 2NF, but violates 3NF.'
    },
    {
      id: 'q5',
      question: 'Which algorithm is used to verify if a decomposition of R into (R1, R2) is lossless with respect to a set of functional dependencies F?',
      options: [
        'Floyd-Warshall algorithm',
        'Chase Algorithm / Testing (R1 ∩ R2) → R1 or (R1 ∩ R2) → R2',
        'Armstrong Augmentation rule',
        'Banker’s Safety vector check'
      ],
      correctAnswer: 1,
      explanation: 'A decomposition into two relations R1 and R2 is lossless if and only if the common attributes (R1 ∩ R2) form a super key for either R1 or R2.'
    }
  ],
  os: [
    {
      id: 'os_q1',
      question: 'Which of the following conditions is NOT one of the four Coffman conditions necessary for deadlock to occur?',
      options: [
        'Mutual Exclusion',
        'Hold and Wait',
        'Preemption Allowed',
        'Circular Wait'
      ],
      correctAnswer: 2,
      explanation: 'The Coffman condition is "No Preemption" (resources cannot be forcibly taken from a process holding them), not preemption allowed.'
    },
    {
      id: 'os_q2',
      question: 'In Banker’s Algorithm, if Need[i][j] ≤ Available[j] for all resources j, what does it signify for process Pi?',
      options: [
        'Process Pi has caused an immediate deadlock',
        'Process Pi can safely complete its execution and release its allocated resources',
        'The operating system must preempt all resources from Pi',
        'Process Pi must wait indefinitely in a circular queue'
      ],
      correctAnswer: 1,
      explanation: 'If the remaining resource requirement (Need) of Pi can be satisfied with the currently available resources, Pi can run to completion and return its allocated resources to Available.'
    },
    {
      id: 'os_q3',
      question: 'How does Deadlock Prevention differ fundamentally from Deadlock Avoidance?',
      options: [
        'Prevention dynamically checks safety states; Avoidance kills processes',
        'Prevention ensures at least one Coffman condition cannot hold; Avoidance uses advance knowledge of maximum resource demands',
        'Prevention is applied after deadlock occurs; Avoidance is applied before boot',
        'There is no difference between the two techniques'
      ],
      correctAnswer: 1,
      explanation: 'Prevention designs protocols to ensure that at least one of the 4 Coffman conditions can never hold. Avoidance requires the OS to be given advance information regarding total resource claims.'
    }
  ]
};

export const MOCK_TEACHER_PENDING_QUEUE = [
  {
    id: 'pnd_01',
    title: 'Operating Systems Virtual Memory Handout',
    filename: 'OS_Unit5_Paging_Virtual_Memory.pdf',
    subject: 'Operating Systems',
    unit: 'Unit 5',
    uploadedBy: 'Siddharth Roy (Student)',
    uploadedAt: '3 hours ago',
    type: 'pdf',
    fileSize: '2.1 MB',
    confidenceScore: '94% AI verified',
  },
  {
    id: 'pnd_02',
    title: 'CN Socket Programming in C & Python Implementation',
    filename: 'CN_Socket_Programming_Lab_Notes.pdf',
    subject: 'Computer Networks',
    unit: 'Unit 5',
    uploadedBy: 'Ananya Pillai (Student)',
    uploadedAt: '5 hours ago',
    type: 'pdf',
    fileSize: '1.4 MB',
    confidenceScore: '91% AI verified',
  },
  {
    id: 'pnd_03',
    title: 'Relational Calculus vs Relational Algebra Solved Queries',
    filename: 'DBMS_Relational_Calculus.docx',
    subject: 'Database Management Systems',
    unit: 'Unit 2',
    uploadedBy: 'Rahul Verma (Student)',
    uploadedAt: 'Yesterday',
    type: 'doc',
    fileSize: '890 KB',
    confidenceScore: '88% AI verified',
  }
];

export const defaultQuizQuestions = [
  {
    id: 'q1',
    topic: 'Relational Normalization',
    question: 'Which normal form guarantees the elimination of partial functional dependencies on composite candidate keys?',
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)'
    ],
    correctAnswer: 1,
    explanation: '2NF requires a relation to be in 1NF and ensures that no non-prime attribute is partially dependent on any candidate key of the table.'
  },
  {
    id: 'q2',
    topic: 'Transitive Dependencies',
    question: 'In a relation R(A, B, C) where A -> B and B -> C, the dependency A -> C is an example of what?',
    options: [
      'Trivial dependency',
      'Partial dependency',
      'Transitive dependency',
      'Multi-valued dependency'
    ],
    correctAnswer: 2,
    explanation: 'A transitive dependency occurs when non-prime attribute C is indirectly dependent on primary key A through another non-prime attribute B.'
  },
  {
    id: 'q3',
    topic: 'Boyce-Codd Normal Form (BCNF)',
    question: 'What is the strict condition required for every functional dependency X -> Y to be in BCNF?',
    options: [
      'Y must be a prime attribute',
      'X must be a super key',
      'Relation must have no composite keys',
      'Relation must have exactly two attributes'
    ],
    correctAnswer: 1,
    explanation: 'For a relation to be in BCNF, for every functional dependency X -> Y, X must strictly be a super key.'
  },
  {
    id: 'q4',
    topic: 'Lossless Decomposition',
    question: 'Which theorem guarantees that decomposition of R(A, B, C) with A -> B into R1(A, B) and R2(A, C) is a lossless join decomposition?',
    options: [
      "Armstrong's Axiom",
      "Heath's Theorem",
      "Cook's Theorem",
      "Bayes' Theorem"
    ],
    correctAnswer: 1,
    explanation: "Heath's Theorem proves that if A -> B in relation R(A, B, C), the natural join of projections on (A, B) and (A, C) recovers the original relation without spurious tuples."
  },
  {
    id: 'q5',
    topic: 'Operating Systems - Deadlock Prevention',
    question: 'Which of the following conditions for deadlock is negated by requiring processes to request all resources at the same time?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'No Preemption',
      'Circular Wait'
    ],
    correctAnswer: 1,
    explanation: 'By forcing a process to request all necessary resources simultaneously before execution, the system prevents the "Hold and Wait" condition.'
  }
];
