export default async function requestFiles(fileIds: string[]) {
  const params = new URLSearchParams();

  fileIds.forEach((id) => params.append("fileIds", id));

  console.log(params)

  const link = `${
    import.meta.env.VITE_SERVER_URL
  }/api/files?${params.toString()}`;

  const response = await fetch(link);

  const json = response.json();

  console.log(json);
  return json;
};