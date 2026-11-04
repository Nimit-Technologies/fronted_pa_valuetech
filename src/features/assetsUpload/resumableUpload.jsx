import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import Tus from "@uppy/tus";
import UppyWebcam from "@uppy/webcam";
import Compressor from "@uppy/compressor";
import { useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import "@uppy/webcam/css/style.min.css";

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET;
const TUS_ENDPOINT = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/upload/resumable`;

// tus-js-client's @uppy/tus plugin unconditionally looks up a previous
// upload by fingerprint (source file name/size/type) for every file added,
// and tries to resume it. Supabase finalizes/removes the upload resource
// once a transfer completes, so resuming — including a stale entry already
// cached in this browser's localStorage from before this fix — always 404s.
// A no-op urlStorage means there is never anything to find, in this session
// or any future one, regardless of what's already cached. Photos are small,
// single-session uploads; cross-reload resume isn't worth this recurring
// failure mode.
const noResumeUrlStorage = {
  findUploadsByFingerprint: () => Promise.resolve([]),
  listAllUploads: () => Promise.resolve([]),
  removeUpload: () => Promise.resolve(),
  addUpload: () => Promise.resolve(null),
};

// One Uppy + Dashboard instance per photo slot. `photoType` tags which asset
// category the upload belongs to (matches the backend's photo_type enum),
// `slug` drives the stored object name.
const ResumableUpload = ({
  taskId,
  photoType,
  slug,
  label,
  required = false,
  maxFiles = 10,
  height = 280,
  existingAssets = [],
  onAssetsChange,
}) => {
  // Seeded once from the server's existing assets (if any) and never synced
  // back — once the user replaces a photo, Uppy's own Dashboard shows the
  // new upload's thumbnail/complete state, so there's nothing left for this
  // preview to reflect.
  const [showUploader, setShowUploader] = useState(existingAssets.length === 0);
  const user = useSelector((state) => state.auth.user);
  const employeeId = user?.employee_id ?? null;
  const branchName = user?.branch?.name ?? null;

  // Lets the event handlers below always call the latest callback without
  // needing it in their effect's dependency array (it's a new function
  // identity on every parent render).
  const onAssetsChangeRef = useRef(onAssetsChange);
  useEffect(() => {
    onAssetsChangeRef.current = onAssetsChange;
  }, [onAssetsChange]);

  const [uppy] = useState(() => {
    const instance = new Uppy({
      restrictions: {
        maxNumberOfFiles: maxFiles,
        allowedFileTypes: ["image/*"],
      },
    })
      .use(Compressor, {
        quality: 0.8,
        // PNGs only go through quality compression once converted to JPEG.
        // Default convertSize is 5MB; drop it so smaller PNGs convert too.
        convertSize: 0,
      })
      .use(Tus, {
        endpoint: TUS_ENDPOINT,
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: [
          "bucketName",
          "objectName",
          "contentType",
          "cacheControl",
        ],
        urlStorage: noResumeUrlStorage,
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
      })
      .use(UppyWebcam, { modes: ["picture"] });

    // Compressor can rename/retype a file (e.g. png -> jpg) after file-added
    // already ran, so re-stamp the extension once compression is done, while
    // keeping the same base name/random suffix already set in metadata.
    instance.on("compressor:complete", (files) => {
      for (const compressedFile of files) {
        const current = instance.getFile(compressedFile.id);
        if (!current?.meta.objectName) continue;
        const extension = current.name.split(".").pop();
        const objectNameWithoutExtension = current.meta.objectName.replace(
          /\.[^./]+$/,
          "",
        );
        instance.setFileMeta(current.id, {
          objectName: `${objectNameWithoutExtension}.${extension}`,
          contentType: current.type,
        });
      }
    });

    return instance;
  });

  // Registered in an effect (rather than at Uppy construction) so these
  // always see the current branch/employee/task values — the auth user
  // loads asynchronously, so they can still be null on first render.
  useEffect(() => {
    const assetsByFileId = new Map();

    const emitAssets = () => {
      onAssetsChangeRef.current?.(Array.from(assetsByFileId.values()));
    };

    const handleFileAdded = (file) => {
      const randomNumber = Math.floor(Math.random() * 100000);
      const extension = file.name.split(".").pop();
      const objectName = `${employeeId}_${slug}_${randomNumber}.${extension}`;
      uppy.setFileMeta(file.id, {
        bucketName: BUCKET_NAME,
        objectName: `${branchName}/${taskId}/${objectName}`,
        contentType: file.type,
        cacheControl: "3600",
      });
    };

    const handleUploadSuccess = (file, response) => {
      // Read back the objectName actually used for the upload, rather than
      // recomputing it (recomputing would roll a different random suffix).
      const objectName = file.meta.objectName?.split("/").pop();
      // response.uploadURL is the TUS upload *protocol* endpoint
      // (.../storage/v1/upload/resumable/<id>) — not a usable link to the
      // file. The last path segment is still a valid opaque id, but the
      // actual public download URL has to be built from the bucket + the
      // full object path we set as metadata, not from this URL's host path.
      const objectID = response.uploadURL.split("/").pop();
      const objectUrl = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${file.meta.objectName}`;

      assetsByFileId.set(file.id, {
        objectUrl,
        objectID,
        objectName,
        photoType,
      });
      emitAssets();
    };

    const handleFileRemoved = (file) => {
      if (!assetsByFileId.delete(file.id)) return;
      emitAssets();
    };

    uppy.on("file-added", handleFileAdded);
    uppy.on("upload-success", handleUploadSuccess);
    uppy.on("file-removed", handleFileRemoved);

    return () => {
      uppy.off("file-added", handleFileAdded);
      uppy.off("upload-success", handleUploadSuccess);
      uppy.off("file-removed", handleFileRemoved);
    };
  }, [uppy, employeeId, branchName, taskId, slug, photoType]);

  if (!showUploader) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
        <div className="flex items-center justify-center gap-1 pb-3">
          <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
            {label}
          </span>
          {required && <span className="text-destructive">*</span>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {existingAssets.map((asset, index) => (
            <div
              key={asset.objectID ?? index}
              className="overflow-hidden rounded-lg border border-border"
            >
              <img
                src={asset.objectUrl}
                alt={asset.objectName ?? label}
                className="aspect-video w-full object-cover"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowUploader(true)}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          Replace photo{existingAssets.length > 1 ? "s" : ""}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 text-center shadow-xs">
      <div className="flex items-center justify-center gap-1 pb-3">
        <span className="text-sm font-semibold tracking-wide text-foreground uppercase">
          {label}
        </span>
        {required && <span className="text-destructive">*</span>}
      </div>
      <Dashboard
        uppy={uppy}
        plugins={["Webcam"]}
        width="100%"
        height={height}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
};

export default ResumableUpload;
