import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  History as HistoryIcon,
  ChevronLeft,
} from "lucide-react";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockExamHistory } from "@/lib/mockData";
import { ExamHistoryItem } from "@/types/exam";

type SortField = "title" | "score" | "completedAt" | "totalQuestions";
type SortOrder = "asc" | "desc";

const extendedMockHistory: ExamHistoryItem[] = [
  ...mockExamHistory,
  {
    id: "exam-5",
    title: "Differential Equations Test",
    subject: "Calculus",
    score: 88,
    totalQuestions: 18,
    completedAt: new Date("2024-02-25"),
  },
  {
    id: "exam-6",
    title: "Vector Calculus Quiz",
    subject: "Calculus",
    score: 72,
    totalQuestions: 12,
    completedAt: new Date("2024-02-28"),
  },
  {
    id: "exam-7",
    title: "Thermodynamics Final",
    subject: "Physics",
    score: 95,
    totalQuestions: 40,
    completedAt: new Date("2024-03-01"),
  },
  {
    id: "exam-8",
    title: "Organic Chemistry Lab",
    subject: "Chemistry",
    score: 38,
    totalQuestions: 22,
    completedAt: new Date("2024-03-05"),
  },
  {
    id: "exam-9",
    title: "Matrix Theory",
    subject: "Linear Algebra",
    score: 81,
    totalQuestions: 16,
    completedAt: new Date("2024-03-08"),
  },
  {
    id: "exam-10",
    title: "Electromagnetism Basics",
    subject: "Physics",
    score: 67,
    totalQuestions: 28,
    completedAt: new Date("2024-03-10"),
  },
];

const getScoreBadgeVariant = (
  score: number
): "default" | "destructive" | "secondary" => {
  if (score >= 80) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
};

export default function History() {
  const [sortField, setSortField] = useState<SortField>("completedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedHistory = useMemo(() => {
    return [...extendedMockHistory].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "score":
          comparison = a.score - b.score;
          break;
        case "completedAt":
          comparison =
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime();
          break;
        case "totalQuestions":
          comparison = a.totalQuestions - b.totalQuestions;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  const averageScore = Math.round(
    extendedMockHistory.reduce((acc, exam) => acc + exam.score, 0) /
      extendedMockHistory.length
  );

  const totalExams = extendedMockHistory.length;
  const passedExams = extendedMockHistory.filter((e) => e.score >= 50).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HistoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Exam History
              </h1>
              <p className="text-muted-foreground">
                View and analyze your past exam attempts
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
            <p className="text-3xl font-bold text-foreground">{totalExams}</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className="text-3xl font-bold text-foreground">
              {averageScore}%
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Pass Rate</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.round((passedExams / totalExams) * 100)}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select
              value={sortField}
              onValueChange={(value) => setSortField(value as SortField)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completedAt">Completion Date</SelectItem>
                <SelectItem value="title">Name</SelectItem>
                <SelectItem value="score">Grade</SelectItem>
                <SelectItem value="totalQuestions">Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Order:</span>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Exam Name
                    <SortIcon field="title" />
                  </div>
                </TableHead>
                <TableHead>Subject</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("totalQuestions")}
                >
                  <div className="flex items-center">
                    Questions
                    <SortIcon field="totalQuestions" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center">
                    Grade
                    <SortIcon field="score" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("completedAt")}
                >
                  <div className="flex items-center">
                    Completed
                    <SortIcon field="completedAt" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.map((exam) => (
                <TableRow
                  key={exam.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {exam.subject}
                    </Badge>
                  </TableCell>
                  <TableCell>{exam.totalQuestions}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getScoreColor(
                        exam.score
                      )}`}
                    >
                      {exam.score}%
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(exam.completedAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State (if needed in future) */}
        {sortedHistory.length === 0 && (
          <div className="text-center py-12">
            <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No exam history yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Start your first exam to see your progress here.
            </p>
            <Link to="/documents">
              <Button className="mt-4">Start First Exam</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
