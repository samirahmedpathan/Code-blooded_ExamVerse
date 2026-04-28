import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Target, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter, ZAxis } from "recharts";

const TREND_DATA = [
  { day: '1', accuracy: 45 },
  { day: '2', accuracy: 52 },
  { day: '3', accuracy: 48 },
  { day: '4', accuracy: 60 },
  { day: '5', accuracy: 55 },
  { day: '6', accuracy: 65 },
  { day: '7', accuracy: 68 },
];

const HEATMAP_DATA = [
  { x: 1, y: 1, z: 20, subject: "Physics", topic: "Mechanics", mastery: "Low" },
  { x: 2, y: 1, z: 80, subject: "Physics", topic: "Optics", mastery: "High" },
  { x: 3, y: 1, z: 50, subject: "Physics", topic: "Thermo", mastery: "Medium" },
  { x: 1, y: 2, z: 90, subject: "Chem", topic: "Physical", mastery: "High" },
  { x: 2, y: 2, z: 30, subject: "Chem", topic: "Organic", mastery: "Low" },
  { x: 3, y: 2, z: 70, subject: "Chem", topic: "Inorganic", mastery: "High" },
  { x: 1, y: 3, z: 40, subject: "Math", topic: "Algebra", mastery: "Medium" },
  { x: 2, y: 3, z: 60, subject: "Math", topic: "Calculus", mastery: "Medium" },
  { x: 3, y: 3, z: 10, subject: "Math", topic: "Geometry", mastery: "Low" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your performance and weaknesses.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Overall Accuracy</p>
            <p className="text-3xl font-bold text-foreground">68%</p>
            <p className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> +5% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Questions Solved</p>
            <p className="text-3xl font-bold text-foreground">420</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Time</p>
            <p className="text-3xl font-bold text-foreground">48h</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Target Score</p>
            <p className="text-3xl font-bold text-primary">220</p>
            <p className="text-xs text-primary/80 mt-1">Projected: 185</p>
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
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 6 }} />
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
            <p className="text-sm text-muted-foreground mb-2">Focus on these topics to maximize score improvement.</p>
            {[
              { topic: "Rotational Mechanics", sub: "Physics", impact: "High Impact" },
              { topic: "Organic Chemistry Rxns", sub: "Chemistry", impact: "High Impact" },
              { topic: "Coordinate Geometry", sub: "Math", impact: "Medium Impact" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10">
                <div>
                  <h4 className="font-medium text-sm">{item.topic}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{item.sub}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-destructive">{item.impact}</span>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="text-xs h-8">Practice <ArrowRight className="w-3 h-3 ml-1" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Topic Mastery Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground">Larger bubbles indicate more questions attempted. Color indicates mastery.</p>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="x" name="Subject" tick={false} axisLine={false} />
                <YAxis type="number" dataKey="y" name="Topic" tick={false} axisLine={false} />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Attempted" />
                <Tooltip cursor={{strokeDasharray: '3 3'}} 
                   content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-md text-sm">
                          <p className="font-bold">{data.subject} - {data.topic}</p>
                          <p>Mastery: <span className={data.mastery === 'High' ? 'text-green-500' : data.mastery === 'Low' ? 'text-red-500' : 'text-orange-500'}>{data.mastery}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Mastery" data={HEATMAP_DATA} fill="hsl(var(--primary))">
                  {HEATMAP_DATA.map((entry, index) => (
                    <circle key={`cell-${index}`} fill={entry.mastery === 'High' ? '#22c55e' : entry.mastery === 'Medium' ? '#f59e0b' : '#ef4444'} opacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
