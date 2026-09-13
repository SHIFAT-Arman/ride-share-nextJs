"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onChange,
  className,
}: {
  onChange?: (files: File[]) => void;
  className?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const next = newFiles.slice(0, 1);
    setFiles(next);
    onChange?.(next);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop: handleFileChange,
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
          accept="image/jpeg,image/png,image/webp"
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
    </div>
  );
};
