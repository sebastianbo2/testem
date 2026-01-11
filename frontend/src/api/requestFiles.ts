export default async function requestFiles(fileIds: string[]) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds: fileIds }),
  });

  const json = await response.json();

  console.log(json);
  return json;
};