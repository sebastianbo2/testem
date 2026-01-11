import { getFilesFromDB, downloadFilesFromDB } from "./db_requests.js";
import supabase from "../config/supabaseClient.js";
import {
  isDocumentIndexed,
  uploadSingleFileToBackboard,
} from "../backboard/docUploader.js";
import { getUserAssistant } from "../backboard/assistant.js";
import backboard from "../config/backboardClient.js";
import { writeFile } from "fs/promises";

export default async (ids) => {
  const fileRows = await getFilesFromDB(ids); // simple array containing document data
  const files = await downloadFilesFromDB(fileRows); // actual File object

  const user_id = fileRows[0].user_id;
  console.log("USER: ", user_id);

  const backboardURL = `https://app.backboard.io/api`;

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

  console.log("🚀 Starting Uploads...");
  const uploadPromises = files.map((file) =>
    uploadSingleFileToBackboard(file, thread)
  );

  // Wait for ALL uploads to finish
  const uploadedDocIds = (await Promise.all(uploadPromises)).filter(
    (id) => id !== null
  );

  console.log("IDS UPLOADED: ", uploadedDocIds);

  if (uploadedDocIds.length === 0) {
    throw new Error("No files were uploaded successfully.");
  }

  // 4. INDEXING PHASE (The Fix)
  console.log("⏳ Waiting for Backboard to index files...");
  await Promise.all(
    uploadedDocIds.map((docId) => isDocumentIndexed(docId, backboardURL))
  );

  // const thread_resp = await backboard.addMessage(thread, {
  //   content: "what is my name and favorite color",
  //   llm_provider: "openai",
  //   model_name: "gpt-4o",
  //   stream: true,
  // });

  // for await (const chunk of thread_resp) {
  //   if (chunk.type === "content_streaming") {
  //     process.stdout.write(chunk.content || "");
  //   } else if (chunk.type === "message_complete") {
  //     break;
  //   }
  // }

  // 4. INDEXING PHASE (The Fix)
  // console.log("⏳ Waiting for Backboard to index files...");
  // await Promise.all(
  //   uploadedDocIds.map((docId) => isDocumentIndexed(docId, backboardURL))
  // );

  const msgFormData = new FormData()
  const prompt = `Use the uploaded files to create an exam/test on the content present/relevant to the included documents Do not include questions already present in the document: Instead, Generate questions of the same topics.
  Send back 5 questions that can be multiple choice, true-false, short answer, or long answer:
  Output the questions in the following format: question~type~options~correctAnswer. Use '~' to separate each paramter and commas to separate options (only include options if question is multiple choice (wihtout array borders [ and ] at first and last question), if not include empty array: []).
  For the question type, write them in the following format: 'multiple-choice'/'true-false'/'short-answer'/'long-answer'.
  DO NOT OUTPUT ANY TEXT OTHER THAN EACH QUESTIONS (1 line per question csv style, but with '~' between params)`

  // Send a message and stream the response
  const stream = await backboard.addMessage(thread, {
    content: prompt,
    llm_provider: 'openai',
    model_name: 'gpt-4o',
    stream: true,
    // web_search: 'Auto'
  });

  let output = ""

  // Print each chunk of content as it arrives
  for await (const chunk of stream) {
    if (chunk.type === 'content_streaming') {
      output = output + chunk.content
      // process.stdout.write(chunk.content || '');
    } else if (chunk.type === 'message_complete') {
      break;
    }
  }

  await writeFile("output.txt", output);

  const lines = output.split(/\r?\n/);
  let questions = []

  lines.forEach((line) => {
    const params = line.split("~")

    console.log("PARAMS: ", params)

    const question = {
      question: params[0],
      type: params[1],
      options: params[1] === "multiple-choice" ? params[2].split(",").map(option => option.trim()) : [],
      correctAnswer: params[3]
    }

    questions.push(question)
  })
  

  // msgFormData.append('content', prompt)
  // msgFormData.append('llm_provider', '')
  // msgFormData.append('model_name', '')
  // msgFormData.append('stream', 'false')
  // msgFormData.append('memory', 'off')
  // msgFormData.append('web_search', 'off')
  // msgFormData.append('send_to_llm', 'true')
  // msgFormData.append('metadata', '')

  // const msgResponse = await fetch(`${backboardURL}/threads/${thread}/messages`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     'X-API-Key': `${process.env.BACKBOARD_KEY}`,
  //   },
  //   body: msgFormData,
  // })

  // const msgJson = await msgResponse.json();
  
  // console.log("MESSAGE REPLY: ", msgJson)

  console.log("✅ All files ready. Deleting thread...");

  // 5. CLEANUP
  // Now it is safe to delete the thread or generate questions
  await fetch(`${backboardURL}/threads/${thread}`, {
    method: "DELETE",
    headers: { "X-API-Key": process.env.BACKBOARD_KEY },
  });

  // TODO: actually return the questions
  return questions;
};
