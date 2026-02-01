# Testem

**Testem** is an AI-powered exam generator designed for STEM students. It transforms personal study materials into structured, interactive practice exams, with a focus on clarity, feedback, and mathematical correctness.

[Live demo](https://testem-app.vercel.app/)

---

## Overview

Ever had a teacher who doesn't give enough practice exam material? Studying in STEM often breaks down when students lack structured feedback and realistic practice. Testem addresses this by allowing users to upload documents, generate exams tailored to difficulty and context, complete them in a distraction-free environment, and receive clear, graded feedback.

---

## Core Features

### Dashboard
- Overview of the user’s workspace
- Document Library and Exam History entry points
- Exam History displays past attempts with semantic score indicators

### Document Management
- Folder-based sidebar for organization
- Upload, delete, and rearrange documents (PDF/TXT)
- Checkbox-based document selection
- Context-aware floating action bar for exam generation

### Exam Configuration
- Modal-based configuration flow
- Adjustable number of questions (5–50)
- Subject context input
- Difficulty selection (Easy, Medium, Hard)
- Loading state simulating AI parsing

### Active Exam Experience
- Sticky sidebar with question navigation
- Support for multiple question types:
  - Multiple Choice
  - True / False
  - Short Answer
  - Long Answer
  - Math / STEM questions rendered using LaTeX
- CSV-based question parsing to simulate backend responses
- Responsive, scroll-friendly layout

### Results & Feedback
- Per-question feedback with clear visual distinction
- Comparison between user answers and correct answers
- Return-to-dashboard flow

### Exam History
- Full history table with sorting
- Sortable by:
  - Grade
  - Completion date
  - Number of questions
- Ascending and descending order support
- Summary statistics for quick insight

---

## Tech Stack
- Express
- Supabase
- Backboard.io for AI integration

- React (Vite)
- Tailwind CSS
- shadcn/ui (Radix UI-based components)
- Lucide React (icons)
- KaTeX / react-latex-next for mathematical rendering
- PapaParse for CSV parsing
- Framer Motion (onboarding animations)

---

## Running the Project Locally

```bash
git clone https://github.com/your-username/testem.git
cd testem
npm install
npm run dev
```
