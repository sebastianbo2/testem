import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { ExamLoadingState } from '@/components/ExamLoadingState';
import { generateExam } from '@/lib/mockApi';
import { Question, ExamConfig } from '@/types/exam';
import { Link } from 'react-router-dom';

const ActiveExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const config = location.state?.config as ExamConfig | undefined;

  useEffect(() => {
    if (!config) {
      navigate('/documents');
      return;
    }

    const loadExam = async () => {
      setIsLoading(true);
      const examQuestions = await generateExam(config);
      setQuestions(examQuestions);
      setIsLoading(false);
    };

    loadExam();
  }, [config, navigate]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, userAnswer: answer } : q
      )
    );
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmitExam = () => {
    navigate('/results', { state: { questions } });
  };

  if (isLoading) {
    return <ExamLoadingState />;
  }

  const answeredCount = questions.filter((q) => q.userAnswer).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Testem</h1>
              <p className="text-xs text-muted-foreground">
                {config?.subject || 'Exam in Progress'}
              </p>
            </div>
          </Link>
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
          <aside className="hidden lg:block w-48 shrink-0">
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
                key={question.id}
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
