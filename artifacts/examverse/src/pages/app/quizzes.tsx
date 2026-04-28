import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { findExam } from "@/lib/exams";

export default function Quizzes() {
  const { user } = useAuth();
  const { state } = useProgress();
  const [search, setSearch] = useState("");
  const [showOnlyMyExam, setShowOnlyMyExam] = useState(true);
  const [activeSubject, setActiveSubject] = useState("All");

  const exam = findExam(user?.targetExam);

  const examFiltered = useMemo(() => {
    if (!showOnlyMyExam) return MOCK_DATA.quizzes;
    return MOCK_DATA.quizzes.filter((q) => q.exam === exam.code);
  }, [showOnlyMyExam, exam.code]);

  const subjects = useMemo(() => {
    const set = new Set<string>(["All"]);
    examFiltered.forEach((q) => set.add(q.subject));
    return Array.from(set);
  }, [examFiltered]);

  const filteredQuizzes = useMemo(() => {
    return examFiltered
      .filter((q) =>
        activeSubject === "All" ? true : q.subject === activeSubject,
      )
      .filter((q) => {
        const s = search.toLowerCase();
        return (
          q.title.toLowerCase().includes(s) ||
          q.subject.toLowerCase().includes(s) ||
          q.topic.toLowerCase().includes(s)
        );
      });
  }, [examFiltered, activeSubject, search]);

  const recommended = useMemo(() => {
    return MOCK_DATA.quizzes
      .filter((q) => q.exam === exam.code)
      .filter((q) => !state.completedQuizIds.includes(q.id))
      .slice(0, 3);
  }, [exam.code, state.completedQuizIds]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quiz Library</h1>
          <p className="text-muted-foreground mt-1">
            Tailored for {exam.short} · earn 25 credits per quiz
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-full text-sm">
          <button
            onClick={() => setShowOnlyMyExam(true)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              showOnlyMyExam ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            My Exam
          </button>
          <button
            onClick={() => setShowOnlyMyExam(false)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              !showOnlyMyExam ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            All Exams
          </button>
        </div>
      </div>

      {showOnlyMyExam && recommended.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Recommended for {exam.short}</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {recommended.map((q) => (
                <Link key={q.id} href={`/app/quizzes/${q.id}`}>
                  <div className="rounded-lg border border-border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition cursor-pointer">
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">{q.subject}</p>
                    <p className="font-semibold text-sm mt-1 line-clamp-2">{q.title}</p>
                    <p className="text-xs text-muted-foreground mt-2">{q.questionCount} Qs · {q.estTimeMin} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, subjects..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {subjects.map((sub) => (
          <Badge
            key={sub}
            variant={sub === activeSubject ? "default" : "outline"}
            className="cursor-pointer text-sm py-1.5 px-4"
            onClick={() => setActiveSubject(sub)}
          >
            {sub}
          </Badge>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const completed = state.completedQuizIds.includes(quiz.id);
          return (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {quiz.subject}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      quiz.difficulty === "Hard"
                        ? "text-red-500 border-red-200"
                        : quiz.difficulty === "Medium"
                        ? "text-orange-500 border-orange-200"
                        : "text-green-500 border-green-200"
                    }
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{quiz.title}</h3>
                <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />{" "}
                    <span>
                      {quiz.exam} • {quiz.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> <span>{quiz.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> <span>{quiz.estTimeMin} mins estimated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />{" "}
                    <span>{quiz.avgAccuracy}% Avg Accuracy</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 border-t border-border mt-auto flex bg-muted/10 items-center justify-between">
                <Link href={`/app/quizzes/${quiz.id}`} className="w-full pt-4">
                  <Button className="w-full" variant={completed ? "outline" : "default"}>
                    {completed ? "Practice again" : "Start Practice"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}

        {filteredQuizzes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
            No quizzes found. Try the "All Exams" tab to broaden the list.
          </div>
        )}
      </div>
    </div>
  );
}
