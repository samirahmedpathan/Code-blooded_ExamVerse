import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Flame, Crown, Medal, Brain, CheckCircle2 } from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";
import { useProgress } from "@/lib/progress";
import { useToast } from "@/hooks/use-toast";

const TODAY_CHALLENGE_ID = "ch-speed-run";

export default function Challenges() {
  const { state, streak, todayCompletedChallengeIds, acceptChallenge } = useProgress();
  const { toast } = useToast();

  const accepted = todayCompletedChallengeIds.includes(TODAY_CHALLENGE_ID);

  const handleAccept = () => {
    if (accepted) return;
    acceptChallenge(TODAY_CHALLENGE_ID);
    toast({
      title: "Challenge accepted!",
      description: "+50 credits added to your wallet.",
    });
  };

  // Active dates set for the streak grid
  const activeSet = new Set(state.activeDates);
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Challenges & Streak</h1>
        <p className="text-muted-foreground mt-1">
          Stay consistent. Small daily steps lead to big results.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Flame className="w-32 h-32 text-orange-500" />
        </div>
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 mb-4">
              <Zap className="w-4 h-4 mr-2" /> Today's Challenge
            </div>
            <h2 className="text-2xl font-bold mb-2">The Speed Run</h2>
            <p className="text-muted-foreground max-w-md">
              Solve 15 mixed subject PYQs in under 20 minutes with at least 80% accuracy.
            </p>
            <div className="flex gap-4 mt-4 text-sm font-medium">
              <span className="text-orange-600 flex items-center">
                <Star className="w-4 h-4 mr-1" /> 50 Credits
              </span>
              <span className="text-blue-600 flex items-center">
                <Trophy className="w-4 h-4 mr-1" /> Special Badge
              </span>
            </div>
          </div>
          <Button
            size="lg"
            disabled={accepted}
            onClick={handleAccept}
            className={`w-full md:w-auto rounded-full px-8 ${
              accepted
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {accepted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Accepted today
              </>
            ) : (
              "Accept Challenge"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Current Streak: {streak} day{streak === 1 ? "" : "s"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (27 - i));
                  const key = d.toISOString().slice(0, 10);
                  const isFilled = activeSet.has(key);
                  const isToday = key === todayKey;
                  return (
                    <div
                      key={i}
                      title={key}
                      className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium border ${
                        isFilled
                          ? "bg-orange-500 text-white border-orange-600"
                          : isToday
                          ? "border-orange-500/50 bg-orange-500/10 text-orange-600"
                          : "border-border bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Each day with at least one completed task or quiz lights up.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <BadgeTile
                  icon={Medal}
                  label="First Week"
                  unlocked={streak >= 7}
                  color="blue"
                />
                <BadgeTile
                  icon={Brain}
                  label="100 Qs"
                  unlocked={state.quizAttempts.reduce((s, q) => s + q.total, 0) >= 100}
                  color="purple"
                />
                <BadgeTile
                  icon={Crown}
                  label="Top 10"
                  unlocked={state.totalCredits >= 1000}
                  color="amber"
                />
                <BadgeTile
                  icon={Trophy}
                  label="500 Credits"
                  unlocked={state.totalCredits >= 500}
                  color="emerald"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <p className="text-xs text-muted-foreground">Weekly credits ranking</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {MOCK_DATA.leaderboard.map((u, i) => {
                const isMe = u.name === "Student";
                const displayPoints = isMe ? state.totalCredits : u.points;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-4 ${isMe ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 font-bold text-sm text-center ${
                          i === 0
                            ? "text-yellow-500"
                            : i === 1
                            ? "text-slate-400"
                            : i === 2
                            ? "text-amber-700"
                            : "text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {u.name.charAt(0)}
                      </div>
                      <span className={`font-medium text-sm ${isMe ? "text-primary" : ""}`}>
                        {isMe ? "You" : u.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {displayPoints} <span className="text-muted-foreground font-normal text-xs">pts</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BadgeTile({
  icon: Icon,
  label,
  unlocked,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  unlocked: boolean;
  color: "blue" | "purple" | "amber" | "emerald";
}) {
  const palette: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border w-24 text-center ${
        unlocked ? "bg-muted/20 border-border" : "bg-muted/5 border-dashed border-border opacity-50 grayscale"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? palette[color] : "bg-muted"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium leading-tight">{label}</span>
    </div>
  );
}
