import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink, Video, FileText, Book } from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";

export default function Resources() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Resources & Books</h1>
        <p className="text-muted-foreground mt-1">High-quality free materials and recommended texts.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Free Resource Finder</h2>
        <div className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search NCERT, formulas, mock tests..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="flex h-9 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option>All Formats</option>
            <option>PDF</option>
            <option>Video</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_DATA.resources.map(res => (
            <Card key={res.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${res.format === 'Video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {res.format === 'Video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{res.title}</h3>
                    <p className="text-xs text-muted-foreground">{res.source} • {res.estTimeMin} mins</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {res.format === 'Video' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Book className="w-5 h-5 text-primary" /> Recommended Books
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Based on your target exam and current weak areas.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DATA.books.map(book => (
            <Card key={book.id} className="overflow-hidden flex flex-col h-full">
              {/* CSS Book Mockup Cover */}
              <div className="h-40 bg-gradient-to-br from-primary/80 to-sidebar-primary flex items-center justify-center p-6 text-center text-primary-foreground border-b border-border shadow-inner">
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight mb-1">{book.title}</h3>
                  <p className="text-xs opacity-80">{book.author}</p>
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{book.level} Level</span>
                <p className="text-sm leading-relaxed mb-4 flex-1">"{book.reason}"</p>
                <Button variant="secondary" className="w-full mt-auto">Find Online</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
