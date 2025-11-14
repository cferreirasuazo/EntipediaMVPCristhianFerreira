"use client";

import { useFileManager } from "../hooks/useFileManager";

export default function ArchivesPage() {
  const {
    files,
    uploading,
    selectedFile,
    setSelectedFile,
    uploadFile,
    deleteFileByKey,
  } = useFileManager();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">File Manager</h1>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={uploadFile}
          disabled={!selectedFile || uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Size</th>
            <th className="p-2 text-left">Last Modified</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.key} className="border-t">
              <td className="p-2">{file.key}</td>
              <td className="p-2">{file.size}</td>
              <td className="p-2">
                {new Date(file.lastModified).toLocaleString()}
              </td>
              <td className="p-2">
                <a
                  href={file.downloadUrl}
                  target="_blank"
                  className="text-blue-500 mr-2"
                >
                  Download
                </a>
                <button
                  onClick={() => deleteFileByKey(file.key)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
