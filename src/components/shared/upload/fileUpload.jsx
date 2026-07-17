import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FileUpload = ({ title, required = false, onRemove, onFileChange }) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    onFileChange?.(selected);
  };

  const clearFile = () => {
    setFile(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative w-full rounded-2xl border border-border bg-card p-5 text-center shadow-xs transition-shadow hover:shadow-sm">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${title} slot`}
          className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      )}

      <div className="flex items-center justify-center gap-1">
        <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
          {title}
        </span>
        {required && <span className="text-destructive">*</span>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Upload a clear image (JPG, PNG)
      </p>

      <label
        htmlFor={inputId}
        className={cn(
          "group mt-4 flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-input bg-muted/40 transition-colors hover:border-primary hover:bg-accent/10",
          preview &&
            "border-solid border-border bg-transparent p-0 hover:border-primary",
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <Upload className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="text-xs text-muted-foreground">
              Click to browse
            </span>
          </>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          required={required}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-3 py-2 text-left">
          <div className="flex min-w-0 items-center gap-2">
            <ImageIcon className="size-4 shrink-0 text-primary" />
            <span className="truncate text-xs font-medium text-foreground">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={clearFile}
            aria-label="Remove file"
            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
