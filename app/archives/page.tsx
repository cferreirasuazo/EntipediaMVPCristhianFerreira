"use client";

import { useRef, useState } from "react";
import { useFileManager } from "../hooks/useFileManager";

export default function ArchivesPage() {
  const {
    files,
    uploading,
    selectedFile,
    setSelectedFile,
    uploadFile,
    deleteFile,
    handleDrop,
    uploadProgress,
    loadingFetchFiles,
  } = useFileManager();

  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const onDropWrapper = (e: React.DragEvent) => {
    handleDrop(e);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDownload = async (id: string) => {
    const res = await fetch(`/api/files/${id}/download`);

    if (!res.ok) {
      alert("Failed to download");
      return;
    }

    const blob = await res.blob();

    const cd = res.headers.get("Content-Disposition") || "";
    const match = cd.match(/filename="(.+)"/);
    const filename = match ? match[1] : "file";

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">File Manager</h1>

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropWrapper}
        className="mb-6 p-4 border-dashed border-2 rounded-md cursor-pointer bg-gray-50"
      >
        <div className="text-gray-600 mb-3">
          Drag & drop a file here, or click to select
        </div>

        <input
          ref={inputRef}
          type="file"
          onChange={onFileSelect}
          className="mb-2"
        />

        {/* Selected File */}
        {selectedFile && (
          <div className="mb-2 p-2 bg-blue-50 border rounded">
            <strong>Selected File:</strong> {selectedFile.name} (
            {selectedFile.size} bytes)
          </div>
        )}

        {/* Description */}
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full mb-3 border px-2 py-1 rounded"
        />

        {/* Upload Button */}
        <button
          onClick={() => uploadFile(description)}
          disabled={!selectedFile || uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-1">{uploadProgress}%</div>
            <div className="w-40 h-2 bg-gray-200 rounded">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="h-2 bg-blue-600 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* FILE LIST TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Created At</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loadingFetchFiles && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Loading files...
              </td>
            </tr>
          )}

          {!loadingFetchFiles &&
            files.map((file) => (
              <tr key={file.id} className="border-t">
                <td className="p-2">{file.name}</td>
                <td className="p-2">{file.type}</td>
                <td className="p-2">{file.description}</td>
                <td className="p-2">
                  {new Date(file.createdAt).toLocaleString()}
                </td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="text-blue-600 underline"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          {!loadingFetchFiles && files.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No files uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
