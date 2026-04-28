import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Trophy,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";
import { findExam } from "@/lib/exams";
import { MOCK_DATA } from "@/lib/mockData";

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const c = new Date(d);
    c.setDate(d.getDate() - i);
    out.push(c.toISOString().slice(0, 10));
  }
  return out;
}

export default function Analytics() {
  const { user } = useAuth();
  const { state, weeklyAccuracy, totalQuestionsSolved, weeklyMinutes, streak } =
    useProgress();
  const exam = findExam(user?.targetExam);

  const days = lastNDays(7);

  const trendData = useMemo(() => {
    return days.map((day) => {
      const attempts = state.quizAttempts.filter((q) => q.date === day);
      const total = attempts.reduce((s, q) => s + q.total, 0);
      const correct = attempts.reduce((s, q) => s + q.correct, 0);
      return {
        day: day.slice(5),
        accuracy: total ? Math.round((correct / total) * 100) : 0,
        attempted: total,
      };
    });
  }, [days, state.quizAttempts]);

  const subjectBars = useMemo(() => {
    const map = new Map<string, { attempted: number; correct: number }>();
    state.quizAttempts.forEach((a) => {
      const quiz = MOCK_DATA.quizzes.find((q) => q.id === a.quizId);
      if (!quiz) return;
      const cur = map.get(quiz.subject) ?? { attempted: 0, correct: 0 };
      cur.attempted += a.total;
      cur.correct += a.correct;
      map.set(quiz.subject, cur);
    });
    return Array.from(map.entries()).map(([subject, v]) => ({
      subject,
      accuracy: v.attempted ? Math.round((v.correct / v.attempted) * 100) : 0,
      attempted: v.attempted,
    }));
  }, [state.quizAttempts]);

  const recommendations = useMemo(() => {
    const weak = subjectBars
      .filter((s) => s.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
    if (weak.length > 0) return weak.map((w) => ({ topic: w.subject, sub: w.subject, impact: w.accuracy < 50 ? "High Impact" : "Medium Impact" }));
    // Fallback: derive from exam subjects
    return exam.subjects.slice(0, 3).map((s, i) => ({
      topic: s,
      sub: exam.short,
      impact: i === 0 ? "High Impact" : "Medium Impact",
    }));
  }, [subjectBars, exam]);

  const hasActivity = state.quizAttempts.length > 0 || state.activeDates.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Real performance, computed from your activity for {exam.short}.
        </p>
      </div>

      {!hasActivity && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5 flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Start practicing to unlock analytics</h3>
              <p className="text-sm text-muted-foreground">
                Take a quiz from your library to begin tracking accuracy, mastery and weak areas.
              </p>
            </div>
            <Link href="/app/quizzes">
              <Button>Browse quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Weekly Accuracy</p>
            <p className="text-3xl font-bold text-foreground">{weeklyAccuracy}%</p>
            <p className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live data
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Questions Solved</p>
            <p className="text-3xl font-bold text-foreground">{totalQuestionsSolved}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Time (7d)</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.floor(weeklyMinutes / 60)}h {weeklyMinutes % 60}m
            </p>
            <p className="text-xs text-muted-foreground mt-1">Across tasks & quizzes</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4" /> Credits
            </p>
            <p className="text-3xl font-bold text-primary">{state.totalCredits}</p>
            <p className="text-xs text-primary/80 mt-1">Streak: {streak} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accuracy Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Prioritized Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              {subjectBars.length > 0
                ? "Computed from your quiz performance."
                : `Default ${exam.short} priorities — start a quiz for personalized picks.`}
            </p>
            {recommendations.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10"
              >
                <div>
                  <h4 className="font-medium text-sm">{item.topic}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {item.sub}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-destructive">
                      {item.impact}
                    </span>
                  </div>
                </div>
                <Link href="/app/quizzes">
                  <Button size="sm" variant="secondary" className="text-xs h-8">
                    Practice <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Subject Mastery
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Accuracy across the subjects you've practiced.
            </p>
          </CardHeader>
          <CardContent className="h-[300px]">
            {subjectBars.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Complete a quiz to populate this chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectBars} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Accuracy %" />
                  <Bar dataKey="attempted" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} name="Questions" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
