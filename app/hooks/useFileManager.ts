// hooks/useFileManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

export interface FileRecord {
  id: string;
  name: string;
  description: string | null;
  type: string;
  size: number;
  key: string;
  s3Url: string;
  downloadUrl: string;
  createdAt: string;
}

export function useFileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("fetchFiles error", err);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  async function uploadWithProgress(
    url: string,
    file: File,
    onProgress: (p: number) => void
  ) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else
          reject(
            new Error(
              `Upload failed: ${xhr.status} ${xhr.statusText} ${xhr.responseText}`
            )
          );
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(file);
    });
  }

  // uploadFile now accepts description string
  async function uploadFile(description = "") {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      // 1) get presigned upload URL
      const presignRes = await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
        }),
      });

      if (!presignRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { uploadUrl, key } = await presignRes.json();

      // 2) upload to S3 (with progress)
      await uploadWithProgress(uploadUrl, selectedFile, (p) =>
        setUploadProgress(p)
      );

      // 3) store metadata in Postgres (include description!)
      const metaRes = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          name: selectedFile.name,
          description,
          type: selectedFile.type,
          size: selectedFile.size,
        }),
      });

      if (!metaRes.ok) {
        // note: the file is already in S3; you may want to delete it on failure
        throw new Error("Failed to store metadata");
      }

      // success
      setSelectedFile(null);
      await fetchFiles();
    } catch (err) {
      console.error("uploadFile error:", err);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function deleteFile(id: string) {
    try {
      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchFiles();
    } catch (err) {
      console.error("deleteFile error:", err);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }

  return {
    files,
    uploading,
    uploadProgress,
    selectedFile,
    setSelectedFile,
    fetchFiles,
    uploadFile,
    deleteFile,
    handleDrop,
  };
}
