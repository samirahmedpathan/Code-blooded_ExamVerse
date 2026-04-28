import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Mic, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { findExam, findLanguage } from "@/lib/exams";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FALLBACK_PREFIX =
  "(Mentor is offline right now, here's a quick thought while we reconnect.) ";

function chooseFallback(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("explain") ||
    lower.includes("what is") ||
    lower.includes("concept")
  ) {
    return MOCK_DATA.mentorResponses.concept;
  }
  if (
    lower.includes("plan") ||
    lower.includes("schedule") ||
    lower.includes("hours")
  ) {
    return MOCK_DATA.mentorResponses.planning;
  }
  if (
    lower.includes("motivat") ||
    lower.includes("stress") ||
    lower.includes("give up") ||
    lower.includes("tired")
  ) {
    return MOCK_DATA.mentorResponses.motivation;
  }
  return MOCK_DATA.mentorResponses.default;
}

export default function Mentor() {
  const { user } = useAuth();
  const { t } = useT();
  const exam = findExam(user?.targetExam);
  const lang = findLanguage(user?.language);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("examverse:mentor_chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {
        /* fall through */
      }
    }
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: `${lang.greeting}${
          user?.name ? `, ${user.name}` : ""
        }. I'm your Examverse Mentor — here to explain tough concepts, plan your next study block for ${exam.name}, quiz you on PYQs, or give you a real pep talk. What's on your mind?`,
      },
    ]);
  }, [user?.name, exam.name, lang.greeting]);

  // Pick up a seed prompt forwarded from the dashboard
  useEffect(() => {
    if (seededRef.current) return;
    const seed = sessionStorage.getItem("examverse:mentor_seed");
    if (seed && messages.length > 0) {
      seededRef.current = true;
      sessionStorage.removeItem("examverse:mentor_seed");
      setTimeout(() => handleSend(seed), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("examverse:mentor_chat", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendToMentor = async (history: Message[]): Promise<string> => {
    const apiUrl = `${import.meta.env.BASE_URL}api/mentor/chat`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        examTarget: exam.name,
        studentName: user?.name ?? "Student",
        language: lang.label,
      }),
    });
    if (!res.ok) {
      throw new Error(`Mentor request failed: ${res.status}`);
    }
    const data = (await res.json()) as { reply?: string };
    if (!data.reply) {
      throw new Error("Empty mentor reply");
    }
    return data.reply.trim();
  };

  const handleSend = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendToMentor(nextHistory);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      console.error(err);
      const fallback = FALLBACK_PREFIX + chooseFallback(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallback,
        },
      ]);
      toast({
        title: "Mentor is offline",
        description: "Showing a fallback response. Try again in a moment.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoice = () => {
    toast({
      title: "Coming Soon",
      description: "Voice input is currently under development.",
    });
  };

  const clearChat = () => {
    localStorage.removeItem("examverse:mentor_chat");
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: `${lang.greeting}${
          user?.name ? `, ${user.name}` : ""
        }. Fresh start. What would you like to work on for ${exam.short}?`,
      },
    ]);
  };

  const quickPrompts = [
    `Plan my next 3 hours for ${exam.short}`,
    `Explain ${exam.subjects[0]} basics in simple terms`,
    `Quiz me on ${exam.subjects[0]} (5 questions)`,
    "Give me a real pep talk",
  ];

  return (
    <div className="h-[calc(100vh-8rem)] max-h-[820px] flex flex-col relative border border-border rounded-xl overflow-hidden bg-card">
      <div className="bg-muted/30 border-b border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold leading-tight flex items-center gap-2">
            {t("mentor.title")}
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-primary/80 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Live
            </span>
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block" />
            Tuned for {exam.short} · {lang.native}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          New chat
        </Button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-6"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                msg.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/50 border border-border rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 bg-primary/20 text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-muted/50 border border-border rounded-tl-sm flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              className="text-xs whitespace-nowrap bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors border border-border"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("mentor.placeholder")}
              disabled={isTyping}
              className="pr-10 rounded-full h-12 bg-muted/30"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 text-muted-foreground hover:text-foreground rounded-full w-10 h-10"
              onClick={handleVoice}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
