import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Flame, Crown, Medal } from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";

export default function Challenges() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Challenges & Streak</h1>
        <p className="text-muted-foreground mt-1">Stay consistent. Small daily steps lead to big results.</p>
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
            <p className="text-muted-foreground max-w-md">Solve 15 mixed subject PYQs in under 20 minutes with at least 80% accuracy.</p>
            <div className="flex gap-4 mt-4 text-sm font-medium">
              <span className="text-orange-600 flex items-center"><Star className="w-4 h-4 mr-1"/> 50 Points</span>
              <span className="text-blue-600 flex items-center"><Trophy className="w-4 h-4 mr-1"/> Special Badge</span>
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">Accept Challenge</Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Current Streak: 3 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => {
                  const isFilled = i < 3; // Mock 3 days filled
                  const isToday = i === 3;
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium border ${
                        isFilled ? 'bg-orange-500 text-white border-orange-600' : 
                        isToday ? 'border-orange-500/50 bg-orange-500/10 text-orange-600' : 
                        'border-border bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/20 rounded-xl border border-border w-24 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Medal className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium leading-tight">First Week</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/20 rounded-xl border border-border w-24 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium leading-tight">100 Qs</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-muted/5 rounded-xl border border-border border-dashed w-24 text-center opacity-50 grayscale">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium leading-tight">Top 10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <p className="text-xs text-muted-foreground">Weekly points ranking</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {MOCK_DATA.leaderboard.map((user, i) => (
                <div key={user.id} className={`flex items-center justify-between p-4 ${user.name === 'Student' ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-5 font-bold text-sm text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <span className={`font-medium text-sm ${user.name === 'Student' ? 'text-primary' : ''}`}>{user.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{user.points} <span className="text-muted-foreground font-normal text-xs">pts</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Quick inline icon component to avoid adding another import right now
function Brain(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>
}
