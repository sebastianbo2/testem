import express from "express";
import cors from "cors";
import multer from "multer";
import { createNewAssistant } from "./src/backboard/assistant.js";
import { getRowByIdFromTable } from "./src/lib/db_requests.js";
import supabase from "./src/config/supabaseClient.js";
import fetchQuestions from "./src/lib/fetchQuestions.js";
import { readFile } from "fs/promises";
import fetchAnswers from "./src/lib/fetchAnswers.js";

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
  const config = req.body.config

  console.log("CONFIG: ", config)

  const questions = await fetchQuestions(fileIds, config);
  console.log(questions);

  // const output = await readFile("output.txt", "utf8");

  // console.log("OUTPUT:", output)

  // const lines = output.split(/\r?\n/);
  // let questions = []

  // lines.forEach((line) => {
  //   const params = line.split("~")

  //   console.log("PARAMS: ", params)

  //   const question = {
  //     question: params[0],
  //     type: params[1],
  //     options: params[1] === "multiple-choice" ? params[2].split(",").map(option => option.trim()) : [],
  //     correctAnswer: params[3]
  //   }

  //   questions.push(question)
  // })

  res.json(questions);
});

app.post("/api/answers", express.json(), async (req, res) => {
  const { user_id, questions } = req.body;

  console.log("The user who did this exam is", user_id)

  // const output = await readFile("answered.txt", "utf8") // comment this

  const output = await fetchAnswers(questions, user_id); // uncomment this

  const lines = output.split(/\r?\n/);

  lines.forEach((line, index) => {
    const params = line.split("~")

    questions[index].isCorrect = params[0].toLowerCase().trim() === "yes" ? true : false
    questions[index].modelAnswer = params[1].trim()
  })

  console.log(questions.map((question) => question.userAnswer));

  setTimeout(() => res.json(questions), 3000);

  // res.json(questions);
});

export default app;


// app.listen(process.env.PORT || 8000, () => {
//   console.log("Server is listening");
// });
