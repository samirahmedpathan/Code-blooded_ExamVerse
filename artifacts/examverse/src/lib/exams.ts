export interface ExamOption {
  code: string;
  name: string;
  short: string;
  category: "Engineering" | "Medical" | "Civil Services" | "Banking" | "State" | "Management" | "Defence" | "Teaching";
  subjects: string[];
  emoji: string;
  gradient: string;
}

export const EXAMS: ExamOption[] = [
  {
    code: "JEE",
    name: "JEE Main & Advanced",
    short: "JEE",
    category: "Engineering",
    subjects: ["Physics", "Chemistry", "Math"],
    emoji: "⚙️",
    gradient: "from-blue-500/30 to-indigo-500/20",
  },
  {
    code: "NEET",
    name: "NEET UG",
    short: "NEET",
    category: "Medical",
    subjects: ["Physics", "Chemistry", "Biology"],
    emoji: "🩺",
    gradient: "from-emerald-500/30 to-teal-500/20",
  },
  {
    code: "UPSC",
    name: "UPSC Civil Services",
    short: "UPSC",
    category: "Civil Services",
    subjects: ["Polity", "History", "Geography", "Economy", "Current Affairs"],
    emoji: "🏛️",
    gradient: "from-amber-500/30 to-orange-500/20",
  },
  {
    code: "SSC",
    name: "SSC CGL / CHSL",
    short: "SSC",
    category: "Civil Services",
    subjects: ["Quant", "Reasoning", "English", "GK"],
    emoji: "📊",
    gradient: "from-rose-500/30 to-pink-500/20",
  },
  {
    code: "GATE",
    name: "GATE",
    short: "GATE",
    category: "Engineering",
    subjects: ["Engineering", "Math", "Aptitude"],
    emoji: "🛠️",
    gradient: "from-violet-500/30 to-purple-500/20",
  },
  {
    code: "BANK",
    name: "Banking (IBPS / SBI)",
    short: "Bank PO",
    category: "Banking",
    subjects: ["Quant", "Reasoning", "English", "Banking Awareness"],
    emoji: "🏦",
    gradient: "from-sky-500/30 to-cyan-500/20",
  },
  {
    code: "CAT",
    name: "CAT (MBA)",
    short: "CAT",
    category: "Management",
    subjects: ["VARC", "DILR", "Quant"],
    emoji: "📈",
    gradient: "from-fuchsia-500/30 to-pink-500/20",
  },
  {
    code: "NDA",
    name: "NDA",
    short: "NDA",
    category: "Defence",
    subjects: ["Math", "GK", "English"],
    emoji: "🪖",
    gradient: "from-stone-500/30 to-zinc-500/20",
  },
  {
    code: "CTET",
    name: "CTET",
    short: "CTET",
    category: "Teaching",
    subjects: ["Child Dev", "Math", "EVS", "Languages"],
    emoji: "✏️",
    gradient: "from-lime-500/30 to-green-500/20",
  },
  {
    code: "KCET",
    name: "Karnataka CET (KCET)",
    short: "KCET",
    category: "State",
    subjects: ["Physics", "Chemistry", "Math", "Biology"],
    emoji: "🌾",
    gradient: "from-yellow-500/30 to-amber-500/20",
  },
  {
    code: "TNPSC",
    name: "TNPSC Group I/II",
    short: "TNPSC",
    category: "State",
    subjects: ["Tamil", "GK", "Aptitude", "Current Affairs"],
    emoji: "🌴",
    gradient: "from-red-500/30 to-orange-500/20",
  },
  {
    code: "TSPSC",
    name: "TSPSC / APPSC",
    short: "TSPSC",
    category: "State",
    subjects: ["Telugu", "GK", "Aptitude", "Current Affairs"],
    emoji: "🪔",
    gradient: "from-orange-500/30 to-red-500/20",
  },
];

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  greeting: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", label: "English", native: "English", greeting: "Hello" },
  { code: "HI", label: "Hindi", native: "हिंदी", greeting: "नमस्ते" },
  { code: "KN", label: "Kannada", native: "ಕನ್ನಡ", greeting: "ನಮಸ್ಕಾರ" },
  { code: "TA", label: "Tamil", native: "தமிழ்", greeting: "வணக்கம்" },
  { code: "TE", label: "Telugu", native: "తెలుగు", greeting: "నమస్కారం" },
  { code: "BN", label: "Bengali", native: "বাংলা", greeting: "নমস্কার" },
];

export function findExam(code: string | undefined | null): ExamOption {
  return EXAMS.find((e) => e.code === code) ?? EXAMS[0];
}

export function findLanguage(code: string | undefined | null): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
