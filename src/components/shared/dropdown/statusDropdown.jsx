import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatStatus } from "@/constants/formatStatus";
import useGetAllStatus from "@/hooks/status/useGetAllStatus";

const STATUS_CODES_BY_ROLE = {
  cordinator: new Set([
    "assigned_to_engineer",
    "open",
    "visit_schedule",
    "report_in_progress",
    "close",
    "cancelled",
  ]),
  "branch admin": new Set([
    "assigned_to_engineer",
    "open",
    "visit_schedule",
    "report_in_progress",
    "report_completed",
    "close",
    "cancelled",
  ]),
  engineer: new Set([
    "visit_schedule",
    "visit_hold",
    "visit_in_progress",
    "visit_completed",
    "report_in_progress",
    "report_completed",
  ]),
};

const getStatusCode = (value) => {
  if (typeof value === "string") return value;
  return value?.code ?? "";
};

const StatusDropdown = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Change status",
}) => {
  const role = useSelector((state) => state.auth?.user?.role?.name ?? null);
  const { statuses, loading, error } = useGetAllStatus();
  const [isOpen, setIsOpen] = useState(false);

  const allowedCodes = STATUS_CODES_BY_ROLE[role?.trim().toLowerCase()];
  if (!allowedCodes) return null;

  const activeStatuses = statuses.filter(
    (status) =>
      status.is_active && !status.is_deleted && allowedCodes.has(status.code),
  );
  const selectedCode = getStatusCode(value);
  const selectedStatus = statuses.find(
    (status) => status.code === selectedCode || status.id === selectedCode,
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
          aria-label="Change case status"
        >
          <span
            className={selectedStatus ? "capitalize" : "text-muted-foreground"}
          >
            {selectedStatus ? formatStatus(selectedStatus.name) : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2 px-2 py-4 text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading statuses...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="px-2 py-4 text-center text-sm text-destructive"
            >
              {error}
            </div>
          ) : activeStatuses.length > 0 ? (
            activeStatuses.map((status) => (
              <DropdownMenuItem
                key={status.id}
                onClick={() => onSelect?.(status)}
                className="cursor-pointer capitalize"
                data-active={selectedCode === status.code}
              >
                {formatStatus(status.name || status.code)}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No statuses are available for your role.
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <p className="px-2 py-1 text-xs text-muted-foreground">
          Available actions depend on your role. The case’s current status may
          restrict the selected transition.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
