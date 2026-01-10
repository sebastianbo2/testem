import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { uploadDocToThread, summarize, isDocReady } from "./documents.js";

dotenv.config();

const app = express();
app.use(cors());
const upload = multer();

app.get("/", (req, res) => {
  res.send("Hello world express");
});

// format : id,type,question,options,correctAnswer,isLatex

const sampleQuestions = [
  {
    question: 'What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?',
    type: "multiple-choice",
    options: ['$3x^2 + 4x - 5$', '$3x^2 + 2x - 5$', '$x^2 + 4x - 5$', '$3x^3 + 4x^2 - 5$'],
  },
  {
    question: 'The integral $\\int_0^1 x^2 dx = \\frac{1}{3}$',
    type: "true-false",
    options: ["True", "False"],
  },
  {
    question: 'Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$',
    type: "short-answer",
    options: [],
  },
  {
    question: 'Which matrix operation is NOT commutative?',
    type: "multiple-choice",
    options: ['Addition', 'Scalar multiplication', 'Matrix multiplication', 'Transpose'],
  },
  {
    question: 'Explain the concept of eigenvalues and provide the formula for finding them for a 2×2 matrix.',
    type: "long-answer",
    options: [],
  }
]

app.get("/api/files", (req, res) => {
  const fileIds = req.query.fileIds

  const ids = Array.isArray(fileIds)
  ? fileIds 
  : fileIds 
  ? [fileIds]
  : [];

  setTimeout(() => {
    res.json(sampleQuestions)
    console.log("Timer ended")
}, 3000)

  console.log("print: ", ids)

  // res.json(sampleQuestions);
})

const correctedAnswers = [
  {
    correct: "yes",
    modelAnswer: "GENERATED ANSWER",
  },
  {
    correct: "no",
    modelAnswer: "GENERATED ANSWER",
  },
  {
    correct: "no",
    modelAnswer: "GENERATED ANSWER",
  },
  {
    correct: "yes",
    modelAnswer: "GENERATED ANSWER",
  },
  {
    correct: "no",
    modelAnswer: "GENERATED ANSWER",
  },
]

app.post("/api/answers", express.json(), (req, res) => {
  const { questions } = req.body;

  questions.forEach(question => {
    question.modelAnswer = "$3x^2 + 4x - 5$"
    const randInt = Math.random()
    randInt <= 0.5 ? question.isCorrect = true : question.isCorrect = false
  });

  console.log(questions.map(question => question.userAnswer))

  res.json(questions);
})

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const docId = await uploadDocToThread(
      req.file.buffer,
      req.file.originalname
    );
    res.json({ ok: true, documentId: docId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/summarize", async (req, res) => {
  try {
    const summary = await summarize();
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// TODO: make endpoint dynamic through req.documentId then pass it to isDocReady
app.get("/api/checkDocStatus", async (req, res) => {
  try {
    const isReady = await isDocReady();
    res.json({ isReady });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening");
});
