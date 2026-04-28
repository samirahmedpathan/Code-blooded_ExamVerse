import { BookOpen, Trophy, Target, BarChart3, GraduationCap, Sparkles, Brain, Compass } from "lucide-react";

interface Particle {
  Icon: typeof BookOpen;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  accent?: "gold" | "emerald";
}

const PARTICLES: Particle[] = [
  { Icon: BookOpen,       top: "8%",  left: "6%",  size: 28, duration: 14, delay: 0,   accent: "emerald" },
  { Icon: Trophy,         top: "14%", left: "82%", size: 32, duration: 18, delay: 1.5, accent: "gold" },
  { Icon: Target,         top: "30%", left: "44%", size: 24, duration: 16, delay: 0.5 },
  { Icon: BarChart3,      top: "62%", left: "12%", size: 30, duration: 20, delay: 2,   accent: "emerald" },
  { Icon: GraduationCap,  top: "72%", left: "78%", size: 34, duration: 17, delay: 1 },
  { Icon: Sparkles,       top: "44%", left: "88%", size: 22, duration: 13, delay: 0.8, accent: "gold" },
  { Icon: Brain,          top: "84%", left: "38%", size: 26, duration: 19, delay: 2.5, accent: "emerald" },
  { Icon: Compass,        top: "22%", left: "26%", size: 24, duration: 15, delay: 1.2 },
  { Icon: BookOpen,       top: "54%", left: "60%", size: 22, duration: 21, delay: 0.3, accent: "gold" },
  { Icon: Target,         top: "90%", left: "8%",  size: 20, duration: 17, delay: 1.8 },
];

export function StudyBackdrop() {
  return (
    <>
      <div className="study-aurora" aria-hidden="true" />
      <div className="study-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`study-particle ${
              p.accent === "gold"
                ? "accent-gold"
                : p.accent === "emerald"
                  ? "accent-emerald"
                  : ""
            }`}
            style={{
              top: p.top,
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <p.Icon size={p.size} strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </>
  );
}
