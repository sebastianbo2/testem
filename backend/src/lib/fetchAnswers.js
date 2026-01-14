import { getFilesFromDB, downloadFilesFromDB } from "./db_requests.js";
import supabase from "../config/supabaseClient.js";
import {
  isDocumentIndexed,
  uploadSingleFileToBackboard,
} from "../backboard/docUploader.js";
import { getUserAssistant } from "../backboard/assistant.js";
import backboard from "../config/backboardClient.js";
import { writeFile } from "fs/promises";
import { gradingPrompt } from "../backboard/prompts.js";
import dotenv from "dotenv";

dotenv.config();

export default async (questions, user_id) => {
  const backboardURL = `https://app.backboard.io/api`;
  console.log(questions);
  // ASSISTANT
  const assistant = await getUserAssistant(user_id);
  const assistantId = assistant.data.id;

  // THREAD CREATION
  const thread_res = await fetch(
    `${backboardURL}/assistants/${assistantId}/threads`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.BACKBOARD_KEY}`,
      },
      body: JSON.stringify({}),
    }
  );

  const threadObject = await thread_res.json();
  const thread = threadObject.thread_id;

  console.log("THREAD ID: ", thread);

  let prompt = gradingPrompt;

  questions.forEach((question, index) => {
    let line = "";

    line =
      line +
      `${index + 1}. ${question.question}\nUser Answer: ${question.userAnswer}`;

    prompt = prompt + line;
  });

  // Send a message and stream the response
  const stream = await backboard.addMessage(thread, {
    content: prompt,
    llm_provider: "openrouter",
    model_name: "meta-llama/llama-3.1-70b-instruct",
    stream: true,
    // web_search: 'Auto',
    memory: "Auto",
  });

  let output = "";

  // Print each chunk of content as it arrives
  for await (const chunk of stream) {
    if (chunk.type === "content_streaming") {
      output = output + chunk.content;
      // process.stdout.write(chunk.content || '');
    } else if (chunk.type === "message_complete") {
      break;
    }
  }

  console.log(output);

  console.log("✅ All files ready. Deleting thread...");

  // 5. CLEANUP
  // Now it is safe to delete the thread or generate questions
  await fetch(`${backboardURL}/threads/${thread}`, {
    method: "DELETE",
    headers: { "X-API-Key": process.env.BACKBOARD_KEY },
  });

  // TODO: actually return the questions
  return output;
};
