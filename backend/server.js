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
