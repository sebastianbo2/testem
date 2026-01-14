import { Question } from "@/types/exam";
import { LatexRenderer } from "../LatexRenderer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  index: number;
  onAnswerChange: (questionId: number, answer: string) => void;
  showResults?: boolean;
}

export const QuestionCard = ({
  question,
  index,
  onAnswerChange,
  showResults = false,
}: QuestionCardProps) => {
  const isCorrect = question.isCorrect;

  const getResultClasses = () => {
    if (!showResults) return "";
    return isCorrect ? "question-correct" : "question-incorrect";
  };

  // console.log(question.modelAnswer);

  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={question.userAnswer || ""}
            onValueChange={(value) => onAnswerChange(index, value)}
            disabled={showResults}
            className="space-y-3"
          >
            {question.options?.map((option, optIndex) => (
              <Label
                htmlFor={`${index}-${optIndex}`}
                className="flex-1 cursor-pointer"
                key={`${index}-${optIndex}`}
              >
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors",
                    showResults &&
                      question.userAnswer === option &&
                      "bg-success-muted border-success",
                    showResults &&
                      question.userAnswer === option &&
                      !isCorrect &&
                      "bg-error-muted border-destructive",
                    showResults &&
                      question.userAnswer != option &&
                      !isCorrect &&
                      option === question.modelAnswer &&
                      "bg-success-muted border-success"
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={`${index}-${optIndex}`}
                    key={`${index}-${optIndex}`}
                  />
                  <LatexRenderer content={option} />
                </div>
              </Label>
            ))}
          </RadioGroup>
        );

      case "true-false":
        return (
          <ToggleGroup
            type="single"
            value={question.userAnswer || ""}
            onValueChange={(value) => value && onAnswerChange(index, value)}
            disabled={showResults}
            className="justify-start gap-3"
          >
            {["True", "False"].map((option) => (
              <ToggleGroupItem
                key={`${index}-${option}`}
                value={option}
                className={cn(
                  "px-8 py-3 border"
                  // showResults && option === question.correctAnswer && 'bg-success-muted border-success text-success',
                  // showResults && question.userAnswer === option && option !== question.correctAnswer && 'bg-error-muted border-destructive text-destructive'
                )}
              >
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );

      case "short-answer":
        return (
          <div className="space-y-2">
            <Input
              value={question.userAnswer || ""}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              disabled={showResults}
              placeholder="Enter your answer..."
              className={cn(
                "max-w-md",
                showResults && isCorrect && "border-success",
                showResults && !isCorrect && "border-destructive"
              )}
            />
            {showResults && !isCorrect && (
              <div className="text-sm">
                <span className="text-muted-foreground">
                  <LatexRenderer content={`Correct Answer: ${question.modelAnswer}`} />
                </span>
                <span className="text-success font-medium">
                  {/* <LatexRenderer content={question.correctAnswer} /> */}
                </span>
              </div>
            )}
          </div>
        );

      case "long-answer":
        return (
          <div className="space-y-2">
            <Textarea
              value={question.userAnswer || ""}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              disabled={showResults}
              placeholder="Write your detailed answer..."
              rows={4}
              className={cn(
                showResults && isCorrect && "border-success",
                showResults && !isCorrect && "border-destructive"
              )}
            />
            {showResults && (
              <div className="mt-3 p-3 rounded-lg bg-accent/50">
                <span className="text-sm font-medium text-muted-foreground">
                  Model Answer:
                </span>
                {/* <p className="text-sm mt-1">{question.correctAnswer}</p> */}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (question.type) {
      case "multiple-choice":
        return "Multiple Choice";
      case "true-false":
        return "True/False";
      case "short-answer":
        return "Short Answer";
      case "long-answer":
        return "Long Answer";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn("card-academic p-6 animate-fade-in", getResultClasses())}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {index + 1}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {getTypeLabel()}
          </span>
        </div>
        {showResults && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              isCorrect
                ? "bg-success-muted text-success"
                : "bg-error-muted text-destructive"
            )}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      <div className="mb-6 math-block">
        <LatexRenderer content={question.question} />
      </div>

      {renderQuestionContent()}
    </div>
  );
};
