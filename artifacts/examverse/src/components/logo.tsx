import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconClass }: { className?: string; iconClass?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <BookOpen className={cn("w-10 h-10 text-primary", iconClass)} strokeWidth={1.5} />
      <div className="flex flex-col items-center">
        <span className="font-sans font-bold text-2xl text-foreground tracking-tight">Examverse</span>
        <span className="font-sans text-sm text-muted-foreground mt-0.5">Learn. Practice. Succeed.</span>
      </div>
    </div>
  );
}
