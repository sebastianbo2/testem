import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Brain, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionNavigator } from "@/components/exam/QuestionNavigator";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { ExamLoadingState } from "@/components/ExamLoadingState";
import { generateExam } from "@/lib/mockApi";
import { Question, ExamConfig } from "@/types/exam";
import { Link } from "react-router-dom";
import { Document } from "@/types/exam";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/config/supabaseClient";

type UploadStatus = "idle" | "uploading" | "indexing" | "success" | "error";

const validateAnswers = async (questions: Question[], user: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/answers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user, questions: questions }),
    }
  );

  return await response.json();
};

const ActiveExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>("");
  const currExamId = useRef(location.state?.examId);

  const { session } = useAuth();
  useEffect(() => {
    if (session) {
      setCurrentUserId(session.user.id);
    }
  }, [session]);

  const config = location.state?.config as ExamConfig | undefined;

  useEffect(() => {
    if (!config) {
      navigate("/documents");
      return;
    }

    const loadExam = async () => {
      setIsLoading(true);
      const examQuestions = location.state?.questions as Question[] | undefined;
      setQuestions(examQuestions);
      setIsLoading(false);
    };

    loadExam();
  }, [config, navigate]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === questionId) {
          q.userAnswer = answer;
        }
        return q;
      })
    );
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSubmitExam = async () => {
    const answeredQuestions = await validateAnswers(questions, currentUserId);

    // update supabase
    const { data, error } = await supabase
      .from("exams")
      .update({
        questions: answeredQuestions,
        completed_at: new Date(),
        score: 67, // TODO: dynamic scoring
      })
      .eq("id", currExamId.current);

    if (error) {
      console.error(
        "an error occured while updating exam entry in supabase: ",
        error
      );
      return;
    }

    navigate("/results", { state: { questions: answeredQuestions } });
  };

  if (isLoading) {
    return <ExamLoadingState />;
  }

  console.log("QUESTIONS: ", questions);

  const answeredCount = questions.filter((q) => q.userAnswer).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="pointer-events-none">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {answeredCount} / {questions.length} answered
            </span>
            <Button onClick={handleSubmitExam} className="gap-2">
              <Send className="w-4 h-4" />
              Submit Exam
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigator */}
          <aside className="hidden lg:block w-[55] shrink-0">
            <QuestionNavigator
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionClick={handleQuestionClick}
            />
          </aside>

          {/* Questions List */}
          <main className="flex-1 max-w-3xl mx-auto space-y-6 pb-24">
            {questions.map((question, index) => (
              <div
                key={index}
                ref={(el) => (questionRefs.current[index] = el)}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <QuestionCard
                  question={question}
                  index={index}
                  onAnswerChange={handleAnswerChange}
                />
              </div>
            ))}

            <div className="flex justify-center pt-8">
              <Button
                onClick={handleSubmitExam}
                size="lg"
                className="gap-2 px-8"
              >
                <Send className="w-5 h-5" />
                Submit Exam
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActiveExam;
