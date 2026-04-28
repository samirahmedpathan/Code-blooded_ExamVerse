import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, BookOpen, Target, CheckCircle2 } from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";

export default function Quizzes() {
  const [search, setSearch] = useState("");

  const filteredQuizzes = MOCK_DATA.quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    q.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Quiz Library</h1>
          <p className="text-muted-foreground mt-1">Practice with PYQs and topic-wise tests.</p>
        </div>
      </div>

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
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Physics", "Chemistry", "Polity", "Math", "Biology"].map(sub => (
          <Badge key={sub} variant={sub === "All" ? "default" : "outline"} className="cursor-pointer text-sm py-1.5 px-4">
            {sub}
          </Badge>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow flex flex-col">
            <CardContent className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{quiz.subject}</Badge>
                <Badge variant="outline" className={
                  quiz.difficulty === 'Hard' ? 'text-red-500 border-red-200' :
                  quiz.difficulty === 'Medium' ? 'text-orange-500 border-orange-200' :
                  'text-green-500 border-green-200'
                }>
                  {quiz.difficulty}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{quiz.title}</h3>
              <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" /> <span>{quiz.exam} • {quiz.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> <span>{quiz.questionCount} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> <span>{quiz.estTimeMin} mins estimated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> <span>{quiz.avgAccuracy}% Avg Accuracy</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 border-t border-border mt-auto flex bg-muted/10 items-center justify-between">
              <Link href={`/app/quizzes/${quiz.id}`} className="w-full pt-4">
                <Button className="w-full">Start Practice</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {filteredQuizzes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
            No quizzes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
