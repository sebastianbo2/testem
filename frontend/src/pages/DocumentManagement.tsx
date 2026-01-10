import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderSidebar } from "@/components/documents/FolderSidebar";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { FloatingActionBar } from "@/components/documents/FloatingActionBar";
import { ExamConfigModal } from "@/components/ExamConfigModal";
import { mockFolders } from "@/lib/mockData";
import { ExamConfig, Document } from "@/types/exam";
import { Link } from "react-router-dom";
import supabase from "@/config/supabaseClient";

const requestFiles = async (fileIds: string[]) => {
  const params = new URLSearchParams();

  fileIds.forEach((id) => params.append("fileIds", id));

  const link = `${
    import.meta.env.VITE_SERVER_URL
  }/api/files?${params.toString()}`;

  const response = await fetch(link);

  const json = response.json();

  console.log(json);
  return json;
};

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[] | null>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredDocuments = selectedFolderId
    ? documents.filter((doc) => doc.folderId === selectedFolderId)
    : documents;

  // initialize documents to pull from database
  useEffect(() => {
    async function loadDocumentsFromDB() {
      // TODO: filter by user_id and folder

      const { data, error } = await supabase.from("documents").select();

      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setDocuments(data);
      }
    }

    loadDocumentsFromDB();
  }, []);

  // DOCUMENT UPLOADING
  useEffect(() => {
    if (uploadedFile) {
      const uploadToDB = async () => {
        try {
          // SUPABASE

          // unique path to avoid collisions
          // TODO: {user_id}/{unique_file_id}/{original_filename} when auth is done
          const fileExt = uploadedFile.name.split(".").pop();
          const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
          // const storagePath = `uploads/${uniqueFileName}`;
          const storagePath = uniqueFileName;

          // upload "uploadedFile" to supabase "documents" bucket
          const { data: storageData, error: storageError } =
            await supabase.storage
              .from("documents") // Ensure this bucket exists in Supabase Storage
              .upload(storagePath, uploadedFile);

          if (storageError) {
            setError(storageError);
          }

          // create the record in the 'documents' table
          const { data: dbData, error: dbError } = await supabase
            .from("documents")
            .insert([
              {
                display_name: uploadedFile.name,
                storage_path: storagePath,
                status: "pending", // default value
              },
            ])
            .select(); // Returns the new row, including the generated ID

          if (dbError) {
            setError(dbError);
            return;
          }
          if (dbData) {
            console.log("Document ready for processing:", dbData[0]);
            // STATE (FRONTEND)
            const newDoc: Document = {
              ...dbData[0],
              type: "pdf",
              folderId: "folder-1",
              size: "1.3MB",
            };
            setDocuments([...documents, newDoc]);
          }
        } catch (err) {
          setError(err);
        }
      };

      uploadToDB();
    }
  }, [uploadedFile]);

  // TODO: better error handling, possibly with Banner.tsx
  useEffect(() => {
    console.error("An error occured: ", error);
  }, [error]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleDocumentSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedDocIds);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedDocIds(newSelected);
  };

  const handleDeleteDocument = (document: Document) => {
    const id = document.id;
    setDocuments(documents.filter((doc) => doc.id !== id));
    const newSelected = new Set(selectedDocIds);
    newSelected.delete(id);
    setSelectedDocIds(newSelected);

    // allow user to reupload same file
    setUploadedFile(null);

    // Delete from supabase
    const deleteFromDB = async () => {
      try {
        // 1. Delete the physical file from the Storage Bucket
        console.log(document.storage_path);
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("documents")
            .remove([document.storage_path]); // .remove() expects an array of paths

        if (storageError) {
          console.error("Storage deletion failed:", storageError.message);
          setError(error);
          return;
        }

        // 2. Delete the metadata record from the 'documents' table
        const { error: dbError } = await supabase
          .from("documents")
          .delete()
          .eq("id", id); // Use the UUID to target the specific row

        if (dbError) {
          setError(error);
          return;
        }

        console.log("Document and file deleted successfully");
      } catch (err) {
        console.error("Deletion process failed:", err.message);
      }
    };
    deleteFromDB();
  };

  const handleClearSelection = () => {
    setSelectedDocIds(new Set());
  };

  const handleGenerateExam = () => {
    setIsConfigModalOpen(true);
  };

  const handleStartExam = async (config: ExamConfig) => {
    setIsConfigModalOpen(false);

    const examQuestions: string[] = await requestFiles(
      Array.from(selectedDocIds)
    );

    console.log(examQuestions);

    navigate("/exam", {
      state: { config, questions: examQuestions },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Testem</h1>
              <p className="text-xs text-muted-foreground">Document Library</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fileInputRef.current.click()}
              variant="outline"
              className="gap-2"
            >
              <input
                onChange={handleFileChange}
                type="file"
                id="uploadFileRef"
                className="hidden"
                ref={fileInputRef}
              />
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              New Folder
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <FolderSidebar
          folders={mockFolders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={setSelectedFolderId}
        />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedFolderId
                ? mockFolders.find((f) => f.id === selectedFolderId)?.name
                : "All Documents"}
            </h2>
            <p className="text-muted-foreground">
              {filteredDocuments.length} document
              {filteredDocuments.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="group">
                <DocumentCard
                  document={doc}
                  isSelected={selectedDocIds.has(doc.id)}
                  onSelect={handleDocumentSelect}
                  onDelete={handleDeleteDocument}
                />
              </div>
            ))}
          </div>
        </main>
      </div>

      <FloatingActionBar
        selectedCount={selectedDocIds.size}
        onGenerateExam={handleGenerateExam}
        onClearSelection={handleClearSelection}
      />

      <ExamConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onStartExam={handleStartExam}
      />
    </div>
  );
};

export default DocumentManagement;
