import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus, Settings2 } from "lucide-react";

export default function Scheduler() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Play sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch(e) {}
      
      if (!isBreak) {
        setSessionCount(c => c + 1);
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Scheduler</h1>
        <p className="text-muted-foreground mt-1">Plan your week and focus with the Pomodoro timer.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <CardTitle className="text-lg">Weekly Plan</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add Session
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b text-center text-sm font-medium bg-muted/30">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="py-3 border-r last:border-r-0">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 h-[400px] overflow-y-auto relative">
                {Array.from({length: 7}).map((_, col) => (
                  <div key={col} className="border-r last:border-r-0 relative border-b min-h-full">
                    {/* Mock event */}
                    {col === 0 && (
                      <div className="absolute top-4 left-1 right-1 bg-blue-100 border border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300 rounded p-1 text-xs">
                        <div className="font-semibold truncate">Physics PYQs</div>
                        <div className="text-[10px] opacity-80">2 Hrs</div>
                      </div>
                    )}
                    {col === 2 && (
                      <div className="absolute top-20 left-1 right-1 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-800 dark:text-green-300 rounded p-1 text-xs">
                        <div className="font-semibold truncate">Chemistry NCERT</div>
                        <div className="text-[10px] opacity-80">1.5 Hrs</div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-10">
                  {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="w-full border-t border-foreground"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`overflow-hidden transition-colors ${isBreak ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200' : 'bg-primary/5 border-primary/20'}`}>
            <CardHeader className="pb-0 pt-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pomodoro
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Settings2 className="w-4 h-4" /></Button>
              </div>
              <div className="flex justify-center gap-4 mt-2 mb-4">
                <button className={`text-sm font-medium pb-1 border-b-2 ${!isBreak ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Focus</button>
                <button className={`text-sm font-medium pb-1 border-b-2 ${isBreak ? 'border-green-600 text-green-600' : 'border-transparent text-muted-foreground'}`}>Short Break</button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8">
              <div className="text-6xl md:text-7xl font-bold tracking-tighter tabular-nums my-6 text-foreground">
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className={`w-32 rounded-full font-bold ${isActive ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
                  onClick={toggleTimer}
                >
                  {isActive ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Start</>}
                </Button>
                <Button variant="outline" size="icon" className="rounded-full w-11 h-11" onClick={resetTimer}>
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
              <div className="mt-8 text-sm font-medium text-muted-foreground">
                Sessions completed: {sessionCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Focusing on</CardTitle>
            </CardHeader>
            <CardContent>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Rotational Motion Formulas</option>
                <option>Polity Chapter 4</option>
                <option>Custom Task...</option>
              </select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
