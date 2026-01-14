export default async function requestFiles(fileIds) {
  const params = new URLSearchParams();

  fileIds.forEach((id) => params.append("fileIds", id));

  //   console.log(JSON.stringify(fileIds));

  const link = `${
    //TODO
    // import.meta.env.VITE_SERVER_URL
    "http://localhost:8000"
  }/api/files`;

  const response = await fetch(link, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds: fileIds }),
  });

  const json = await response.json();

  console.log(json);
  return json;
}
