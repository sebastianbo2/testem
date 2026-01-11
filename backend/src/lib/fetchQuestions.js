import { getFilesFromDB, downloadFilesFromDB } from "./db_requests.js";
import supabase from "../config/supabaseClient.js";
import {
  isDocumentIndexed,
  uploadSingleFileToBackboard,
} from "../backboard/docUploader.js";
import { getUserAssistant } from "../backboard/assistant.js";

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

  // DOCUMENTS
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

  console.log("✅ All files ready. Deleting thread...");

  // 5. CLEANUP
  // Now it is safe to delete the thread or generate questions
  await fetch(`${backboardURL}/threads/${thread}`, {
    method: "DELETE",
    headers: { "X-API-Key": process.env.BACKBOARD_KEY },
  });

  // TODO: actually return the questions
  return uploadedDocIds;
};
