import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Brain, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/CircularProgress";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { Question } from "@/types/exam";
import { submitExam } from "@/lib/mockApi";
import Logo from "@/components/icons/Logo";

// TMP ANSWERED QUESTIONS
const questions: Question[] = [
  {
    question: "What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?",
    type: "multiple-choice",
    options: [
      "$3x^2 + 4x - 5$",
      "$3x^2 + 2x - 5$",
      "$x^2 + 4x - 5$",
      "$3x^3 + 4x^2 - 5$",
    ],
    modelAnswer: "$3x^2 + 4x - 5$",
    isCorrect: true,
  },
  {
    question: "\n\\[\n\\int_0^1 x^2 dx = \\frac{1}{3}\n\\]\n",
    type: "true-false",
    options: ["True", "False"],
    modelAnswer: "$3x^2 + 4x - 5$",
    isCorrect: true,
  },
  {
    question: "Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$",
    type: "short-answer",
    options: [],
    modelAnswer: "$3x^2 + 4x - 5$",
    isCorrect: false,
  },
  {
    question: "Which matrix operation is NOT commutative?",
    type: "multiple-choice",
    options: [
      "Addition",
      "Scalar multiplication",
      "Matrix multiplication",
      "Transpose",
    ],
    modelAnswer: "$3x^2 + 4x - 5$",
    isCorrect: true,
  },
  {
    question:
      "Explain the concept of eigenvalues and provide the formula for finding them for a 2×2 matrix.",
    type: "long-answer",
    options: [],
    modelAnswer: "$3x^2 + 4x - 5$",
    isCorrect: false,
  },
];

const PastExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [score, setScore] = useState<number | null>(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const questions = location.state?.questions as Question[] | undefined;
  console.log(questions);

  useEffect(() => {
    if (!questions) {
      navigate("/documents");
      return;
    }

    // const calculateResults = async () => {
    //   setIsLoading(true);
    //   const result = await submitExam(questions);
    //   setScore(result.score);
    //   setTotalCorrect(result.totalCorrect);
    //   setIsLoading(false);
    // };

    // calculateResults();
  }, [questions, navigate]);

  if (!questions || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-subtle text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <p className="text-muted-foreground">Calculating results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Logo />
          <Button
            variant="outline"
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
            You answered {totalCorrect} out of {questions.length} questions
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
                {questions.length - totalCorrect} Incorrect
              </span>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Review Your Answers
          </h3>

          {questions.map((question, index) => (
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

export default PastExam;
