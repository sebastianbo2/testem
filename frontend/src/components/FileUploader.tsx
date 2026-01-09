import { useState, type ChangeEvent, useRef, useEffect } from "react";

type UploadStatus = "idle" | "uploading" | "indexing" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Kill any running loops on unmount
    };
  }, []);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  

  async function handleFileUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    
    setStatus("uploading");

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await response.json();
      const docId = uploadData.documentId;

      // START POLLING
      setStatus("indexing");
      console.log("Waiting for document to be indexed...");

      let isIndexed = false;
      while (!isIndexed && isMounted.current) {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/checkDocStatus`);
        const data = await res.json();

        if (data.isReady) {
          isIndexed = true;
          console.log("Document is ready!")
          setStatus("success");
        } else {
          // Wait 2 seconds before the next check
          console.log("running again...")
          await delay(2000);
        }
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  async function handleSummarize() {
    if (!file || status !== "success") {
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/summarize`, {
      method: "POST",
    })

    const data = await res.json();
    console.log(data.summary)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && status !== "uploading" && (
        <button onClick={handleFileUpload}>Upload</button>
      )}
      {<button onClick={handleSummarize}>Summarize</button>}
    </div>
  );
}
