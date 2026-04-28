import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/lib/progress";

export default function QuizPlayer() {
  const [, params] = useRoute("/app/quizzes/:id");
  const id = params?.id || "q-jee-1";
  const quiz = MOCK_DATA.quizzes.find(q => q.id === id) || MOCK_DATA.quizzes[0];
  const questions = MOCK_DATA.sampleQuizQuestions;
  const { recordQuiz } = useProgress();
  const recordedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished && !recordedRef.current) {
      const correct = Object.entries(selectedAnswers).filter(
        ([i, ans]) => ans === questions[Number(i)].correctIndex,
      ).length;
      recordQuiz(quiz.id, questions.length, correct);
      recordedRef.current = true;
    }
  }, [isFinished, selectedAnswers, questions, quiz.id, recordQuiz]);

  const question = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isCorrect = isAnswered && selectedAnswers[currentIndex] === question.correctIndex;
  
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: idx }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const score = Object.values(selectedAnswers).filter((ans, i) => ans === questions[i].correctIndex).length;

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Quiz Complete!</h1>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
            <Sparkles className="w-4 h-4" /> +25 credits earned
          </span>
        </div>
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl font-bold text-primary mb-2">{score}/{questions.length}</div>
            <p className="text-xl text-muted-foreground">Accuracy: {Math.round((score/questions.length)*100)}%</p>
            
            <div className="bg-muted/30 p-6 rounded-xl text-left border border-border mt-8">
              <h3 className="font-semibold mb-4 text-lg">Performance Analysis</h3>
              <p className="text-sm mb-4">You did well on basic moment of inertia concepts, but struggled slightly with kinematic equations applied to rotation.</p>
              <h4 className="font-medium text-sm mb-2">Recommended Revision:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Rotational Kinematics</li>
                <li>Torque and angular acceleration relationship</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => window.location.href='/app/quizzes'}>Back to Library</Button>
              <Button onClick={() => window.location.href='/app/analytics'}>View Full Analytics</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
          {isCorrect ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          Difficulty: {isCorrect ? "Harder ↑" : "Easier ↓"}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="text-lg md:text-xl font-medium leading-relaxed mb-8">
            {question.text}
          </div>

          <div className="space-y-3 mt-auto">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const isCorrectOption = question.correctIndex === idx;
              
              let styleClass = "border-border hover:bg-accent/50 hover:border-primary/30";
              if (isAnswered) {
                if (isCorrectOption) {
                  styleClass = "bg-green-50 border-green-500 text-green-900 dark:bg-green-950/40 dark:border-green-700 dark:text-green-100";
                } else if (isSelected && !isCorrectOption) {
                  styleClass = "bg-red-50 border-red-500 text-red-900 dark:bg-red-950/40 dark:border-red-700 dark:text-red-100";
                } else {
                  styleClass = "opacity-50 border-border bg-transparent";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${styleClass}`}
                >
                  <span className="font-medium">{opt}</span>
                  {isAnswered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  {!isAnswered && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-5"
              >
                <h4 className="font-semibold text-primary mb-2">Explanation</h4>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        <div className="p-4 border-t border-border bg-muted/10 flex justify-between rounded-b-xl">
          <Button variant="ghost" disabled={currentIndex === 0} onClick={() => {setCurrentIndex(c=>c-1); setShowExplanation(selectedAnswers[currentIndex-1] !== undefined)}}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button disabled={!isAnswered} onClick={handleNext} className="min-w-[120px]">
            {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
