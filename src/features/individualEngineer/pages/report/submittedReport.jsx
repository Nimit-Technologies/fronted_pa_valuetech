import { formatDateTime } from "@/constants/formatDate";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Download, ImageOff } from "lucide-react";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import Step2 from "@/features/individualEngineer/pages/report/steps/step2";
import Step3 from "@/features/individualEngineer/pages/report/steps/step3";
import Step4 from "@/features/individualEngineer/pages/report/steps/step4";
import Step5 from "@/features/individualEngineer/pages/report/steps/step5";
import Step6 from "@/features/individualEngineer/pages/report/steps/step6";
import useGetReportByCaseId from "@/hooks/report/useGetReportByCaseId";
import getCaseAssets from "@/features/individualEngineer/services/getCaseAssets";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { Button } from "@/components/ui/button";

const PHOTO_TYPE_LABELS = {
  RoadApproachPhoto: "Road Approach Photo",
  OutsidePhoto: "Outside Photo",
  NamePlatePhoto: "Name Plate Photo",
  MeterPhoto: "Meter Photo",
  SelfiePhoto: "Selfie Photo",
  AdditionalPhoto: "Additional Photo",
};

// Supabase serves the public object without forcing a download, so a plain
// `<a download>` just opens the image in a new tab for a cross-origin URL.
// Fetching the bytes and saving via an object URL guarantees an actual
// "Save As" regardless of the response's own headers.
const downloadPhoto = async (asset) => {
  const response = await fetch(asset.objectUrl);
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = asset.objectName || "photo.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

const SubmittedReport = () => {
  const { id: caseId } = useParams();
  const { report, task, loading, error } = useGetReportByCaseId(caseId);

  const [photos, setPhotos] = useState(null);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  // Branch-scoped, same access model as the report itself (useGetReportByCaseId
  // above) — anyone authenticated in this branch can view it, not only the
  // engineer who filed it — so this only needs caseId, not task.
  const handleViewPhotos = async () => {
    setPhotosLoading(true);
    setPhotosError(null);
    try {
      const response = await getCaseAssets(caseId);
      setPhotos(response.data ?? []);
    } catch (fetchError) {
      setPhotosError(
        extractErrorMessage(fetchError, "Failed to load report photos."),
      );
    } finally {
      setPhotosLoading(false);
    }
  };

  const handleDownload = async (asset) => {
    setDownloadError(null);
    try {
      await downloadPhoto(asset);
    } catch {
      setDownloadError(`Couldn't download ${asset.objectName}.`);
    }
  };

  if (loading) {
    return <p role="status">Loading submitted report...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const submittedAt = report?.submittedAt
    ? formatDateTime(report.submittedAt)
    : "Unknown";
  const formData = report?.formData ?? {};

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-4">
      <header className="rounded-md border border-border bg-card p-5">
        <h1 className="text-lg font-semibold text-foreground">
          Submitted Site Visit Report
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted on {submittedAt}. This report is read-only.
        </p>
      </header>

      <fieldset
        disabled
        className="min-w-0 space-y-6 border-0 p-0"
        aria-label="Submitted report"
      >
        <Step1
          initialData={formData.step1 ?? {}}
          task={task}
          showInitiationAddress
        />
        <section className="rounded-md border border-border bg-card p-5">
          <Step2 initialData={formData.step2 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step3 initialData={formData.step3 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step4 initialData={formData.step4 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step5 initialData={formData.step5 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step6 initialData={formData.step6 ?? {}} />
        </section>
      </fieldset>

      <div className="flex items-center justify-between rounded-md border border-border bg-card p-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Report Photos
          </h2>
          <p className="text-sm text-muted-foreground">
            View and download the photos submitted with this report.
          </p>
        </div>
        <Button onClick={handleViewPhotos} disabled={!caseId}>
          View Photos
        </Button>
      </div>

      {photosLoading && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading photos...
        </p>
      )}

      {photosError && (
        <p role="alert" className="text-sm text-destructive">
          {photosError}
        </p>
      )}

      {downloadError && (
        <p role="alert" className="text-sm text-destructive">
          {downloadError}
        </p>
      )}

      {!photosLoading && !photosError && photos && photos.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageOff className="size-4" />
          No photos were uploaded with this report.
        </p>
      )}

      {!photosLoading && !photosError && photos && photos.length > 0 && (
        <div className="space-y-4">
          {photos.map((asset, index) => (
            <div
              key={asset.id}
              className="space-y-3 rounded-md border border-border bg-card p-5"
            >
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">
                    Serial Number:
                  </dt>
                  <dd className="text-muted-foreground">{index + 1}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">Photo Type:</dt>
                  <dd className="text-muted-foreground">
                    {PHOTO_TYPE_LABELS[asset.photoType] ?? asset.photoType}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">Employee ID:</dt>
                  <dd className="text-muted-foreground">{asset.employeeId}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">Object Name:</dt>
                  <dd className="text-muted-foreground">{asset.objectName}</dd>
                </div>
              </dl>

              <img
                src={asset.objectUrl}
                alt={asset.objectName}
                width={400}
                height={400}
                className="rounded-md border border-border object-cover"
              />

              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(asset)}
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmittedReport;
