import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, BatteryCharging, BatteryFull, BatteryMedium, BatteryWarning, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const MOODS = [
  { id: "stressed", label: "Stressed", icon: BatteryWarning, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-900", desc: "Overwhelmed or anxious" },
  { id: "low", label: "Low Focus", icon: Battery, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-900", desc: "Tired or distracted" },
  { id: "neutral", label: "Neutral", icon: BatteryMedium, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-900", desc: "Okay, ready to study" },
  { id: "motivated", label: "Motivated", icon: BatteryCharging, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-900", desc: "Good energy, ready for challenges" },
  { id: "energetic", label: "Energetic", icon: BatteryFull, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", desc: "High focus, bring it on" },
];

export default function MoodPlanner() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;
    localStorage.setItem("examverse:lastMood", selectedMood);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">How are you feeling today?</h1>
        <p className="text-muted-foreground text-lg">Your study plan adapts to your energy levels.</p>
      </div>

      {!submitted ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 md:grid-cols-5 gap-4"
        >
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <Card 
                key={mood.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected ? `ring-2 ring-offset-2 ring-offset-background ${mood.border} ${mood.bg}` : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedMood(mood.id)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <mood.icon className={`w-10 h-10 ${mood.color}`} />
                  <div>
                    <h3 className="font-semibold text-foreground">{mood.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{mood.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Plan Adjusted!</h3>
                <p className="text-muted-foreground">Based on your mood, we've tweaked your schedule for today.</p>
              </div>
              
              <div className="bg-background rounded-xl p-4 text-left border border-border shadow-sm">
                <h4 className="font-semibold mb-3">Today's Adapted Tasks:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">Light</span>
                    <span className="text-sm">Review formulas for Rotational Motion (20 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-medium mt-0.5">Focus</span>
                    <span className="text-sm">Solve 5 Easy PYQs (15 min)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium mt-0.5">Rest</span>
                    <span className="text-sm">10 minute screen-free break. Hydrate!</span>
                  </li>
                </ul>
              </div>

              <Button onClick={() => window.location.href='/app'} className="w-full sm:w-auto">Go to Dashboard</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!submitted && (
        <div className="flex justify-center mt-8">
          <Button 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] rounded-full" 
            disabled={!selectedMood}
            onClick={handleSubmit}
          >
            Generate Plan
          </Button>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-border">
        <h3 className="font-semibold mb-4 text-center">Your Mood History (Last 7 Days)</h3>
        <div className="flex justify-center items-end h-32 gap-2 sm:gap-4">
          {[60, 40, 80, 50, 90, 70, 85].map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className="w-8 sm:w-12 bg-primary/20 rounded-t-md relative hover:bg-primary/40 transition-colors" style={{ height: `${val}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-popover text-popover-foreground px-2 py-1 rounded shadow-md whitespace-nowrap">
                  {['Low', 'Stressed', 'Motivated', 'Neutral', 'Energetic', 'Motivated', 'Energetic'][i]}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
