import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const PHASES = [
  {
    id: 1,
    title: "Foundations",
    dates: "Oct 1 - Nov 15",
    progress: 100,
    status: "completed",
    topics: [
      { name: "Basic Math Tools", status: "mastered" },
      { name: "Units & Dimensions", status: "mastered" },
      { name: "Mole Concept", status: "mastered" },
    ]
  },
  {
    id: 2,
    title: "Concept Mastery",
    dates: "Nov 16 - Jan 31",
    progress: 45,
    status: "active",
    topics: [
      { name: "Kinematics", status: "mastered" },
      { name: "Laws of Motion", status: "mastered" },
      { name: "Work, Energy, Power", status: "in-progress" },
      { name: "Rotational Motion", status: "not-started" },
      { name: "Thermodynamics", status: "not-started" },
    ]
  },
  {
    id: 3,
    title: "PYQ Practice",
    dates: "Feb 1 - Mar 15",
    progress: 0,
    status: "upcoming",
    topics: []
  },
  {
    id: 4,
    title: "Mock Tests & Revision",
    dates: "Mar 16 - Apr 30",
    progress: 0,
    status: "upcoming",
    topics: []
  }
];

export default function Roadmap() {
  const { user } = useAuth();
  const [expandedPhase, setExpandedPhase] = useState<number>(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Roadmap</h1>
        <p className="text-muted-foreground mt-1">Personalized timeline to ace {user?.targetExam || "JEE"}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {PHASES.map((phase) => (
            <Card 
              key={phase.id} 
              className={`transition-all ${phase.status === 'active' ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : ''}`}
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-accent/30 rounded-t-xl"
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? 0 : phase.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-primary text-primary-foreground' : 
                    phase.status === 'active' ? 'bg-primary/20 text-primary border-2 border-primary' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {phase.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : phase.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{phase.progress}%</p>
                  </div>
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              
              {expandedPhase === phase.id && phase.topics.length > 0 && (
                <div className="px-5 pb-5 pt-0 border-t border-border mt-2 pt-4 bg-muted/10 rounded-b-xl">
                  <Progress value={phase.progress} className="h-2 mb-6" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {phase.topics.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                        <span className="text-sm font-medium">{topic.name}</span>
                        {topic.status === 'mastered' ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mastered
                          </span>
                        ) : topic.status === 'in-progress' ? (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full flex items-center gap-1">
                            <Circle className="w-3 h-3" /> Not Started
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adjust Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Exam</label>
                <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm">
                  <option>JEE Main & Advanced</option>
                  <option>NEET</option>
                  <option>UPSC CSE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Date</label>
                <input type="date" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" defaultValue="2024-04-01" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Study Hours</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="1" max="14" defaultValue="6" className="w-full" />
                  <span className="text-sm font-medium w-8">6h</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-secondary text-secondary-foreground py-2 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                Recalculate Timeline
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
