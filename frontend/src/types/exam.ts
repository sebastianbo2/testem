export type QuestionType = 'multiple-choice' | 'short-answer' | 'true-false' | 'long-answer';

export interface Question {
  id?: string
  question: string;
  type: QuestionType;
  options?: string[];
  userAnswer?: string;
  modelAnswer?: string;
  isCorrect?: boolean;
}

export interface ExamConfig {
  numberOfQuestions: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  id: string;
  user_id: string;
  questions: Question[];
  score?: number;
  createdAt: Date;
  completedAt?: Date;
  title?: string;
}

export interface Document {
  id: string;
  user_id: string;
  display_name: string;
  storage_path: string
  status: string;
  created_at: string;
  folder_id: string;
  size: number;
  type: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export interface ExamHistoryItem {
  id: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}
