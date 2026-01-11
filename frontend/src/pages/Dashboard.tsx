import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  FolderOpen,
  History,
  BookOpen,
  Clock,
  TrendingUp,
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
import { mockExamHistory } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getScoreBadgeVariant } from "@/utils/getScoreColors";

const Dashboard = () => {
  const { logOutUser } = useAuth();

  const handleLogOut = async (e) => {
    try {
      await logOutUser();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/documents">Documents</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/history">History</Link>
            </Button>
            <Button onClick={handleLogOut} variant="ghost" asChild>
              <Link to="/login">Log out</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Ready to test your knowledge? Select documents and generate
            personalized exams.
          </p>
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
                  <p className="text-2xl font-bold">8</p>
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
                  <p className="text-2xl font-bold">75%</p>
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
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Exams Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Library */}
          <Card className="card-academic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>
                    Upload and manage your study materials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your documents are organized into folders. Select documents to
                generate customized exams based on your study materials.
              </p>
              <Button asChild className="w-full">
                <Link to="/documents">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse Documents
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Exam History */}
          <Card className="card-academic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle>Exam History</CardTitle>
                  <CardDescription>
                    Review your past exam attempts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {mockExamHistory.slice(0, 3).map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-medium">{exam.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {exam.completedAt.toLocaleDateString()}
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
                ))}
              </div>
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
