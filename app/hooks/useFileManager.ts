import { useState, useEffect } from "react";

export function useFileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const presignRes = await fetch("/api/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: selectedFile.name,
        contentType: selectedFile.type,
      }),
    });

    const { url } = await presignRes.json();

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": selectedFile.type },
      body: selectedFile,
    });

    setUploading(false);
    setSelectedFile(null);
    fetchFiles();
  };

  const deleteFileByKey = async (key: string) => {
    await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    fetchFiles();
  };

  return {
    files,
    uploading,
    selectedFile,
    setSelectedFile,
    uploadFile,
    deleteFileByKey,
  };
}
