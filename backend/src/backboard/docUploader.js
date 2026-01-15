import dotenv from "dotenv";

dotenv.config();

/**
 * Uploads a single file to backboard API
 * @param {File} file - The File object (which contains the name and type)
 * @param {string} threadId
 * @returns {Promise<string|null>} the backboard generated doc id
 */
export const uploadSingleFileToBackboard = async (file, threadId) => {
  if (!file) return null;

  const formData = new FormData();

  // Since 'file' is a File object, FormData automatically detects
  // and uses file.name. We don't need to manually pass the filename string
  // unless we want to override it.
  formData.append("file", file);

  const response = await fetch(
    `${process.env.BACKBOARD_URL}/threads/${threadId}/documents`,
    {
      method: "POST",
      headers: { "X-API-Key": process.env.BACKBOARD_KEY },
      body: formData,
    }
  );

  if (!response.ok) {
    console.error(`Upload failed for ${file.name}`);
    return null;
  }

  const json = await response.json();
  console.log(`✅ Uploaded: ${file.name} -> ID: ${json.document_id}`);
  return json.document_id;
};

/**
 * Checks if a document is done indexing into backboard API
 * @param {string} docId
 * @returns whether the document is successfully indexed. False indicates that timeout exceeded
 */
export const isDocumentIndexed = async (docId) => {
  const maxRetries = 50;

  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(
      `${process.env.BACKBOARD_URL}/documents/${docId}/status`,
      {
        headers: { "X-API-Key": process.env.BACKBOARD_KEY },
      }
    );
    const json = await res.json();

    if (json.status === "indexed") return true;
    if (json.status === "error") throw new Error(`Indexing failed for ${docId}`);

    // Wait 1 second before trying again
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.warn(`⚠️ Timeout waiting for ${docId}`);
  return false;
};
