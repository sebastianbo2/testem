import { ExamConfig } from "@/types/exam";

export default async function requestFiles(fileIds: string[], config: ExamConfig) {
  const response = await fetch(`/api/files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds: fileIds, config: config }),
  });

  const json = await response.json();

  console.log(json);
  return json;
}
