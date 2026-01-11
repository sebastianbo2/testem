import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  History as HistoryIcon,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
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
import { Exam, Question } from "@/types/exam";
import { getScoreColor } from "@/utils/getScoreColors";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/config/supabaseClient";
import formatDate from "@/utils/formatDate";
import { ThemeToggle } from "@/components/ThemeToggle";

type SortField = "title" | "score" | "completed_at" | "totalQuestions";
type SortOrder = "asc" | "desc";

export default function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<any>(null);
  const [sortField, setSortField] = useState<SortField>("completed_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pastExams, setPastExams] = useState<Exam[] | null>(null);

  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user?.id) return;

    async function getUserExams() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("exams")
          .select()
          .eq("user_id", session?.user.id);

        if (error) throw error;

        if (!data || data.length === 0) {
          setPastExams([]);
          return;
        }

        // Clean transformation instead of mutation
        const transformedData = data.map(
          (exam): Exam => ({
            ...exam,
            questions: (exam.questions as Question[]) || [],
            numOfQuestions: (exam.questions as Question[])?.length || 0,
          })
        );

        setPastExams(transformedData);
      } catch (err: any) {
        setPageError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getUserExams();
  }, [session]);

  // Derived Stats with Null/Empty Safety
  const totalExams = pastExams?.length ?? 0;

  const averageScore = useMemo(() => {
    if (!pastExams || totalExams === 0) return 0;
    const sum = pastExams.reduce((acc, exam) => acc + (exam.score || 0), 0);
    return Math.round(sum / totalExams);
  }, [pastExams, totalExams]);

  const passRate = useMemo(() => {
    if (!pastExams || totalExams === 0) return 0;
    const passed = pastExams.filter((e) => e.score >= 50).length;
    return Math.round((passed / totalExams) * 100);
  }, [pastExams, totalExams]);

  const sortedHistory = useMemo(() => {
    if (!pastExams) return [];

    return [...pastExams].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "score":
          comparison = a.score - b.score;
          break;
        case "completed_at":
          comparison =
            new Date(a.completed_at).getTime() -
            new Date(b.completed_at).getTime();
          break;
        case "totalQuestions":
          comparison = (a.numOfQuestions || 0) - (b.numOfQuestions || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [pastExams, sortField, sortOrder]);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div>
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                Analyze your past performance
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Always visible, but show 0/NA if empty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
            <p className="text-3xl font-bold">{totalExams}</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className="text-3xl font-bold">{averageScore}%</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Pass Rate</p>
            <p className="text-3xl font-bold">{passRate}%</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your history...</p>
          </div>
        ) : sortedHistory.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select
                  value={sortField}
                  onValueChange={(v) => setSortField(v as SortField)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed_at">
                      Completion Date
                    </SelectItem>
                    <SelectItem value="title">Name</SelectItem>
                    <SelectItem value="score">Grade</SelectItem>
                    <SelectItem value="totalQuestions">Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Exam Name <SortIcon field="title" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("totalQuestions")}
                    >
                      <div className="flex items-center">
                        Questions <SortIcon field="totalQuestions" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("score")}
                    >
                      <div className="flex items-center">
                        Grade <SortIcon field="score" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("completed_at")}
                    >
                      <div className="flex items-center">
                        Completed <SortIcon field="completed_at" />
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
                      <TableCell className="font-medium">
                        {exam.title}
                      </TableCell>
                      <TableCell>{exam.numOfQuestions}</TableCell>
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
                        {formatDate(exam.completed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-20 border rounded-xl bg-card">
            <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">No exam history yet</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              You haven't completed any exams. Once you finish a test, your
              results will appear here.
            </p>
            <Link to="/documents">
              <Button className="mt-6">Create Your First Exam</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
