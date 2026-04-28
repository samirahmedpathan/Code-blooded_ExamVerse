import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Mentor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("examverse:mentor_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{
        id: "init",
        role: "assistant",
        content: "Hi there! I'm your Examverse AI Mentor. I can help explain tough concepts, create study plans, or just give you a motivation boost when you need it. How can I help today?"
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("examverse:mentor_chat", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simple keyword-based local response logic
    let responseText = MOCK_DATA.mentorResponses.default;
    const lower = text.toLowerCase();
    
    if (lower.includes("explain") || lower.includes("what is") || lower.includes("concept")) {
      responseText = MOCK_DATA.mentorResponses.concept;
    } else if (lower.includes("plan") || lower.includes("schedule") || lower.includes("hours")) {
      responseText = MOCK_DATA.mentorResponses.planning;
    } else if (lower.includes("motivat") || lower.includes("stress") || lower.includes("give up")) {
      responseText = MOCK_DATA.mentorResponses.motivation;
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: "assistant", content: responseText }]);
    }, 1000 + Math.random() * 500); // 1-1.5s delay
  };

  const handleVoice = () => {
    toast({
      title: "Coming Soon",
      description: "Voice input is currently under development.",
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-h-[800px] flex flex-col relative border border-border rounded-xl overflow-hidden bg-card">
      <div className="bg-muted/30 border-b border-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold leading-tight">AI Mentor</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block" /> Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted/50 border border-border rounded-tl-sm'
            }`}>
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
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {["Explain Newton's Third Law simply", "Plan my next 3 hours", "Give me a motivation boost"].map(prompt => (
            <button 
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-xs whitespace-nowrap bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors border border-border"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form 
          className="flex items-end gap-2"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <div className="flex-1 relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor anything..."
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
          <Button type="submit" size="icon" className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90" disabled={!input.trim() || isTyping}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
