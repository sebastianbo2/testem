import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  History,
  BookOpen,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getScoreBadgeVariant } from "@/utils/getScoreColors";
import supabase from "@/config/supabaseClient";
import { Exam, Question } from "@/types/exam";
import formatDate from "@/utils/formatDate";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logOutUser, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pastExams, setPastExams] = useState<Exam[] | null>(null);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchDashboardData() {
      try {
        setIsLoading(true);

        // 1. Fetch Exams (we fetch all to calculate the average score)
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("user_id", session.user.id)
          .order("completed_at", { ascending: false });

        // 2. Fetch Document Count
        const { count, error: docError } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        if (examsError) throw examsError;
        if (docError) throw docError;

        if (examsData) {
          const transformed: Exam[] = examsData.map((e) => ({
            ...e,
            questions: (e.questions as Question[]) || [],
            numOfQuestions: (e.questions as Question[])?.length || 0,
          }));
          setPastExams(transformed);
        }

        if (count !== null) setDocCount(count);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [session]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalExams = pastExams?.length ?? 0;
    const avgScore =
      totalExams > 0
        ? Math.round(
            pastExams!.reduce((acc, curr) => acc + curr.score, 0) / totalExams
          )
        : 0;

    return { totalExams, avgScore };
  }, [pastExams]);

  const handleExamCardClick = (examId: string) => {
    navigate("/results", { state: { examId } });
  };

  const handleLogOut = async () => {
    try {
      await logOutUser();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/documents">Documents</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/history">History</Link>
            </Button>
            <Button onClick={handleLogOut} variant="ghost">
              Log out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">Ready to test your knowledge?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-academic">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : docCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-academic">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : `${stats.avgScore}%`}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-academic">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : stats.totalExams}
                  </p>
                  <p className="text-sm text-muted-foreground">Exams Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Library Card */}
          <Card className="card-academic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>
                    Upload and manage study materials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select documents to generate customized exams based on your
                notes.
              </p>
              <Button asChild className="w-full">
                <Link to="/documents">
                  <FolderOpen className="w-4 h-4 mr-2" /> Browse Documents
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Exam History Card */}
          <Card className="card-academic flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle>Recent History</CardTitle>
                  <CardDescription>Your last 3 attempts</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <div className="space-y-3 mb-4 min-h-[210px]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[210px]">
                    <Loader2 className="animate-spin text-muted-foreground" />
                  </div>
                ) : pastExams && pastExams.length > 0 ? (
                  pastExams.slice(0, 3).map((exam) => (
                    <div
                      key={exam.id}
                      onClick={() => handleExamCardClick(exam.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:cursor-pointer hover:bg-accent transition-colors border border-transparent hover:border-border"
                    >
                      <div>
                        <h4 className="text-sm font-medium">{exam.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(exam.completed_at)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-semibold",
                          getScoreBadgeVariant(exam.score)
                        )}
                      >
                        {exam.score}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  /* Empty state that fills the same 210px height */
                  <div className="flex flex-col items-center justify-center h-[210px] rounded-lg border-2 border-dashed border-muted/50">
                    <p className="text-sm text-muted-foreground text-center px-4">
                      No exams taken yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Button stays right here, no mt-auto */}
              <Button variant="outline" asChild className="w-full">
                <Link to="/history">View All History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
