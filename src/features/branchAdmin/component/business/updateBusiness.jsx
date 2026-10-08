import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useGetByIdBusiness from "@/features/branchAdmin/hooks/business/useGetByIdBusiness";
import useUpdateBusiness from "@/features/branchAdmin/hooks/business/useUpdateBusiness";
import { validateBusinessForm } from "@/features/branchAdmin/services/business/businessFormValidation";

const inputClass =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

const UpdateBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getBusinessById } = useGetByIdBusiness();
  const { Update } = useUpdateBusiness();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getBusinessById(id).then((business) => {
      if (cancelled) return;
      if (business) setForm({ name: business.name });
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [id, getBusinessById]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateBusinessForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await Update({ businessId: id, name: form.name.trim() });
      navigate("/branch-admin/business");
    } catch {
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">Business not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>

        <h1 className="text-lg font-semibold capitalize text-foreground">
          Update Business
        </h1>
      </div>

      <div className="rounded-md border border-border bg-card py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-4xl space-y-8 px-4"
          noValidate
        >
          <div className="space-y-4">
            <h2 className="border-b border-border pb-2 text-base font-semibold capitalize text-foreground">
              Business Details
            </h2>

            <div className="max-w-xl">
              <label
                htmlFor="businessName"
                className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground"
              >
                Business Name
                <span className="text-base leading-none text-destructive">
                  *
                </span>
              </label>
              <Input
                id="businessName"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter business name"
                maxLength={50}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "businessNameError" : undefined}
                className={inputClass}
              />
              {errors.name && (
                <p
                  id="businessNameError"
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center pb-6 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full max-w-xs py-5 text-base capitalize"
            >
              {submitting ? "Updating..." : "Update Business"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBusiness;
