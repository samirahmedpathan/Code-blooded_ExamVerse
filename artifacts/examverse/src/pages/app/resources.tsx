import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  ExternalLink,
  Video,
  FileText,
  Book,
  Star,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { MOCK_DATA, type Book as BookType } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { findExam } from "@/lib/exams";

const INITIAL_BOOKS = 6;
const PAGE_SIZE = 6;

export default function Resources() {
  const { user } = useAuth();
  const exam = findExam(user?.targetExam);
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState<"All" | "PDF" | "Video" | "Article">("All");
  const [scope, setScope] = useState<"my" | "all">("my");
  const [topic, setTopic] = useState("All");
  const [visibleBooks, setVisibleBooks] = useState(INITIAL_BOOKS);

  const examResources = useMemo(() => {
    return MOCK_DATA.resources
      .filter((r) => (scope === "my" ? r.exam.includes(exam.code) : true))
      .filter((r) => (format === "All" ? true : r.format === format))
      .filter((r) => {
        const s = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(s) ||
          r.subject.toLowerCase().includes(s) ||
          r.source.toLowerCase().includes(s)
        );
      });
  }, [scope, exam.code, format, search]);

  const examBooks = useMemo(() => {
    return MOCK_DATA.books.filter((b) =>
      scope === "my" ? b.exam.includes(exam.code) : true,
    );
  }, [scope, exam.code]);

  const topics = useMemo(() => {
    const set = new Set<string>(["All"]);
    examBooks.forEach((b) => set.add(b.topic));
    return Array.from(set);
  }, [examBooks]);

  const filteredBooks = useMemo(() => {
    return examBooks.filter((b) =>
      topic === "All" ? true : b.topic === topic,
    );
  }, [examBooks, topic]);

  const visible = filteredBooks.slice(0, visibleBooks);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resources & Books</h1>
          <p className="text-muted-foreground mt-1">
            Curated for {exam.short} — books, PDFs, videos and notes.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-full text-sm">
          <button
            onClick={() => setScope("my")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              scope === "my" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            For {exam.short}
          </button>
          <button
            onClick={() => setScope("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              scope === "all" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            All Exams
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Free Resource Finder</h2>
        <div className="flex gap-4 max-w-2xl flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NCERT, formulas, mock tests..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="flex h-9 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
          >
            <option value="All">All Formats</option>
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
            <option value="Article">Article</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {examResources.map((res) => (
            <Card key={res.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      res.format === "Video"
                        ? "bg-red-100 text-red-600"
                        : res.format === "Article"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {res.format === "Video" ? (
                      <Video className="w-5 h-5" />
                    ) : res.format === "Article" ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{res.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {res.source} • {res.estTimeMin} mins · {res.subject}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {res.format === "Video" ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
          {examResources.length === 0 && (
            <div className="md:col-span-2 py-8 text-center text-muted-foreground border border-dashed rounded-xl bg-card">
              No matching resources. Try switching to "All Exams".
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" /> Recommended Books
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Hand-picked for {exam.short}, organized by topic.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {topics.map((t) => (
              <Badge
                key={t}
                variant={t === topic ? "default" : "outline"}
                className="cursor-pointer text-xs py-1 px-3"
                onClick={() => {
                  setTopic(t);
                  setVisibleBooks(INITIAL_BOOKS);
                }}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-xl bg-card">
              No book recommendations for this topic yet — try another topic.
            </div>
          )}
        </div>

        {visibleBooks < filteredBooks.length && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisibleBooks((v) => v + PAGE_SIZE)}
              className="gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Load more books ({filteredBooks.length - visibleBooks} more)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: BookType }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="h-40 bg-gradient-to-br from-primary/80 to-sidebar-primary flex items-center justify-center p-6 text-center text-primary-foreground border-b border-border shadow-inner relative">
        <div>
          <h3 className="font-serif font-bold text-lg leading-tight mb-1">{book.title}</h3>
          <p className="text-xs opacity-80">{book.author}</p>
        </div>
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/15 backdrop-blur px-2 py-0.5 rounded-full">
          {book.level}
        </span>
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {book.topic}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
            <Star className="w-3 h-3 fill-current" /> {book.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-4 flex-1">"{book.reason}"</p>
        <Button
          variant="secondary"
          className="w-full mt-auto gap-2"
          onClick={() =>
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(book.title + " " + book.author + " buy online")}`,
              "_blank",
            )
          }
        >
          <Sparkles className="w-3.5 h-3.5" /> Find online
        </Button>
      </CardContent>
    </Card>
  );
}
