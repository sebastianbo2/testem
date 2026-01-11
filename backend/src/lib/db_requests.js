import mime from "mime";
import supabase from "../config/supabaseClient.js";

/**
 * Retrievs row with certain id from a specified table
 * @param {string} table
 * @param {string} id
 * @returns the row
 */
export async function getRowByIdFromTable(table, id) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return data; // full row object or null
}

/**
 * Retrieves documents by their IDs from Supabase
 * @param {string[]} ids the array of ids to fetch
 * @returns {Promise<Array<object|null>>} a promise that resolves to an array of documents
 */
export async function getFilesFromDB(ids) {
  const files = await Promise.all(
    ids.map((id) => getRowByIdFromTable("documents", id))
  );

  return files.filter(Boolean);
}

/**
 * Downloads files from Supabase "documents" bucket
 * @param {*} files array of file "rows" taken from Supabase "documents" table
 * @returns the downloaded File objects
 */
export async function downloadFilesFromDB(files) {
  const fileDataArray = await Promise.all(
    files.map(async (fileRecord) => {
      // 1. Download raw data (Blob)
      const { data, error } = await supabase.storage
        .from("documents")
        .download(fileRecord.storage_path);

      if (error) {
        console.error(`Error downloading ${fileRecord.storage_path}:`, error);
        return null;
      }

      // 2. Determine correct Filename and MIME type
      const filename = fileRecord.display_name || "unnamed_document.pdf";

      // robustly determine type, fallback to PDF if unknown
      const mimeType = mime.getType(filename) || data.type || "application/pdf";

      // 3. Wrap Blob into a File object
      // We pass [data] because the constructor expects an array of parts
      return new File([data], filename, { type: mimeType });
    })
  );

  return fileDataArray.filter((f) => f !== null);
}
