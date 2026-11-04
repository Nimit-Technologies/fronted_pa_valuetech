import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import ResumableUpload from "@/features/assetsUpload/resumableUpload";
import { selectCaseIdByTaskId } from "@/features/individualEngineer/slice/engineerTaskSlice";
import saveAssets from "@/features/individualEngineer/services/saveAssets";

const REQUIRED_PHOTOS = [
  {
    id: "RoadApproachPhoto",
    label: "Road Approach Photo",
    slug: "road_approach",
  },
  { id: "OutsidePhoto", label: "Outside Photo", slug: "outside" },
  { id: "NamePlatePhoto", label: "Name Plate Photo", slug: "nameplate" },
  { id: "MeterPhoto", label: "Meter Photo", slug: "meter" },
  { id: "SelfiePhoto", label: "Selfie Photo", slug: "selfie" },
];

const MAX_ADDITIONAL_PHOTOS = 15;

// Groups the task's previously saved assets (from GET .../assets) by
// photoType, so each tile can be seeded with what's already uploaded.
const groupByPhotoType = (assets) => {
  const byType = {};
  for (const asset of assets) {
    const entry = {
      objectUrl: asset.objectUrl,
      objectID: asset.objectID,
      objectName: asset.objectName,
      photoType: asset.photoType,
    };
    (byType[asset.photoType] ??= []).push(entry);
  }
  return byType;
};

const Step7 = forwardRef(({ taskId, initialAssets = [] }, ref) => {
  const initialByType = groupByPhotoType(initialAssets);

  const [additionalPhotos, setAdditionalPhotos] = useState(() =>
    (initialByType.AdditionalPhoto ?? []).map(
      (_, index) => `existing-${index}`,
    ),
  );
  const requiredAssetsRef = useRef(
    Object.fromEntries(
      REQUIRED_PHOTOS.map(({ id }) => [id, initialByType[id] ?? []]),
    ),
  );
  const additionalAssetsRef = useRef(
    Object.fromEntries(
      (initialByType.AdditionalPhoto ?? []).map((asset, index) => [
        `existing-${index}`,
        [asset],
      ]),
    ),
  );
  const caseId = useSelector((state) => selectCaseIdByTaskId(state, taskId));
  const [syncError, setSyncError] = useState(null);

  // Files upload straight to Supabase the moment they're picked, independent
  // of the Save Draft/Submit buttons — so without this, a refresh before
  // clicking either would lose the metadata (objectUrl/objectID) entirely,
  // even though the file itself is already sitting in storage. Queued
  // (rather than fired-and-forgotten per call) so two uploads completing
  // close together can't race and have the slower response's older snapshot
  // overwrite the newer one — saveMyAssets does a full replace per call.
  const saveQueueRef = useRef(Promise.resolve());
  const syncAssets = () => {
    const assets = [
      ...Object.values(requiredAssetsRef.current).flat(),
      ...additionalPhotos.flatMap(
        (id) => additionalAssetsRef.current[id] ?? [],
      ),
    ];
    saveQueueRef.current = saveQueueRef.current
      .catch(() => {})
      .then(() => saveAssets(taskId, { assets }))
      .then(() => setSyncError(null))
      .catch((error) => {
        console.error("Failed to auto-save report photos:", error);
        setSyncError(
          "Couldn't save a photo automatically — it will be saved again when you click Save Draft or Submit.",
        );
      });
  };

  const addPhotoSlot = () => {
    setAdditionalPhotos((prev) =>
      prev.length >= MAX_ADDITIONAL_PHOTOS
        ? prev
        : [...prev, `${Date.now()}-${prev.length}`],
    );
  };

  const removePhotoSlot = (id) => {
    setAdditionalPhotos((prev) => prev.filter((photoId) => photoId !== id));
    delete additionalAssetsRef.current[id];
    syncAssets();
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({
      caseId,
      requiredPhotos: { ...requiredAssetsRef.current },
      additionalPhotos: additionalPhotos.map((id, index) => ({
        title: `Additional Photo ${index + 1}`,
        assets: additionalAssetsRef.current[id] ?? [],
      })),
    }),
    // The report is only considered complete once every required category
    // has at least one uploaded photo — Additional Photos stay optional.
    getMissingRequiredPhotos: () =>
      REQUIRED_PHOTOS.filter(
        ({ id }) => (requiredAssetsRef.current[id]?.length ?? 0) === 0,
      ).map(({ label }) => label),
  }));

  return (
    <div className="space-y-8 p-2">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Report Photos
          </h2>
          <p className="text-sm text-muted-foreground">
            Photos upload and save automatically — no need to wait for Save
            Draft or Submit.
          </p>
          {syncError && (
            <p role="alert" className="text-sm text-destructive">
              {syncError}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REQUIRED_PHOTOS.map(({ id, label, slug }) => (
            <ResumableUpload
              key={id}
              taskId={taskId}
              photoType={id}
              slug={slug}
              label={label}
              required
              maxFiles={15}
              existingAssets={requiredAssetsRef.current[id]}
              onAssetsChange={(assets) => {
                requiredAssetsRef.current[id] = assets;
                syncAssets();
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
            <div key={id} className="relative">
              <button
                type="button"
                onClick={() => removePhotoSlot(id)}
                aria-label={`Remove Additional Photo ${index + 1} slot`}
                className="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" />
              </button>
              <ResumableUpload
                taskId={taskId}
                photoType="AdditionalPhoto"
                slug={`additional_${index + 1}`}
                label={`Additional Photo ${index + 1}`}
                maxFiles={1}
                existingAssets={additionalAssetsRef.current[id]}
                onAssetsChange={(assets) => {
                  additionalAssetsRef.current[id] = assets;
                  syncAssets();
                }}
              />
            </div>
          ))}

          {additionalPhotos.length < MAX_ADDITIONAL_PHOTOS && (
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
          )}
        </div>
      </section>
    </div>
  );
});

Step7.displayName = "Step7";

export default Step7;
