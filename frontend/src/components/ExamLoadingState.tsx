import { Skeleton } from '@/components/ui/skeleton';
import { Brain } from 'lucide-react';
import Logo from './icons/Logo';

export const ExamLoadingState = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <Logo/>
        
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Parsing Knowledge...</h2>
          <p className="text-muted-foreground">Our AI is analyzing your documents and generating personalized questions.</p>
        </div>

        <div className="space-y-3 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mx-auto" />
          <Skeleton className="h-4 w-3/5 mx-auto" />
        </div>
      </div>
    </div>
  );
};
