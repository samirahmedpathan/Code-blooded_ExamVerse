export interface Quiz {
  id: string;
  title: string;
  subject: string;
  exam: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
  estTimeMin: number;
  avgAccuracy: number;
  topic: string;
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  exam: string[];
  format: "PDF" | "Video" | "Article";
  estTimeMin: number;
  source: string;
  url?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  level: "Beginner" | "Standard" | "Advanced";
  exam: string[];
  topic: string;
  reason: string;
  rating: number;
}

export interface CurrentAffair {
  id: string;
  date: string;
  category: "National" | "International" | "Economy" | "Science & Tech" | "Sports" | "Polity" | "Environment";
  headline: string;
  summary: string;
  relevance: string[];
}

export const MOCK_DATA = {
  quizzes: [
    // JEE
    { id: "q-jee-1", title: "Rotational Motion PYQs", subject: "Physics", exam: "JEE", type: "PYQ", difficulty: "Hard", questionCount: 15, estTimeMin: 30, avgAccuracy: 62, topic: "Mechanics" },
    { id: "q-jee-2", title: "Coordination Compounds", subject: "Chemistry", exam: "JEE", type: "Topic", difficulty: "Medium", questionCount: 10, estTimeMin: 20, avgAccuracy: 75, topic: "Inorganic" },
    { id: "q-jee-3", title: "Definite Integrals Drill", subject: "Math", exam: "JEE", type: "Topic", difficulty: "Medium", questionCount: 12, estTimeMin: 25, avgAccuracy: 68, topic: "Calculus" },
    { id: "q-jee-4", title: "Electromagnetic Induction", subject: "Physics", exam: "JEE", type: "PYQ", difficulty: "Hard", questionCount: 10, estTimeMin: 22, avgAccuracy: 58, topic: "Electromagnetism" },
    { id: "q-jee-5", title: "Organic Reaction Mechanisms", subject: "Chemistry", exam: "JEE", type: "Topic", difficulty: "Hard", questionCount: 15, estTimeMin: 30, avgAccuracy: 55, topic: "Organic" },
    // NEET
    { id: "q-neet-1", title: "Human Physiology", subject: "Biology", exam: "NEET", type: "Topic", difficulty: "Medium", questionCount: 20, estTimeMin: 25, avgAccuracy: 72, topic: "Physiology" },
    { id: "q-neet-2", title: "Genetics & Evolution", subject: "Biology", exam: "NEET", type: "PYQ", difficulty: "Hard", questionCount: 15, estTimeMin: 25, avgAccuracy: 64, topic: "Genetics" },
    { id: "q-neet-3", title: "Thermodynamics for NEET", subject: "Physics", exam: "NEET", type: "Topic", difficulty: "Medium", questionCount: 12, estTimeMin: 22, avgAccuracy: 70, topic: "Thermo" },
    // UPSC
    { id: "q-upsc-1", title: "Fundamental Rights", subject: "Polity", exam: "UPSC", type: "Topic", difficulty: "Medium", questionCount: 15, estTimeMin: 25, avgAccuracy: 80, topic: "Constitution" },
    { id: "q-upsc-2", title: "Modern Indian History — Freedom Struggle", subject: "History", exam: "UPSC", type: "PYQ", difficulty: "Hard", questionCount: 20, estTimeMin: 35, avgAccuracy: 66, topic: "Modern History" },
    { id: "q-upsc-3", title: "Indian Geography Mains Map", subject: "Geography", exam: "UPSC", type: "Topic", difficulty: "Medium", questionCount: 18, estTimeMin: 30, avgAccuracy: 71, topic: "Geography" },
    { id: "q-upsc-4", title: "Current Affairs — This Week", subject: "Current Affairs", exam: "UPSC", type: "Daily", difficulty: "Easy", questionCount: 10, estTimeMin: 12, avgAccuracy: 78, topic: "Current Affairs" },
    // SSC
    { id: "q-ssc-1", title: "SSC CGL Quant Mixed", subject: "Quant", exam: "SSC", type: "PYQ", difficulty: "Medium", questionCount: 25, estTimeMin: 30, avgAccuracy: 70, topic: "Arithmetic" },
    { id: "q-ssc-2", title: "Reasoning Puzzles", subject: "Reasoning", exam: "SSC", type: "Topic", difficulty: "Medium", questionCount: 20, estTimeMin: 25, avgAccuracy: 67, topic: "Reasoning" },
    { id: "q-ssc-3", title: "SSC English Comprehension", subject: "English", exam: "SSC", type: "PYQ", difficulty: "Easy", questionCount: 25, estTimeMin: 25, avgAccuracy: 74, topic: "English" },
    // GATE
    { id: "q-gate-1", title: "GATE CS — Operating Systems", subject: "Engineering", exam: "GATE", type: "Topic", difficulty: "Hard", questionCount: 15, estTimeMin: 30, avgAccuracy: 60, topic: "OS" },
    { id: "q-gate-2", title: "GATE Engineering Math", subject: "Math", exam: "GATE", type: "PYQ", difficulty: "Hard", questionCount: 12, estTimeMin: 28, avgAccuracy: 58, topic: "Linear Algebra" },
    // Banking
    { id: "q-bank-1", title: "IBPS PO Prelims Mock", subject: "Quant", exam: "BANK", type: "Mock", difficulty: "Medium", questionCount: 35, estTimeMin: 30, avgAccuracy: 65, topic: "Quant" },
    { id: "q-bank-2", title: "Banking Awareness Daily", subject: "Banking Awareness", exam: "BANK", type: "Daily", difficulty: "Easy", questionCount: 15, estTimeMin: 15, avgAccuracy: 75, topic: "Banking" },
    // CAT
    { id: "q-cat-1", title: "CAT VARC — Reading Comp", subject: "VARC", exam: "CAT", type: "Topic", difficulty: "Hard", questionCount: 12, estTimeMin: 30, avgAccuracy: 60, topic: "VARC" },
    { id: "q-cat-2", title: "DILR Set Practice", subject: "DILR", exam: "CAT", type: "PYQ", difficulty: "Hard", questionCount: 16, estTimeMin: 40, avgAccuracy: 55, topic: "DILR" },
    // KCET
    { id: "q-kcet-1", title: "KCET Biology Quick Test", subject: "Biology", exam: "KCET", type: "Topic", difficulty: "Easy", questionCount: 20, estTimeMin: 20, avgAccuracy: 78, topic: "Biology" },
    { id: "q-kcet-2", title: "KCET Math PYQ Pack", subject: "Math", exam: "KCET", type: "PYQ", difficulty: "Medium", questionCount: 25, estTimeMin: 35, avgAccuracy: 69, topic: "Math" },
    // TNPSC
    { id: "q-tnpsc-1", title: "Tamil Nadu History Quick", subject: "GK", exam: "TNPSC", type: "Topic", difficulty: "Medium", questionCount: 20, estTimeMin: 22, avgAccuracy: 71, topic: "TN History" },
    { id: "q-tnpsc-2", title: "TNPSC Aptitude Drill", subject: "Aptitude", exam: "TNPSC", type: "PYQ", difficulty: "Medium", questionCount: 25, estTimeMin: 30, avgAccuracy: 66, topic: "Aptitude" },
    // TSPSC
    { id: "q-tspsc-1", title: "Telangana Movement & GK", subject: "GK", exam: "TSPSC", type: "Topic", difficulty: "Medium", questionCount: 20, estTimeMin: 25, avgAccuracy: 73, topic: "Telangana GK" },
    // CTET
    { id: "q-ctet-1", title: "Child Development & Pedagogy", subject: "Child Dev", exam: "CTET", type: "Topic", difficulty: "Medium", questionCount: 30, estTimeMin: 30, avgAccuracy: 76, topic: "Pedagogy" },
    // NDA
    { id: "q-nda-1", title: "NDA Math — Trigonometry", subject: "Math", exam: "NDA", type: "PYQ", difficulty: "Medium", questionCount: 20, estTimeMin: 25, avgAccuracy: 68, topic: "Trigonometry" },
  ] as Quiz[],

  sampleQuizQuestions: [
    {
      id: "q1_1",
      text: "A solid cylinder of mass 20 kg rotates about its axis with angular speed 100 rad/s. The radius of the cylinder is 0.25 m. What is the kinetic energy associated with the rotation of the cylinder?",
      options: ["3125 J", "1250 J", "625 J", "2500 J"],
      correctIndex: 0,
      explanation: "I = MR²/2 = 20 * (0.25)² / 2 = 0.625 kg m². KE = Iω²/2 = 0.625 * (100)² / 2 = 3125 J.",
    },
    {
      id: "q1_2",
      text: "A wheel of moment of inertia 2 kg m² is rotating at 50 rpm. It is subjected to a retarding torque of 20 Nm. The time taken by the wheel to come to rest is approximately:",
      options: ["0.5 s", "1.5 s", "10 s", "5 s"],
      correctIndex: 0,
      explanation: "ω0 = 50 * 2π/60 = 5π/3 rad/s. τ = Iα => 20 = 2α => α = 10 rad/s². ω = ω0 - αt => 0 = 5π/3 - 10t => t = π/6 ≈ 0.5 s.",
    },
  ],

  resources: [
    { id: "r1", title: "NCERT Physics Class 11 Summary", subject: "Physics", exam: ["JEE", "NEET", "KCET"], format: "PDF", estTimeMin: 45, source: "NCERT Official" },
    { id: "r2", title: "Complete Indian Polity Marathon", subject: "Polity", exam: ["UPSC", "TNPSC", "TSPSC"], format: "Video", estTimeMin: 180, source: "StudyIQ" },
    { id: "r3", title: "Organic Chemistry — Reactions Cheat Sheet", subject: "Chemistry", exam: ["JEE", "NEET"], format: "PDF", estTimeMin: 30, source: "Khan Academy" },
    { id: "r4", title: "Modern History — Freedom Struggle Notes", subject: "History", exam: ["UPSC", "SSC"], format: "PDF", estTimeMin: 60, source: "Spectrum" },
    { id: "r5", title: "Banking Awareness Daily Capsule", subject: "Banking Awareness", exam: ["BANK"], format: "Article", estTimeMin: 12, source: "BankersAdda" },
    { id: "r6", title: "CAT VARC Strategy Workshop", subject: "VARC", exam: ["CAT"], format: "Video", estTimeMin: 90, source: "2IIM" },
    { id: "r7", title: "Telangana Movement Notes (English)", subject: "GK", exam: ["TSPSC"], format: "PDF", estTimeMin: 40, source: "TSPSC Hub" },
    { id: "r8", title: "Tamil Nadu Geography Quick Notes", subject: "GK", exam: ["TNPSC"], format: "PDF", estTimeMin: 35, source: "Shankar IAS" },
    { id: "r9", title: "Karnataka GK Capsule for KCET", subject: "GK", exam: ["KCET"], format: "Article", estTimeMin: 15, source: "KEA Hub" },
  ] as Resource[],

  books: [
    // JEE Physics
    { id: "b-jee-p1", title: "Concepts of Physics Vol 1", author: "H.C. Verma", level: "Standard", exam: ["JEE"], topic: "Mechanics", reason: "Builds rock-solid intuition for mechanics from first principles.", rating: 4.8 },
    { id: "b-jee-p2", title: "Concepts of Physics Vol 2", author: "H.C. Verma", level: "Standard", exam: ["JEE"], topic: "Electromagnetism", reason: "Best treatment of EM, optics & modern physics for JEE.", rating: 4.8 },
    { id: "b-jee-p3", title: "Problems in General Physics", author: "I.E. Irodov", level: "Advanced", exam: ["JEE"], topic: "Mechanics", reason: "Brutal problem set that pushes JEE Advanced aspirants.", rating: 4.6 },
    { id: "b-jee-p4", title: "Understanding Physics — Mechanics", author: "D.C. Pandey", level: "Standard", exam: ["JEE"], topic: "Mechanics", reason: "Clean theory + tiered problems mirroring JEE Main pattern.", rating: 4.5 },
    // JEE Chemistry
    { id: "b-jee-c1", title: "Organic Chemistry", author: "Morrison & Boyd", level: "Advanced", exam: ["JEE"], topic: "Organic", reason: "Deep mechanistic explanations for organic reactions.", rating: 4.7 },
    { id: "b-jee-c2", title: "Concise Inorganic Chemistry", author: "J.D. Lee", level: "Advanced", exam: ["JEE"], topic: "Inorganic", reason: "The standard text for inorganic at competitive level.", rating: 4.6 },
    { id: "b-jee-c3", title: "Modern Approach to Chemical Calculations", author: "R.C. Mukherjee", level: "Standard", exam: ["JEE", "NEET"], topic: "Physical", reason: "Numerical mastery for physical chemistry.", rating: 4.5 },
    // JEE Math
    { id: "b-jee-m1", title: "Algebra", author: "Hall & Knight", level: "Standard", exam: ["JEE"], topic: "Algebra", reason: "Classic foundation for algebraic intuition.", rating: 4.4 },
    { id: "b-jee-m2", title: "Coordinate Geometry", author: "S.L. Loney", level: "Advanced", exam: ["JEE"], topic: "Coordinate Geometry", reason: "Indispensable for coordinate geometry mastery.", rating: 4.6 },
    { id: "b-jee-m3", title: "Problems in Calculus of One Variable", author: "I.A. Maron", level: "Advanced", exam: ["JEE"], topic: "Calculus", reason: "Challenging calculus problems with detailed solutions.", rating: 4.5 },
    // NEET Biology
    { id: "b-neet-b1", title: "Trueman's Biology Vol 1 & 2", author: "Trueman", level: "Standard", exam: ["NEET"], topic: "Biology", reason: "Most-used reference outside NCERT for NEET.", rating: 4.6 },
    { id: "b-neet-b2", title: "Objective Biology", author: "Dinesh", level: "Standard", exam: ["NEET"], topic: "Biology", reason: "Question-bank style — perfect for NEET drills.", rating: 4.4 },
    { id: "b-neet-b3", title: "AC Dutta — Botany", author: "A.C. Dutta", level: "Advanced", exam: ["NEET"], topic: "Botany", reason: "Reference text for botany depth.", rating: 4.3 },
    // UPSC
    { id: "b-upsc-1", title: "Indian Polity", author: "M. Laxmikanth", level: "Standard", exam: ["UPSC", "TNPSC", "TSPSC"], topic: "Polity", reason: "The single most important book for Indian Polity.", rating: 4.9 },
    { id: "b-upsc-2", title: "India's Struggle for Independence", author: "Bipan Chandra", level: "Standard", exam: ["UPSC"], topic: "Modern History", reason: "Definitive narrative of the freedom struggle.", rating: 4.8 },
    { id: "b-upsc-3", title: "Certificate Physical & Human Geography", author: "G.C. Leong", level: "Beginner", exam: ["UPSC", "SSC"], topic: "Geography", reason: "Perfect first geography read for UPSC aspirants.", rating: 4.7 },
    { id: "b-upsc-4", title: "Indian Economy", author: "Ramesh Singh", level: "Standard", exam: ["UPSC"], topic: "Economy", reason: "Comprehensive coverage of Indian economic concepts.", rating: 4.6 },
    { id: "b-upsc-5", title: "Brief History of Modern India", author: "Spectrum", level: "Beginner", exam: ["UPSC", "SSC"], topic: "Modern History", reason: "Concise modern history primer.", rating: 4.7 },
    // SSC
    { id: "b-ssc-1", title: "Quantitative Aptitude", author: "R.S. Aggarwal", level: "Standard", exam: ["SSC", "BANK"], topic: "Quant", reason: "Comprehensive quant practice with clear examples.", rating: 4.5 },
    { id: "b-ssc-2", title: "Verbal & Non-Verbal Reasoning", author: "R.S. Aggarwal", level: "Standard", exam: ["SSC", "BANK"], topic: "Reasoning", reason: "Classic reasoning textbook with topic-wise drill sets.", rating: 4.5 },
    { id: "b-ssc-3", title: "Word Power Made Easy", author: "Norman Lewis", level: "Beginner", exam: ["SSC", "BANK", "CAT"], topic: "English", reason: "Vocabulary builder — gold standard for English.", rating: 4.8 },
    // GATE
    { id: "b-gate-1", title: "Operating System Concepts", author: "Silberschatz", level: "Advanced", exam: ["GATE"], topic: "OS", reason: "The dinosaur book — definitive OS reference.", rating: 4.7 },
    { id: "b-gate-2", title: "Higher Engineering Mathematics", author: "B.S. Grewal", level: "Standard", exam: ["GATE"], topic: "Math", reason: "Engineering math bible used across colleges.", rating: 4.6 },
    // Banking
    { id: "b-bank-1", title: "Banking Awareness", author: "Arihant", level: "Standard", exam: ["BANK"], topic: "Banking", reason: "Topic-wise banking awareness with PYQs.", rating: 4.4 },
    // CAT
    { id: "b-cat-1", title: "How to Prepare for Quantitative Aptitude for CAT", author: "Arun Sharma", level: "Standard", exam: ["CAT"], topic: "Quant", reason: "Standard CAT quant resource with tiered difficulty.", rating: 4.6 },
    { id: "b-cat-2", title: "How to Prepare for VARC for CAT", author: "Arun Sharma & Meenakshi", level: "Standard", exam: ["CAT"], topic: "VARC", reason: "Strategy + practice for CAT VARC.", rating: 4.5 },
    // KCET
    { id: "b-kcet-1", title: "KCET Explorer (PCMB)", author: "MTG", level: "Standard", exam: ["KCET"], topic: "PCMB", reason: "Exam-focused KCET problem bank with PYQs.", rating: 4.4 },
    // TNPSC
    { id: "b-tnpsc-1", title: "Tamil Nadu History & Culture", author: "K.K. Pillay", level: "Standard", exam: ["TNPSC"], topic: "TN History", reason: "Classic TN history reference for TNPSC.", rating: 4.5 },
    // TSPSC
    { id: "b-tspsc-1", title: "Telangana Movement and State Formation", author: "T.S. Sudhir", level: "Standard", exam: ["TSPSC"], topic: "Telangana GK", reason: "Detailed account of Telangana statehood movement.", rating: 4.4 },
    // CTET
    { id: "b-ctet-1", title: "Child Development and Pedagogy", author: "Arihant", level: "Standard", exam: ["CTET"], topic: "Pedagogy", reason: "Compact, topic-wise CTET preparation guide.", rating: 4.4 },
    // NDA
    { id: "b-nda-1", title: "Pathfinder for NDA & NA", author: "Arihant", level: "Standard", exam: ["NDA"], topic: "All", reason: "All-in-one NDA prep resource.", rating: 4.5 },
  ] as Book[],

  currentAffairs: [
    {
      id: "ca-1",
      date: "2026-04-27",
      category: "Polity",
      headline: "Election Commission rolls out new voter awareness portal",
      summary:
        "The ECI launched a unified portal that consolidates voter registration, EPIC corrections, and polling-booth lookup. The portal also adds vernacular support for 12 Indian languages including Kannada, Tamil and Telugu.",
      relevance: ["UPSC", "SSC", "TNPSC", "TSPSC"],
    },
    {
      id: "ca-2",
      date: "2026-04-27",
      category: "Economy",
      headline: "RBI keeps repo rate unchanged at 6.25%",
      summary:
        "The Monetary Policy Committee held the repo rate steady, citing balanced inflation outlook and resilient growth. CPI projection for FY27 was revised marginally to 4.4%.",
      relevance: ["UPSC", "BANK", "CAT", "SSC"],
    },
    {
      id: "ca-3",
      date: "2026-04-26",
      category: "Science & Tech",
      headline: "ISRO successfully tests reusable launch vehicle",
      summary:
        "ISRO completed an autonomous landing experiment for its RLV at Chitradurga, validating return-and-land technology critical for the Gaganyaan follow-on programme.",
      relevance: ["UPSC", "GATE", "SSC", "KCET"],
    },
    {
      id: "ca-4",
      date: "2026-04-26",
      category: "International",
      headline: "India and Japan sign critical-minerals partnership",
      summary:
        "A joint declaration was signed for cooperation on lithium, cobalt and rare-earth supply chains. The agreement adds to India's Quad-aligned strategic resource framework.",
      relevance: ["UPSC", "TNPSC", "TSPSC"],
    },
    {
      id: "ca-5",
      date: "2026-04-25",
      category: "Environment",
      headline: "Western Ghats added to expanded ESA notification",
      summary:
        "MoEFCC notified an expanded Ecologically Sensitive Area covering parts of Karnataka, Kerala and Maharashtra, with stricter rules on quarrying and red-category industries.",
      relevance: ["UPSC", "KCET", "TNPSC"],
    },
    {
      id: "ca-6",
      date: "2026-04-25",
      category: "Sports",
      headline: "India tops medal tally at Asian Athletics Championship",
      summary:
        "Indian athletes finished with 8 gold, 6 silver and 9 bronze, the country's best-ever performance at the continental meet.",
      relevance: ["SSC", "BANK", "CTET", "NDA"],
    },
    {
      id: "ca-7",
      date: "2026-04-24",
      category: "National",
      headline: "PM unveils Viksit Bharat Skill Mission 2.0",
      summary:
        "A revamped skilling mission targeting 5 crore youths over 5 years was launched, focusing on AI, semiconductor, and green-energy verticals.",
      relevance: ["UPSC", "SSC", "BANK"],
    },
    {
      id: "ca-8",
      date: "2026-04-24",
      category: "Science & Tech",
      headline: "India tests first indigenous CAR-T cell therapy at scale",
      summary:
        "AIIMS Delhi reported successful trial outcomes for an indigenously developed CAR-T cell therapy for B-cell lymphoma, dramatically reducing treatment costs.",
      relevance: ["NEET", "UPSC", "GATE"],
    },
  ] as CurrentAffair[],

  leaderboard: [
    { id: "l1", name: "Rahul S.", points: 1450 },
    { id: "l2", name: "Priya M.", points: 1320 },
    { id: "l3", name: "Student", points: 1250 },
    { id: "l4", name: "Amit K.", points: 1100 },
    { id: "l5", name: "Neha R.", points: 950 },
  ],
  mentorResponses: {
    motivation: "I know it feels overwhelming right now. Remember why you started. Every single concept you master today is a step closer to your goal. Take a deep breath, and let's tackle just one small thing next.",
    planning: "Based on your recent activity, I'd suggest focusing on your weakest area first while your energy is high. Spend 45 minutes on that, take a 10-minute break, and then do a light 30-minute revision of yesterday's topics.",
    concept: "That's a great question. Let's break it down simply. Think of it like a building's foundation - you need the base before the walls. [Detailed explanation follows...]",
    default: "I'm here to help you succeed. Could you share a bit more detail about what you're working on right now?",
  },
};
