import { useState } from 'react';
import { ExamConfig } from '@/types/exam';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, BookOpen, Gauge } from 'lucide-react';

interface ExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (config: ExamConfig) => void;
}

export const ExamConfigModal = ({
  isOpen,
  onClose,
  onStartExam,
}: ExamConfigModalProps) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStart = () => {
    onStartExam({
      numberOfQuestions,
      subject,
      difficulty,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Configure Your Exam
          </DialogTitle>
          <DialogDescription>
            Customize the exam parameters based on your study needs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Number of Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                Number of Questions
              </Label>
              <span className="text-sm font-semibold text-primary">{numberOfQuestions}</span>
            </div>
            <Slider
              value={[numberOfQuestions]}
              onValueChange={([value]) => setNumberOfQuestions(value)}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Subject Context */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Context (optional)</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Calculus II - Integration"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              Difficulty
            </Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStart} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Start Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
