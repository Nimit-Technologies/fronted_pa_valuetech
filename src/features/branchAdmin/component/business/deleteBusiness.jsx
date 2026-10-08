import { useState } from "react";
import { Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/shared/confirmDialog";
import { Button } from "@/components/ui/button";
import useDeleteBusiness from "@/features/branchAdmin/hooks/business/useDeleteBusiness";

const DeleteBusiness = ({ business, onDeleted, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { Delete } = useDeleteBusiness();

  const handleDelete = async () => {
    if (!business?.id) return;

    setDeleting(true);
    try {
      await Delete(business.id);
      await onDeleted?.();
      setOpen(false);
    } catch {
      // The hook already displays the API error; keep the dialog open for retry.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Delete ${business?.name || "business"}`}
        disabled={disabled || !business?.id}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete business"
        description={`"${business?.name || "This business"}" will be moved to deleted businesses. You can restore it later.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default DeleteBusiness;
