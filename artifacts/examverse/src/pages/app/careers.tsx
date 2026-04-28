import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, IndianRupee, Target, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { findExam } from "@/lib/exams";
import { findCareerPath, CAREER_PATHS } from "@/lib/careers";
import { useState } from "react";

export default function Careers() {
  const { user } = useAuth();
  const exam = findExam(user?.targetExam);
  const [scope, setScope] = useState<"my" | "all">("my");
  const myPath = findCareerPath(exam.code);

  const allOtherPaths = Object.values(CAREER_PATHS).filter(
    (p) => p.exam !== exam.code,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            Career Pathways
          </h1>
          <p className="text-muted-foreground mt-1">
            Jobs and posts you can target with {exam.short}.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-full text-sm">
          <button
            onClick={() => setScope("my")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              scope === "my" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            For {exam.short}
          </button>
          <button
            onClick={() => setScope("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              scope === "all" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            All exams
          </button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl">
              {exam.emoji}
            </div>
            <div>
              <p className="font-semibold">{exam.name}</p>
              <p className="text-xs text-muted-foreground">{myPath.tagline}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm py-1.5 px-3 gap-1.5">
            <Target className="w-3.5 h-3.5" /> {myPath.jobs.length} career options
          </Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPath.jobs.map((job) => (
          <Card key={job.title} className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold leading-snug">{job.title}</h3>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {job.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {job.description}
              </p>
              {job.payBand && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                  <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium">{job.payBand}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {scope === "all" && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-xl font-semibold">Explore other exams</h2>
          {allOtherPaths.map((path) => {
            const otherExam = findExam(path.exam);
            return (
              <Card key={path.exam}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-lg">{otherExam.emoji}</span>
                        {otherExam.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {path.tagline}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs gap-1">
                      <ArrowRight className="w-3 h-3" /> {path.jobs.length} jobs
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {path.jobs.map((j) => (
                      <Badge key={j.title} variant="secondary" className="text-[10px]">
                        {j.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
