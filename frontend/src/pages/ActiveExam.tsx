import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Brain, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionNavigator } from "@/components/exam/QuestionNavigator";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { ExamLoadingState } from "@/pages/loading/ExamLoadingState";
import { generateExam } from "@/lib/mockApi";
import { Exam, Question } from "@/types/exam";
import { Link } from "react-router-dom";
import { Document } from "@/types/exam";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/config/supabaseClient";
import GradingLoading from "./loading/GradingLoading";
import { useExamSession } from "@/hooks/useExamSession";

const validateAnswers = async (questions: Question[], user: string) => {
  const response = await fetch(`/api/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user, questions: questions }),
  });

  return await response.json();
};

const ActiveExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>("");
  const [isGrading, setIsGrading] = useState(false);

  const { questions, setQuestions, examTitle, examId, isLoading } = useExamSession();

  const { session } = useAuth();
  useEffect(() => {
    if (session) {
      setCurrentUserId(session.user.id);
    }
  }, [session]);

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
    setIsGrading(true);

    try {
      console.log("SENDING TO SERVER:", JSON.stringify(questions[0], null, 2)); // Check the first question structure

      // A. Grade
      const correctedQuestions = await validateAnswers(questions, currentUserId);
      console.log(correctedQuestions);

      const totalQuestions = correctedQuestions.length;
      const numCorrect = correctedQuestions.filter(
        (q: Question) => q.isCorrect
      ).length;
      const finalScore =
        totalQuestions > 0 ? Math.round((numCorrect / totalQuestions) * 100) : 0;

      const payload = {
        title: examTitle,
        questions: correctedQuestions,
        score: finalScore,
        correct_count: numCorrect,
        completed_at: new Date(),
        user_id: currentUserId,
      };

      let resultId = examId;

      if (examId) {
        // SCENARIO A: UPDATE (Retake) - Overwrite existing row
        const { error } = await supabase
          .from("exams")
          .update(payload)
          .eq("id", examId);

        if (error) throw error;
      } else {
        // SCENARIO B: INSERT (New Exam) - Create row for the first time
        const { data, error } = await supabase
          .from("exams")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        resultId = data.id;
      }

      navigate("/results", { state: { examId: resultId } });
    } catch (error) {
      console.error("Submission error:", error);
      setIsGrading(false);
    }
  };

  if (isLoading) {
    return <ExamLoadingState />;
  }

  const answeredCount = questions.filter((q) => q.userAnswer).length;

  if (isGrading) {
    return <GradingLoading />;
  }

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
              <Button onClick={handleSubmitExam} size="lg" className="gap-2 px-8">
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
