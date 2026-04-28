import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Globe, Moon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState("EN");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your profile preferences have been updated.",
    });
  };

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and app preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile</CardTitle>
          <CardDescription>Update your personal details and exam targets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user?.email} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam">Target Exam</Label>
              <select id="exam" className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" defaultValue={user?.targetExam}>
                <option>JEE Main & Advanced</option>
                <option>NEET</option>
                <option>UPSC CSE</option>
                <option>SSC CGL</option>
                <option>GATE</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Daily Target (Hours)</Label>
              <Input id="hours" type="number" defaultValue="6" />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4"><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> App Preferences</CardTitle>
          <CardDescription>Customize how Examverse looks and feels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch to a dark, restful color scheme.</p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Lite Mode (Low Data)</Label>
              <p className="text-sm text-muted-foreground">Disables animations and heavy assets for faster loading on slow networks.</p>
            </div>
            <Switch checked={isLiteMode} onCheckedChange={setIsLiteMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred interface language.</p>
            </div>
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'EN' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setLang('EN')}
              >
                English
              </button>
              <button 
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'HI' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setLang('HI')}
              >
                हिंदी
              </button>
            </div>
          </div>

        </CardContent>
      </Card>

      <div className="pt-4">
        <Button variant="destructive" variant-style="outline" onClick={logout} className="w-full sm:w-auto bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20">
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
