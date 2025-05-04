// components/FileUpload.tsx
import React, { useContext, useState, useRef } from "react";
import { FormContext } from "../Form";
import { FormContextType } from "../../types";

interface FileUploadProps {
  name: string;
  value: File[] | null;
  onChange: (value: File[] | null) => void;
  onBlur: () => void;
  accept?: string; // e.g., "image/*,.pdf"
  multiple?: boolean;
  maxSize?: number; // in bytes (e.g., 5MB = 5 * 1024 * 1024)
  className?: string;
}

/**
 * FileUpload component with drag-and-drop support and file previews.
 * Integrates with Form context and uses Tailwind CSS for styling.
 */
const FileUpload: React.FC<FileUploadProps> = ({
  name,
  value,
  onChange,
  onBlur,
  accept,
  multiple = false,
  maxSize,
  className = "",
}) => {
  const context = useContext<FormContextType | undefined>(FormContext);
  if (!context) {
    throw new Error("FileUpload must be used within a Form");
  }

  const { errors, touched } = context;
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle file selection (input or drop)
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((file) =>
      maxSize ? file.size <= maxSize : true
    );
    if (multiple) {
      onChange(value ? [...value, ...newFiles] : newFiles);
    } else {
      onChange(newFiles.slice(0, 1)); // Take first file for single upload
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    onBlur();
  };

  // Handle drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
    onBlur();
  };

  // Remove a file
  const handleRemove = (index: number) => {
    if (!value) return;
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles.length > 0 ? newFiles : null);
  };

  // Open file picker
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Drag-and-drop area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-md p-6 text-center cursor-pointer
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
          hover:border-blue-400 hover:bg-blue-100 transition-colors
        `}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onBlur={onBlur}
          className="hidden"
        />
        <p className="text-gray-600">
          {isDragging ? "Drop files here" : "Drag & drop files or click to browse"}
        </p>
        {accept && (
          <p className="text-sm text-gray-500 mt-1">
            Accepted: {accept.replace(/,/g, ", ")}
          </p>
        )}
        {maxSize && (
          <p className="text-sm text-gray-500">
            Max size: {formatFileSize(maxSize)}
          </p>
        )}
      </div>

      {/* File list with previews */}
      {value && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
            >
              <div className="flex items-center space-x-3">
                {/* Image preview or file icon */}
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} // Clean up
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                )}
                <div>
                  <p className="text-sm text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {touched[name] && errors[name] && (
        <p className="mt-2 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default FileUpload;