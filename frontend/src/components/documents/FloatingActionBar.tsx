import { FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionBarProps {
  selectedCount: number;
  onGenerateExam: () => void;
  onClearSelection: () => void;
}

export const FloatingActionBar = ({
  selectedCount,
  onGenerateExam,
  onClearSelection,
}: FloatingActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="floating-bar flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        <span className="font-medium">
          {selectedCount} Document{selectedCount !== 1 ? 's' : ''} Selected
        </span>
      </div>
      
      <div className="h-6 w-px bg-border" />
      
      <Button variant="ghost" onClick={onClearSelection}>
        Clear
      </Button>
      
      <Button onClick={onGenerateExam} className="gap-2">
        <Sparkles className="w-4 h-4" />
        Generate Exam
      </Button>
    </div>
  );
};
