/**
 * Uploads a single file to backboard API
 * @param {Blob} blob
 * @param {*} fileMetadata
 * @param {string} threadId
 * @returns the backboard generated doc id
 */
export const uploadSingleFile = async (blob, fileMetadata, threadId) => {
  if (!blob) return null;

  const formData = new FormData();
  // IMPORTANT: Use the real filename so Backboard knows it's a PDF
  const filename = fileMetadata.display_name || "document.pdf";
  formData.append("file", blob, filename);

  const response = await fetch(
    `${process.env.BACKBOARD_URL}/threads/${threadId}/documents`,
    {
      method: "POST",
      headers: { "X-API-Key": process.env.BACKBOARD_KEY },
      body: formData,
    }
  );

  if (!response.ok) {
    console.error(`Upload failed for ${filename}`);
    return null;
  }

  const json = await response.json();
  console.log(`✅ Uploaded: ${filename} -> ID: ${json.document_id}`);
  return json.document_id;
};

/**
 * Checks if a document is done indexing into backboard API
 * @param {string} docId
 * @returns whether the document is successfully indexed. False indicates that timeout exceeded
 */
export const isDocumentIndexed = async (docId) => {
  const maxRetries = 10;

  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(
      `${process.env.BACKBOARD_URL}/documents/${docId}/status`,
      {
        headers: { "X-API-Key": process.env.BACKBOARD_KEY },
      }
    );
    const json = await res.json();

    if (json.status === "indexed") return true;
    if (json.status === "failed")
      throw new Error(`Indexing failed for ${docId}`);

    // Wait 1 second before trying again
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.warn(`⚠️ Timeout waiting for ${docId}`);
  return false;
};
