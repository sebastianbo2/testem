import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgress = ({
  value,
  size = 200,
  strokeWidth = 12,
  className,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 80) return 'text-success';
    if (value >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-1000 ease-out', getColor())}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-5xl font-bold', getColor())}>{value}%</span>
        <span className="text-sm text-muted-foreground mt-1">Score</span>
      </div>
    </div>
  );
};
