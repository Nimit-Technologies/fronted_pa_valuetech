import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Plus } from "lucide-react";
import FileUpload from "@/components/shared/upload/fileUpload";

const COMPULSORY_PHOTOS = [
  "Road Approach Photo",
  "Outside Photo",
  "Name Plate Photo",
  "Meter Photo",
  "Selfie Photo",
];

const Step7 = forwardRef((_props, ref) => {
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const requiredFilesRef = useRef({});
  const additionalFilesRef = useRef({});

  const addPhotoSlot = () => {
    setAdditionalPhotos((prev) => [...prev, `${Date.now()}-${prev.length}`]);
  };

  const removePhotoSlot = (id) => {
    setAdditionalPhotos((prev) => prev.filter((photoId) => photoId !== id));
    delete additionalFilesRef.current[id];
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({
      requiredPhotos: { ...requiredFilesRef.current },
      additionalPhotos: additionalPhotos.map((id, index) => ({
        title: `Additional Photo ${index + 1}`,
        file: additionalFilesRef.current[id] ?? null,
      })),
    }),
  }));

  return (
    <div className="space-y-8 p-2">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Required Photos
          </h2>
          <p className="text-sm text-muted-foreground">
            All 5 photos below are mandatory to submit the report.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPULSORY_PHOTOS.map((title) => (
            <FileUpload
              key={title}
              title={title}
              required
              onFileChange={(file) => {
                requiredFilesRef.current[title] = file;
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Additional Photos
          </h2>
          <p className="text-sm text-muted-foreground">
            Optional - add any extra supporting images.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {additionalPhotos.map((id, index) => (
            <FileUpload
              key={id}
              title={`Additional Photo ${index + 1}`}
              onRemove={() => removePhotoSlot(id)}
              onFileChange={(file) => {
                additionalFilesRef.current[id] = file;
              }}
            />
          ))}

          <button
            type="button"
            onClick={addPhotoSlot}
            className="flex min-h-55 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input text-muted-foreground transition-colors hover:border-primary hover:bg-accent/10 hover:text-primary"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <Plus className="size-5" />
            </span>
            <span className="text-sm font-medium">Add More Photo</span>
          </button>
        </div>
      </section>
    </div>
  );
});

Step7.displayName = "Step7";

export default Step7;
