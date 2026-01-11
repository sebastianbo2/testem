import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Brain, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { Exam, Question } from "@/types/exam";
import { submitExam } from "@/lib/mockApi";
import Logo from "@/components/icons/Logo";
import LoadingScreen from "./LoadingScreen";
import supabase from "@/config/supabaseClient";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [score, setScore] = useState<number | null>(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);

  const examId = location.state?.examId;

  useEffect(() => {
    async function getExamData() {
      const { data, error } = await supabase
        .from("exams")
        .select()
        .eq("id", examId);

      if (error) {
        console.error("an error occured loading results/past exam: ", error);
        return;
      }

      setExam(data[0]);
    }

    getExamData();
  }, [examId]);

  // const exam.questions = location.state?.exam.questions as Question[] | undefined;
  // console.log(exam.questions);

  // useEffect(() => {
  //   if (!examId) {
  //     navigate("/documents");
  //     return;
  //   }
  // }, [examId]);

  const handleRetakeExam = () => {
    navigate("/exam", { state: { examId } });
  };

  if (!exam || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Logo />
          <Button
            variant="outline"
            onClick={handleRetakeExam}
            className="absolute left-[50%] translate-x-[-50%]"
          >
            Retake This Exam
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Score Overview */}
        <div className="text-center mb-12">
          <CircularProgress value={score || 0} size={220} className="mb-6" />

          <h2 className="text-3xl font-bold text-foreground mb-2">
            Review Your Exam
          </h2>

          <p className="text-muted-foreground mb-6">
            You answered {totalCorrect} out of {exam.questions.length} questions
            correctly.
          </p>

          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{totalCorrect} Correct</span>
            </div>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">
                {exam.questions.length - totalCorrect} Incorrect
              </span>
            </div>
          </div>
        </div>

        {/* questions Review */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Review Your Answers
          </h3>

          {exam.questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              onAnswerChange={() => {}}
              showResults
            />
          ))}

          <div className="flex justify-center pt-8">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
