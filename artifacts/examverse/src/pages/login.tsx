import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
  Target,
  Globe2,
  Flame,
  Trophy,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/lib/auth";
import { EXAMS, LANGUAGES } from "@/lib/exams";

const loginSchema = z.object({
  emailOrName: z.string().min(1, "Name or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROTATING_LINES = [
  { en: "Sharper focus,", hi: "तेज़ ध्यान,", ta: "கூர்ந்த கவனம்,", te: "నిశితమైన దృష్టి,", kn: "ತೀಕ್ಷ್ಣ ಗಮನ," },
  { en: "smarter prep,", hi: "स्मार्ट तैयारी,", ta: "மாட்சிமை தயாரிப்பு,", te: "తెలివైన సన్నద్ధత,", kn: "ಸ್ಮಾರ್ಟ್ ತಯಾರಿ," },
  { en: "your exam, conquered.", hi: "आपकी परीक्षा, जीती गई।", ta: "உங்கள் தேர்வு, வென்றது.", te: "మీ పరీక్ష, గెలిచారు.", kn: "ನಿಮ್ಮ ಪರೀಕ್ಷೆ, ಗೆಲುವು." },
];

const LOGIN_LABELS: Record<string, {
  exam: string;
  lang: string;
  cont: string;
  newHere: string;
  createAcct: string;
  nameOrEmail: string;
  password: string;
  forgot: string;
  logIn: string;
  google: string;
  noAcct: string;
  signUp: string;
  change: string;
  pickHelp: string;
  step1: string;
  step2: string;
}> = {
  EN: {
    exam: "Target exam",
    lang: "Preferred language",
    cont: "Continue",
    newHere: "New to Examverse?",
    createAcct: "Create an account",
    nameOrEmail: "Name or Email",
    password: "Password",
    forgot: "Forgot Password?",
    logIn: "Log in",
    google: "Continue with Google",
    noAcct: "Don't have an account?",
    signUp: "Sign up",
    change: "← Change exam or language",
    pickHelp: "Pick your target exam and language — we'll tailor everything.",
    step1: "Step 1 · Personalize",
    step2: "Step 2 · Sign in",
  },
  HI: {
    exam: "लक्षित परीक्षा",
    lang: "पसंदीदा भाषा",
    cont: "आगे बढ़ें",
    newHere: "Examverse पर नए हैं?",
    createAcct: "खाता बनाएँ",
    nameOrEmail: "नाम या ईमेल",
    password: "पासवर्ड",
    forgot: "पासवर्ड भूल गए?",
    logIn: "साइन इन",
    google: "Google से जारी रखें",
    noAcct: "खाता नहीं है?",
    signUp: "साइन अप",
    change: "← परीक्षा या भाषा बदलें",
    pickHelp: "अपनी लक्षित परीक्षा और भाषा चुनें — हम सब कुछ अनुरूप करेंगे।",
    step1: "चरण 1 · वैयक्तिकरण",
    step2: "चरण 2 · साइन इन",
  },
  KN: {
    exam: "ಗುರಿ ಪರೀಕ್ಷೆ",
    lang: "ಆದ್ಯತೆಯ ಭಾಷೆ",
    cont: "ಮುಂದುವರಿಸಿ",
    newHere: "Examverse ಗೆ ಹೊಸದಾ?",
    createAcct: "ಖಾತೆ ರಚಿಸಿ",
    nameOrEmail: "ಹೆಸರು ಅಥವಾ ಇಮೇಲ್",
    password: "ಪಾಸ್ವರ್ಡ್",
    forgot: "ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?",
    logIn: "ಸೈನ್ ಇನ್",
    google: "Google ನಿಂದ ಮುಂದುವರಿಸಿ",
    noAcct: "ಖಾತೆ ಇಲ್ಲವೇ?",
    signUp: "ಸೈನ್ ಅಪ್",
    change: "← ಪರೀಕ್ಷೆ ಅಥವಾ ಭಾಷೆ ಬದಲಿಸಿ",
    pickHelp: "ನಿಮ್ಮ ಗುರಿ ಪರೀಕ್ಷೆ ಮತ್ತು ಭಾಷೆ ಆರಿಸಿ — ನಾವು ಎಲ್ಲವನ್ನೂ ಹೊಂದಿಸುತ್ತೇವೆ.",
    step1: "ಹಂತ 1 · ವ್ಯಕ್ತಿಗತಗೊಳಿಸಿ",
    step2: "ಹಂತ 2 · ಸೈನ್ ಇನ್",
  },
  TA: {
    exam: "இலக்கு தேர்வு",
    lang: "விருப்ப மொழி",
    cont: "தொடர்க",
    newHere: "Examverse ல் புதிதா?",
    createAcct: "கணக்கு உருவாக்கு",
    nameOrEmail: "பெயர் அல்லது மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    forgot: "கடவுச்சொல்லை மறந்தீர்களா?",
    logIn: "உள்நுழை",
    google: "Google உடன் தொடர்க",
    noAcct: "கணக்கு இல்லையா?",
    signUp: "பதிவு செய்க",
    change: "← தேர்வு அல்லது மொழியை மாற்று",
    pickHelp: "உங்கள் இலக்கு தேர்வையும் மொழியையும் தேர்ந்தெடுங்கள் — அனைத்தையும் வடிவமைப்போம்.",
    step1: "படி 1 · தனிப்பயனாக்கு",
    step2: "படி 2 · உள்நுழை",
  },
  TE: {
    exam: "లక్ష్య పరీక్ష",
    lang: "ప్రాధాన్య భాష",
    cont: "కొనసాగించు",
    newHere: "Examverse లో కొత్తవారా?",
    createAcct: "ఖాతా సృష్టించండి",
    nameOrEmail: "పేరు లేదా ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    logIn: "సైన్ ఇన్",
    google: "Google తో కొనసాగించు",
    noAcct: "ఖాతా లేదా?",
    signUp: "సైన్ అప్",
    change: "← పరీక్ష లేదా భాష మార్చు",
    pickHelp: "మీ లక్ష్య పరీక్ష, భాష ఎంచుకోండి — మేము అన్నీ సర్దుబాటు చేస్తాం.",
    step1: "దశ 1 · వ్యక్తిగతీకరించు",
    step2: "దశ 2 · సైన్ ఇన్",
  },
  BN: {
    exam: "লক্ষ্য পরীক্ষা",
    lang: "পছন্দের ভাষা",
    cont: "চালিয়ে যান",
    newHere: "Examverse-এ নতুন?",
    createAcct: "অ্যাকাউন্ট তৈরি",
    nameOrEmail: "নাম বা ইমেল",
    password: "পাসওয়ার্ড",
    forgot: "পাসওয়ার্ড ভুলে গেছেন?",
    logIn: "সাইন ইন",
    google: "Google দিয়ে চালিয়ে যান",
    noAcct: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ",
    change: "← পরীক্ষা বা ভাষা পরিবর্তন",
    pickHelp: "আপনার লক্ষ্য পরীক্ষা ও ভাষা বেছে নিন — আমরা সব মানিয়ে দেব।",
    step1: "ধাপ ১ · ব্যক্তিগতকরণ",
    step2: "ধাপ ২ · সাইন ইন",
  },
};

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"choose" | "credentials">("choose");
  const [targetExam, setTargetExam] = useState<string>("JEE");
  const [language, setLanguage] = useState<string>("EN");
  const [tickIdx, setTickIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTickIdx((i) => (i + 1) % ROTATING_LINES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsLoading(false);
    login({
      emailOrName: data.emailOrName,
      targetExam,
      language,
    });
  };

  const langLineKey: Record<string, "en" | "hi" | "ta" | "te" | "kn"> = {
    EN: "en", HI: "hi", TA: "ta", TE: "te", KN: "kn", BN: "en",
  };
  const lineLang = langLineKey[language] ?? "en";

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* LEFT — creative aurora panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-primary via-emerald-700 to-teal-800 text-white">
        {/* Animated orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-emerald-300/30 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-16 w-[460px] h-[460px] rounded-full bg-amber-300/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[260px] h-[260px] rounded-full bg-sky-300/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SVG grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Examverse</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" /> AI-first exam mentor
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            <AnimatePresence mode="wait">
              <motion.span
                key={tickIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45 }}
                className="block"
              >
                {ROTATING_LINES[tickIdx][lineLang]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            A personal AI mentor that adapts to your mood, energy and timetable —
            in your language. Built for JEE, NEET, UPSC, GATE, Banking and state exams.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-sm pt-2">
            {[
              { icon: Target, label: "Adaptive quizzes" },
              { icon: Trophy, label: "Daily streaks" },
              { icon: Globe2, label: "5+ languages" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-3 text-center">
                <f.icon className="w-5 h-5 mx-auto mb-2 text-amber-200" />
                <p className="text-xs font-medium leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          Trusted by 10,000+ aspirants preparing for India's toughest exams.
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="flex flex-col items-center justify-center p-6 md:p-10 relative">
        {/* mobile gradient header */}
        <div className="lg:hidden absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-primary to-emerald-700 -z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex items-center justify-center gap-2 text-white mb-8">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-xl">Examverse</span>
          </div>

          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
            <div className="px-7 pt-7 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${step === "choose" ? "text-primary" : "text-muted-foreground"}`}>
                  {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).step1}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${step === "credentials" ? "text-primary" : "text-muted-foreground"}`}>
                  {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).step2}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {(() => {
                  const titles: Record<string, { choose: string; cred: string }> = {
                    EN: { choose: "Welcome back", cred: "Sign in to continue" },
                    HI: { choose: "वापसी पर स्वागत है", cred: "जारी रखने के लिए साइन इन करें" },
                    KN: { choose: "ಮರಳಿ ಸ್ವಾಗತ", cred: "ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ" },
                    TA: { choose: "மீண்டும் வரவேற்கிறோம்", cred: "தொடர உள்நுழையவும்" },
                    TE: { choose: "తిరిగి స్వాగతం", cred: "కొనసాగించడానికి సైన్ ఇన్ చేయండి" },
                    BN: { choose: "আবার স্বাগতম", cred: "চালিয়ে যেতে সাইন ইন করুন" },
                  };
                  return (titles[language] ?? titles.EN)[step === "choose" ? "choose" : "cred"];
                })()}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === "choose"
                  ? (LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).pickHelp
                  : `${EXAMS.find((e) => e.code === targetExam)?.short ?? "Your exam"} · ${LANGUAGES.find((l) => l.code === language)?.native}`}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === "choose" ? (
                <motion.div
                  key="choose"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="px-7 pb-7 space-y-6"
                >
                  <div>
                    <Label className="flex items-center gap-2 mb-3 text-sm font-semibold">
                      <Target className="w-4 h-4 text-primary" />
                      {LOGIN_LABELS[language]?.exam ?? LOGIN_LABELS.EN.exam}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {EXAMS.map((exam) => {
                        const active = targetExam === exam.code;
                        return (
                          <button
                            key={exam.code}
                            type="button"
                            onClick={() => setTargetExam(exam.code)}
                            className={`relative text-left p-3 rounded-xl border transition-all overflow-hidden ${
                              active
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-primary/40 hover:bg-muted/40"
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${exam.gradient} opacity-${active ? "100" : "0"} transition-opacity`} />
                            <div className="relative">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg leading-none">{exam.emoji}</span>
                                {active && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Selected</span>
                                )}
                              </div>
                              <p className="font-semibold text-sm leading-tight">{exam.short}</p>
                              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">
                                {exam.subjects.slice(0, 3).join(" · ")}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-3 text-sm font-semibold">
                      <Globe2 className="w-4 h-4 text-primary" />
                      {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).lang}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => {
                        const active = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setLanguage(lang.code)}
                            className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                            }`}
                          >
                            <span className="font-semibold">{lang.native}</span>
                            {!active && (
                              <span className="text-[10px] ml-1 opacity-70">{lang.label}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="w-full rounded-xl h-11 font-medium gap-2"
                  >
                    {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).cont}
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).newHere}{" "}
                    <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
                      {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).createAcct}
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="px-7 pb-7"
                >
                  <button
                    type="button"
                    onClick={() => setStep("choose")}
                    className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
                  >
                    {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).change}
                  </button>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailOrName">{(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).nameOrEmail}</Label>
                      <Input
                        id="emailOrName"
                        placeholder="student@example.com"
                        className={`rounded-xl h-11 ${errors.emailOrName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        {...register("emailOrName")}
                      />
                      {errors.emailOrName && (
                        <p className="text-sm text-destructive">{errors.emailOrName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).password}</Label>
                        <a href="#" className="text-xs text-primary font-medium hover:underline underline-offset-4">
                          {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).forgot}
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`rounded-xl h-11 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          {...register("password")}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full rounded-xl h-11 font-medium mt-2 gap-2"
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                        {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).logIn}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </form>

                  <div className="mt-5 relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl h-11 mt-5 font-medium"
                  >
                    <FcGoogle className="mr-2 w-5 h-5" />
                    {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).google}
                  </Button>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).noAcct}{" "}
                    <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
                      {(LOGIN_LABELS[language] ?? LOGIN_LABELS.EN).signUp}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
