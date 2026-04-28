import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Clock, PlayCircle, PlusCircle, Target } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">Let's continue your preparation for {user?.targetExam || "JEE"}.</p>
        </div>
        <Link href="/app/mood">
          <Button variant="outline" className="gap-2 rounded-full">
            <Brain className="w-4 h-4" />
            Check in your mood
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">3</div>
            <div className="text-sm font-medium text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-bold text-foreground mb-1">12h</div>
            <div className="text-sm font-medium text-muted-foreground">Studied this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="text-3xl font-bold text-foreground mb-1 text-green-600">68%</div>
            <div className="text-sm font-medium text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <div className="text-lg font-bold text-foreground mb-1 truncate w-full">Rotational Motion</div>
            <div className="text-sm font-medium text-destructive">Weakest Topic</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Today's Plan</span>
                <span className="text-sm font-normal text-muted-foreground">Generated based on 'Good' mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Review Rotational Motion formulas", time: "25 min", type: "Revision", typeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
                { title: "Solve 10 Medium PYQs", time: "45 min", type: "Practice", typeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
                { title: "Read NCERT Chemistry Ch 4", time: "60 min", type: "New Concept", typeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <button className="w-5 h-5 rounded-full border-2 border-primary/50 hover:bg-primary/20 transition-colors" />
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${task.typeColor}`}>{task.type}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <h3 className="font-semibold mb-2">Ask your AI Mentor</h3>
                  <p className="text-sm text-muted-foreground mb-4">Stuck on a concept? Need a study plan? Just ask.</p>
                  <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); window.location.href = '/app/mentor'; }}>
                    <Input placeholder="Explain Newton's Third Law simply..." className="flex-1 bg-muted/50" />
                    <Button type="submit" size="icon"><ArrowRight className="w-4 h-4" /></Button>
                  </form>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full cursor-pointer hover:bg-secondary/80">Plan next 2 hours</span>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full cursor-pointer hover:bg-secondary/80">Quiz me on Polity</span>
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
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-1">Coordination Compounds</h4>
              <p className="text-sm text-muted-foreground mb-4">Chemistry • Topic Quiz</p>
              <div className="w-full bg-background rounded-full h-2 mb-4 overflow-hidden border border-border">
                <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
              <Link href="/app/quizzes/q2">
                <Button className="w-full shadow-sm">Resume Quiz</Button>
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
                <span>Reward: 50 points</span>
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
