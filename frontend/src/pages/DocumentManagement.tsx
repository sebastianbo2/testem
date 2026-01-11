import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  Suspense,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderSidebar } from "@/components/folders/FolderSidebar";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { FloatingActionBar } from "@/components/documents/FloatingActionBar";
import { ExamConfigModal } from "@/components/ExamConfigModal";
import { ExamConfig, Document, Folder } from "@/types/exam";
import { Link } from "react-router-dom";
import supabase from "@/config/supabaseClient";
import { ExamLoadingState } from "@/components/ExamLoadingState";
import Logo from "@/components/icons/Logo";
import DeleteFolderBanner from "@/components/folders/DeleteFolderBanner";
import CreateFolderBanner from "@/components/folders/CreateFolderBanner";
import { useAuth } from "@/context/AuthContext";
import requestFiles from "@/api/requestFiles";

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[] | null>([]);
  const [folders, setFolders] = useState<Folder[] | null>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loadingExam, setLoadingExam] = useState(false);
  const [deleteBannerOpen, setDeleteBannerOpen] = useState(false);
  const [createBannerOpen, setCreateBannerOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { session } = useAuth();

  const filteredDocuments = selectedFolderId
    ? documents.filter((doc) => doc["folder_id"] === selectedFolderId)
    : documents;

  // initialize documents to pull from database
  useEffect(() => {
    // TODO: loading data page

    const userId = session.user.id;
    setCurrentUserId(userId);

    async function loadDocumentsFromDB() {
      const { data, error } = await supabase
        .from("documents")
        .select()
        .eq("user_id", userId);

      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setDocuments(data);
      }
    }
    loadDocumentsFromDB();

    async function loadFoldersFromDB() {
      const { data, error } = await supabase
        .from("folders")
        .select()
        .eq("user_id", userId);

      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setFolders(data);
      }
    }
    loadFoldersFromDB();
  }, [session]);

  // DOCUMENT UPLOADING
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // clear the input immediately so they can select the same file again if needed
    e.target.value = "";

    await uploadFileToDB(file);
  };

  const uploadFileToDB = async (uploadedFile: File) => {
    if (uploadedFile) {
      try {
        // SUPABASE

        // unique path to avoid collisions
        const docId = crypto.randomUUID();
        const fileExt = uploadedFile.name.split(".").pop();
        const uniqueFileName = `${uploadedFile.name}__${docId}.${fileExt}`;
        const storagePath = `${currentUserId}/${uniqueFileName}`;

        // upload "uploadedFile" to supabase "documents" bucket
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("documents")
            .upload(storagePath, uploadedFile);

        if (storageError) {
          setError(storageError);
        }

        // create the record in the 'documents' table
        const { data: dbData, error: dbError } = await supabase
          .from("documents")
          .insert([
            {
              id: uniqueFileName,
              user_id: currentUserId,
              display_name: uploadedFile.name,
              storage_path: storagePath,
              status: "pending", // default value
              folder_id: selectedFolderId,
              size: uploadedFile.size,
              type: uploadedFile.type,
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
          setDocuments([...documents, dbData[0]]);
        }
      } catch (err) {
        setError(err);
      }
    }
  };

  // TODO: better error handling, possibly with BannerWrapper.tsx
  useEffect(() => {
    console.error("An error occured: ", error);
  }, [error]);

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

    // Delete from supabase
    const deleteFromDB = async () => {
      try {
        // 1. Delete the physical file from the Storage Bucket
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
    setLoadingExam(true);

    navigate("/exam", {
      state: {
        config,
        questions: await requestFiles(Array.from(selectedDocIds)),
      },
    });
  };

  const onFolderDelete = () => {
    setDeleteBannerOpen(true);
  };

  const handleDeleteFolder = async () => {
    setDeleteBannerOpen(false);
    setFolders((prev) => prev.filter((f) => f.id !== selectedFolderId));
    setSelectedFolderId(null);

    // 1. Identify which documents belong to this folder
    const filesInFolder = documents.filter(
      (doc) => doc.folder_id === selectedFolderId
    );

    // 2. Perform the bulk delete for the files
    if (filesInFolder.length > 0) {
      await handleBulkDelete(filesInFolder);
    }

    try {
      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", selectedFolderId);

      if (error) throw error;

      console.log("Folder and all associated contents deleted.");
    } catch (err) {
      console.error("Folder deletion failed:", err.message);
      setError(err.message);
    }
  };

  const handleBulkDelete = async (filesToDelete: Document[]) => {
    // 1. Instant UI Update (Optimistic)
    const idsToRemove = filesToDelete.map((doc) => doc.id);
    const pathsToRemove = filesToDelete.map((doc) => doc.storage_path);

    setDocuments((prev) => prev.filter((doc) => !idsToRemove.includes(doc.id)));

    const newSelected = new Set(selectedDocIds);
    idsToRemove.forEach((id) => newSelected.delete(id));
    setSelectedDocIds(newSelected);

    try {
      // 2. Bulk Delete from Supabase Storage
      // .remove() handles an array, so this is one network request
      console.log;
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove(pathsToRemove);

      if (storageError) {
        setError(storageError);
      }

      // 3. Bulk Delete from Database Table
      // Using .in() allows you to delete multiple rows by ID in one shot
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .in("id", idsToRemove);

      if (dbError) {
        setError(dbError);
      }

      console.log(`${idsToRemove.length} files deleted successfully`);
    } catch (err) {
      console.error("Bulk deletion failed:", err.message);
      setError(err.message);
      // Optional: Re-fetch documents if the delete failed to sync UI
    }
  };

  const handleCreateFolder = async (name: string) => {
    console.log(currentUserId);
    console.log(session);
    const { data, error } = await supabase
      .from("folders")
      .insert([{ name, user_id: currentUserId }])
      .select()
      .single();

    if (!error && data) {
      setFolders((prev) => [...prev, data]);
      setCreateBannerOpen(false);
    }
  };

  if (loadingExam) {
    return <ExamLoadingState />;
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
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
              <Button
                onClick={() => setCreateBannerOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          <FolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
          />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex gap-5">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedFolderId
                    ? folders.find((f) => f.id === selectedFolderId)?.name
                    : "All Documents"}
                </h2>
                {selectedFolderId && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFolderDelete();
                    }}
                    className="group-hover:opacity-100 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
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

      {deleteBannerOpen && (
        <DeleteFolderBanner
          folderId={selectedFolderId}
          onDelete={handleDeleteFolder}
          onCancel={() => setDeleteBannerOpen(false)}
          isOpen={deleteBannerOpen}
        />
      )}

      {createBannerOpen && (
        <CreateFolderBanner
          onCreate={handleCreateFolder}
          onCancel={() => setCreateBannerOpen(false)}
          isOpen={createBannerOpen}
        />
      )}
    </>
  );
};

export default DocumentManagement;
