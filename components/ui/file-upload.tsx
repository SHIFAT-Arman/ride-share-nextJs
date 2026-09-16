"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

function getFileError(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PNG and JPG/JPEG images are allowed.";
  }
  if (file.size > MAX_SIZE) {
    return "File must be 2 MB or smaller.";
  }
  return null;
}

export const FileUpload = ({
  onChange,
  className,
}: {
  onChange?: (files: File[]) => void;
  className?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;

    const fileError = getFileError(file);
    if (fileError) {
      setError(fileError);
      setFiles([]);
      return;
    }

    setError("");
    setFiles([file]);
    onChange?.([file]);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    maxSize: MAX_SIZE,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: handleFileChange,
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      if (code === "file-too-large") {
        setError("File must be 2 MB or smaller.");
      } else {
        setError("Only PNG and JPG/JPEG images are allowed.");
      }
      setFiles([]);
    },
  });

  return (
    <div className={cn("w-40", className)} {...getRootProps()}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-sky-800/50 bg-white/5 px-2 text-sky-50 transition-colors",
          "hover:border-sky-500/60 hover:bg-white/10",
          isDragActive && "border-sky-400 bg-sky-900/50",
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <IconUpload className="size-4 shrink-0 text-sky-300/80" />
        <span className="truncate text-xs font-medium">
          {isDragActive
            ? "Drop image"
            : files[0]
              ? files[0].name
              : "Upload image"}
        </span>
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
