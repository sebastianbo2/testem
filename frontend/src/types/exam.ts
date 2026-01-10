export type QuestionType = 'multiple-choice' | 'short-answer' | 'true-false' | 'long-answer';

export interface Question {
  id: string
  question: string;
  type: QuestionType;
  options?: string[];
  userAnswer?: string;
  correctAnswer: string;
  isLatex: boolean;
}

export interface ExamConfig {
  numberOfQuestions: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  createdAt: Date;
  completedAt?: Date;
  score?: number;
}

export interface Document {
  id: string;
  displayName: string;
  storagePath: string
  status: string;
  createdAt: string;
  type?: 'pdf' | 'txt';
  folderId?: string;
  size?: string;
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
