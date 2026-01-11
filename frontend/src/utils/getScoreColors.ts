export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
};

// export const getScoreBadgeVariant = (
//   score: number
// ): "default" | "destructive" | "secondary" => {
//   if (score >= 80) return "default";
//   if (score >= 50) return "secondary";
//   return "destructive";
// };

export const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "bg-success-muted text-success border-success/30";
    if (score >= 50) return "bg-warning/10 text-warning border-warning/30";
    return "bg-error-muted text-destructive border-destructive/30";
  };