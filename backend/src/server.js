import express from "express";
import cors from "cors";
import multer from "multer";
import { createNewAssistant } from "./backboard/assistant.js";
import { getRowByIdFromTable } from "./lib/db_requests.js";
import supabase from "./config/supabaseClient.js";
import fetchQuestions from "./lib/fetchQuestions.js";
import { readFile } from "fs/promises";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world express");
});

app.post("/supabase/createNewAssistant", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const assistantData = await createNewAssistant(user_id);

    res.status(200).json({
      message: "Assistant initialized",
      assistant: assistantData,
    });
  } catch (error) {
    console.error("Error creating assistant:", error);
    res.status(500).json({ error: "Failed to initialize assistant" });
  }
});

// format : id,type,question,options,correctAnswer,isLatex

const sampleQuestions = [
  {
    question: "What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?",
    type: "multiple-choice",
    options: [
      "$3x^2 + 4x - 5$",
      "$3x^2 + 2x - 5$",
      "$x^2 + 4x - 5$",
      "$3x^3 + 4x^2 - 5$",
    ],
  },
  {
    question: `
\\[
\\int_0^1 x^2 dx = \\frac{1}{3}
\\]
`,
    type: "true-false",
    options: ["True", "False"],
  },
  {
    question: "Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$",
    type: "short-answer",
    options: [],
  },
  {
    question: "Which matrix operation is NOT commutative?",
    type: "multiple-choice",
    options: [
      "Addition",
      "Scalar multiplication",
      "Matrix multiplication",
      "Transpose",
    ],
  },
  {
    question:
      "Explain the concept of eigenvalues and provide the formula for finding them for a 2×2 matrix.",
    type: "long-answer",
    options: [],
  },
];

app.post("/api/files", async (req, res) => {
  const fileIds = req.body.fileIds;

  // const questions = await fetchQuestions(fileIds);
  // console.log(questions);

  const output = await readFile("output.txt", "utf8");

  console.log("OUTPUT:", output)

  res.json(sampleQuestions);
});

app.post("/api/answers", express.json(), (req, res) => {
  const { questions } = req.body;

  questions.forEach((question) => {
    question.modelAnswer = "$3x^2 + 4x - 5$";
    const randInt = Math.random();
    randInt <= 0.5 ? (question.isCorrect = true) : (question.isCorrect = false);
  });

  console.log(questions.map((question) => question.userAnswer));

  res.json(questions);
});

// TODO: make endpoint dynamic through req.documentId then pass it to isDocReady
// app.get("/api/checkDocStatus", async (req, res) => {
//   try {
//     const isReady = await isDocReady();
//     res.json({ isReady });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening");
});
