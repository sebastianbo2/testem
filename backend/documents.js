import { BackboardClient } from "backboard-sdk";
import "dotenv/config";
import mime from "mime";

// Initialize the Backboard client
const client = new BackboardClient({
  apiKey: process.env.BACKBOARD_KEY,
});
let thread = null;
let assistant = null;
let docId = null;

export async function uploadDocToThread(buffer, filename) {
  await initBackboard();

  const mimeType = mime.getType(filename);

  const fileBlob = new Blob([buffer], { type: mimeType });
  const formData = new FormData();
  formData.append("file", fileBlob, filename);

  const resp = await fetch(
    `https://app.backboard.io/api/threads/${thread.threadId}/documents`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.BACKBOARD_KEY,
      },
      body: formData,
    }
  );

  console.log("Response from doc upload: ", resp);

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error(`Error: ${resp.status} ${errorText}`);
    throw new Error(`Upload failed: ${errorText}`);
  }

  const data = await resp.json();
  console.log(data);
  docId = data.document_id;

  return data.document_id;
}

/**
 * Checks if document has finished uploading to thread or assistant
 * @returns whether the document is uploaded
 */
export async function isDocReady() {
  console.log("Checking global docId:", docId);
  if (!docId) {
    return false;
  }

  const status = await client.getDocumentStatus(docId);
  console.log(status.status);
  if (status.status === "indexed") {
    return true;
  } else if (status.status === "failed") {
    console.log("Indexing failed:", status.statusMessage);
    throw new Error("Indexing failed:", status.statusMessage);
  } else {
    return false;
  }
}

export async function summarize() {
  await initBackboard();

  // Ask a question about the document and stream the response
  const stream = await client.addMessage(thread.threadId, {
    content: "What are the key points in the document?",
    stream: true,
  });

  let result = "";

  for await (const chunk of stream) {
    if (chunk.type === "content_streaming") {
      result += chunk.content || "";
    }
    if (chunk.type === "message_complete") {
      break;
    }
  }

  return result;
}

export async function initBackboard() {
  if (!assistant) {
    assistant = await client.createAssistant({
      name: "Document Assistant",
      description: "An assistant that can analyze documents",
    });
  }

  if (!thread) {
    thread = await client.createThread(assistant.assistantId);
  }
}
