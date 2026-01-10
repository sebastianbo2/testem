import { cn } from '@/lib/utils';
import { Question } from '@/types/exam';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionClick: (index: number) => void;
}

export const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  onQuestionClick,
}: QuestionNavigatorProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 fixed top-32 w-52">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={cn(
              'nav-dot',
              currentQuestionIndex === index && 'active',
              question.userAnswer && 'answered'
            )}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="nav-dot active scale-75" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="nav-dot answered scale-75" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="nav-dot scale-75" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
