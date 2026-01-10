import { Question, Document, Folder, ExamHistoryItem } from '@/types/exam';

export const mockFolders: Folder[] = [
  { id: 'folder-1', name: 'Calculus' },
  { id: 'folder-2', name: 'Linear Algebra' },
  { id: 'folder-3', name: 'Physics' },
  { id: 'folder-4', name: 'Chemistry' },
];

// export const mockDocuments: Document[] = [
//   { id: 'doc-1', name: 'Integration Techniques.pdf', type: 'pdf', folderId: 'folder-1', size: '2.4 MB', uploadedAt: '2024-01-15'},
//   { id: 'doc-2', name: 'Differential Equations.pdf', type: 'pdf', folderId: 'folder-1', size: '3.1 MB', uploadedAt: '2024-01-18'},
//   { id: 'doc-3', name: 'Limits and Continuity.txt', type: 'txt', folderId: 'folder-1', size: '156 KB', uploadedAt: '2024-01-20'},
//   { id: 'doc-4', name: 'Matrix Operations.pdf', type: 'pdf', folderId: 'folder-2', size: '1.8 MB', uploadedAt: '2024-01-22'},
//   { id: 'doc-5', name: 'Eigenvalues and Eigenvectors.pdf', type: 'pdf', folderId: 'folder-2', size: '2.2 MB', uploadedAt: '2024-01-25'},
//   { id: 'doc-6', name: 'Mechanics Fundamentals.pdf', type: 'pdf', folderId: 'folder-3', size: '4.5 MB', uploadedAt: '2024-02-01'},
//   { id: 'doc-7', name: 'Thermodynamics.txt', type: 'txt', folderId: 'folder-3', size: '890 KB', uploadedAt: '2024-02-05'},
//   { id: 'doc-8', name: 'Organic Chemistry Basics.pdf', type: 'pdf', folderId: 'folder-4', size: '5.2 MB', uploadedAt: '2024-02-10'},
// ];

export const mockExamHistory: ExamHistoryItem[] = [
  { id: 'exam-1', title: 'Calculus Midterm Prep', subject: 'Calculus', score: 85, totalQuestions: 20, completedAt: new Date('2024-02-15') },
  { id: 'exam-2', title: 'Linear Algebra Quiz', subject: 'Linear Algebra', score: 92, totalQuestions: 15, completedAt: new Date('2024-02-18') },
  { id: 'exam-3', title: 'Physics Practice', subject: 'Physics', score: 45, totalQuestions: 25, completedAt: new Date('2024-02-20') },
  { id: 'exam-4', title: 'Chemistry Concepts', subject: 'Chemistry', score: 78, totalQuestions: 30, completedAt: new Date('2024-02-22') },
];

// CSV format that would come from the API
export const mockExamCSV = `id,type,question,options,correctAnswer,isLatex
q1,multiple-choice,"What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?","$3x^2 + 4x - 5$|$3x^2 + 2x - 5$|$x^2 + 4x - 5$|$3x^3 + 4x^2 - 5$",$3x^2 + 4x - 5$,true
q2,true-false,"The integral $\\int_0^1 x^2 dx = \\frac{1}{3}$","True|False",True,true
q3,short-answer,"Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$",,1,true
q4,multiple-choice,"Which matrix operation is NOT commutative?","Addition|Scalar multiplication|Matrix multiplication|Transpose","Matrix multiplication",false
q5,long-answer,"Explain the concept of eigenvalues and provide the formula for finding them for a 2×2 matrix.",,"Eigenvalues are scalar values λ that satisfy the equation Av = λv. For a 2×2 matrix, they are found by solving det(A - λI) = 0.",false
q6,multiple-choice,"Solve: $\\int e^{2x} dx$","$\\frac{1}{2}e^{2x} + C$|$2e^{2x} + C$|$e^{2x} + C$|$\\frac{e^{2x}}{2x} + C$",$\\frac{1}{2}e^{2x} + C$,true
q7,true-false,"The cross product of two parallel vectors is always zero.","True|False",True,false
q8,short-answer,"What is the determinant of the identity matrix $I_{3 \\times 3}$?",,1,true
q9,multiple-choice,"The second derivative of $\\sin(x)$ is:","$\\cos(x)$|$-\\sin(x)$|$-\\cos(x)$|$\\sin(x)$",$-\\sin(x)$,true
q10,long-answer,"Describe the relationship between the definite integral and the area under a curve. Include a discussion of signed area.",,"The definite integral represents the signed area between a function and the x-axis. Area above the x-axis is positive, while area below is negative. The total integral gives the net signed area.",false`;

export const generateMockQuestions = (): Question[] => {
  return [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?',
      options: ['$3x^2 + 4x - 5$', '$3x^2 + 2x - 5$', '$x^2 + 4x - 5$', '$3x^3 + 4x^2 - 5$'],
      correctAnswer: '$3x^2 + 4x - 5$',
      isLatex: true,
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'The integral $\\int_0^1 x^2 dx = \\frac{1}{3}$',
      options: ['True', 'False'],
      correctAnswer: 'True',
      isLatex: true,
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$',
      correctAnswer: '1',
      isLatex: true,
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Which matrix operation is NOT commutative?',
      options: ['Addition', 'Scalar multiplication', 'Matrix multiplication', 'Transpose'],
      correctAnswer: 'Matrix multiplication',
      isLatex: false,
    },
    {
      id: 'q5',
      type: 'long-answer',
      question: 'Explain the concept of eigenvalues and provide the formula for finding them for a 2×2 matrix.',
      correctAnswer: 'Eigenvalues are scalar values λ that satisfy the equation Av = λv. For a 2×2 matrix, they are found by solving det(A - λI) = 0.',
      isLatex: false,
    },
    {
      id: 'q6',
      type: 'multiple-choice',
      question: 'Solve: $\\int e^{2x} dx$',
      options: ['$\\frac{1}{2}e^{2x} + C$', '$2e^{2x} + C$', '$e^{2x} + C$', '$\\frac{e^{2x}}{2x} + C$'],
      correctAnswer: '$\\frac{1}{2}e^{2x} + C$',
      isLatex: true,
    },
    {
      id: 'q7',
      type: 'true-false',
      question: 'The cross product of two parallel vectors is always zero.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      isLatex: false,
    },
    {
      id: 'q8',
      type: 'short-answer',
      question: 'What is the determinant of the identity matrix $I_{3 \\times 3}$?',
      correctAnswer: '1',
      isLatex: true,
    },
    {
      id: 'q9',
      type: 'multiple-choice',
      question: 'The second derivative of $\\sin(x)$ is:',
      options: ['$\\cos(x)$', '$-\\sin(x)$', '$-\\cos(x)$', '$\\sin(x)$'],
      correctAnswer: '$-\\sin(x)$',
      isLatex: true,
    },
    {
      id: 'q10',
      type: 'long-answer',
      question: 'Describe the relationship between the definite integral and the area under a curve. Include a discussion of signed area.',
      correctAnswer: 'The definite integral represents the signed area between a function and the x-axis. Area above the x-axis is positive, while area below is negative. The total integral gives the net signed area.',
      isLatex: false,
    },
  ];
};
