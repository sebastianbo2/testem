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
