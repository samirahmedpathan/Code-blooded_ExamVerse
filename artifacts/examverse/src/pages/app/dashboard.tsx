import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { findExam, findLanguage } from "@/lib/exams";
import { useT } from "@/lib/i18n";
import { MOCK_DATA } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Clock,
  PlayCircle,
  Target,
  Sparkles,
  Newspaper,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";

interface DashboardTask {
  id: string;
  title: string;
  time: string;
  type: string;
  typeColor: string;
}

const TASKS_BY_EXAM: Record<string, DashboardTask[]> = {
  JEE: [
    { id: "t-jee-1", title: "Review Rotational Motion formulas", time: "25 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-jee-2", title: "Solve 10 Medium PYQs (Mechanics)", time: "45 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-jee-3", title: "Read NCERT Chemistry Ch 9 — Coordination", time: "60 min", type: "New Concept", typeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  ],
  NEET: [
    { id: "t-neet-1", title: "Revise Human Physiology — Neural Control", time: "25 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-neet-2", title: "20 PYQs on Genetics", time: "40 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-neet-3", title: "Read NCERT Biology Ch 5 — Reproduction", time: "60 min", type: "New Concept", typeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  ],
  UPSC: [
    { id: "t-upsc-1", title: "Revise Fundamental Rights", time: "30 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-upsc-2", title: "Today's current affairs digest", time: "20 min", type: "Daily", typeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    { id: "t-upsc-3", title: "Read Spectrum — INC Sessions", time: "45 min", type: "New Concept", typeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  ],
  SSC: [
    { id: "t-ssc-1", title: "Quant — DI sets practice", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-ssc-2", title: "Revise English idioms list", time: "20 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-ssc-3", title: "Reasoning puzzles (10)", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  GATE: [
    { id: "t-gate-1", title: "Revise OS — Process Synchronization", time: "40 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-gate-2", title: "Engineering Math — Linear Algebra drill", time: "45 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  BANK: [
    { id: "t-bank-1", title: "Banking awareness daily capsule", time: "15 min", type: "Daily", typeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    { id: "t-bank-2", title: "Quant sectional mock — 25 Qs", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-bank-3", title: "English RC passages (3)", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  CAT: [
    { id: "t-cat-1", title: "VARC — 2 RC passages", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-cat-2", title: "DILR set practice", time: "40 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  KCET: [
    { id: "t-kcet-1", title: "KCET PYQ Biology drill", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-kcet-2", title: "Karnataka GK quick read", time: "15 min", type: "Daily", typeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  ],
  TNPSC: [
    { id: "t-tnpsc-1", title: "Tamil Nadu history revision", time: "30 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-tnpsc-2", title: "Aptitude PYQ pack — 20 Qs", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  TSPSC: [
    { id: "t-tspsc-1", title: "Telangana movement notes", time: "30 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { id: "t-tspsc-2", title: "Aptitude practice", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  ],
  CTET: [
    { id: "t-ctet-1", title: "Pedagogy MCQs (15)", time: "25 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-ctet-2", title: "EVS revision", time: "30 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  ],
  NDA: [
    { id: "t-nda-1", title: "Math — Trigonometry PYQ", time: "30 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { id: "t-nda-2", title: "GK current capsule", time: "15 min", type: "Daily", typeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const {
    todayCredits,
    todayCompletedTaskIds,
    state,
    streak,
    weeklyAccuracy,
    weeklyMinutes,
    toggleTask,
  } = useProgress();
  const [, navigate] = useLocation();
  const [mentorPreview, setMentorPreview] = useState("");
  const { t: tr } = useT();

  const exam = findExam(user?.targetExam);
  const lang = findLanguage(user?.language);
  const tasks = TASKS_BY_EXAM[exam.code] ?? TASKS_BY_EXAM.JEE;
  const completedCount = tasks.filter((task) => todayCompletedTaskIds.includes(task.id)).length;

  const recommendedQuiz =
    MOCK_DATA.quizzes.find(
      (q) => q.exam === exam.code && !state.completedQuizIds.includes(q.id),
    ) ?? MOCK_DATA.quizzes.find((q) => q.exam === exam.code) ?? MOCK_DATA.quizzes[0];

  const todayCa = MOCK_DATA.currentAffairs.find((c) =>
    c.relevance.includes(exam.code),
  ) ?? MOCK_DATA.currentAffairs[0];

  const submitMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorPreview.trim()) {
      sessionStorage.setItem("examverse:mentor_seed", mentorPreview.trim());
    }
    navigate("/app/mentor");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{lang.greeting},</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            {tr("common.welcomeBack")} · {exam.name}
          </p>
        </div>
        <Link href="/app/mood">
          <Button variant="outline" className="gap-2 rounded-full">
            <Brain className="w-4 h-4" />
            {tr("nav.mood")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">{tr("common.streak")}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="text-3xl font-bold text-primary">{state.totalCredits}</div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {tr("common.credits")} <span className="text-primary/70">(+{todayCredits} {tr("common.today")})</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {Math.floor(weeklyMinutes / 60)}h {weeklyMinutes % 60}m
            </div>
            <div className="text-sm font-medium text-muted-foreground">{tr("common.thisWeek")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className={`text-3xl font-bold mb-1 ${weeklyAccuracy >= 70 ? "text-green-600" : weeklyAccuracy >= 50 ? "text-amber-600" : "text-foreground"}`}>
              {weeklyAccuracy || "—"}{weeklyAccuracy ? "%" : ""}
            </div>
            <div className="text-sm font-medium text-muted-foreground">{tr("dashboard.weeklyAccuracy")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{tr("dashboard.todayPlan")}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {completedCount}/{tasks.length} · +{completedCount * 10} {tr("common.credits")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => {
                const done = todayCompletedTaskIds.includes(task.id);
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      done
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          done ? "bg-primary border-primary" : "border-primary/50 hover:bg-primary/20"
                        }`}
                      >
                        {done && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                      </span>
                      <div>
                        <p className={`font-medium text-sm ${done ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${task.typeColor}`}>{task.type}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${done ? "text-primary" : "text-muted-foreground"}`}>
                      +10
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <h3 className="font-semibold mb-2">{tr("dashboard.askMentor")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tr("mentor.placeholder")}
                  </p>
                  <form className="flex gap-2" onSubmit={submitMentor}>
                    <Input
                      placeholder={`Plan my next 2 hours for ${exam.short}...`}
                      className="flex-1 bg-muted/50"
                      value={mentorPreview}
                      onChange={(e) => setMentorPreview(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      `Plan next 2 hours for ${exam.short}`,
                      `Quiz me on ${exam.subjects[0]}`,
                      "I'm feeling burnt out",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          sessionStorage.setItem("examverse:mentor_seed", s);
                          navigate("/app/mentor");
                        }}
                        className="text-xs px-2 py-1 bg-secondary rounded-full cursor-pointer hover:bg-secondary/80"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                {tr("dashboard.recommended")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-1">{recommendedQuiz.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {recommendedQuiz.subject} · {recommendedQuiz.questionCount} Qs · {recommendedQuiz.estTimeMin} min
              </p>
              <Link href={`/app/quizzes/${recommendedQuiz.id}`}>
                <Button className="w-full shadow-sm">{tr("common.startNow")} (+25)</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-500" />
                {tr("dashboard.todaysCA")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-2 line-clamp-2">{todayCa.headline}</p>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-3">{todayCa.summary}</p>
              <Link href="/app/current-affairs">
                <Button variant="outline" className="w-full">{tr("common.read")}</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Daily Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-4">Solve 15 mixed PYQs in under 20 minutes.</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Reward: 50 credits</span>
                <span>0/15</span>
              </div>
              <Link href="/app/challenges">
                <Button variant="outline" className="w-full">Start Challenge</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
