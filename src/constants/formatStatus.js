// Accepts either a status code ("visit_schedule") or the editable display name
// the backend stores beside it ("visit schedule"), so both read the same way in
// a badge.
export const formatStatus = (status) =>
  status
    ? status
        .toLowerCase()
        .split(/[\s_]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "-";

// Keyed by Status.code. The lowercase keys are the ten lifecycle codes the
// backend seeds (src/constant/case-status.js); the uppercase ones are the
// legacy keys the still-mocked case screens pass and are kept until those move
// onto the API too.
export const STATUS_STYLES = {
  open: "bg-blue-100 text-blue-800",
  assigned_to_engineer: "bg-purple-100 text-purple-800",
  visit_schedule: "bg-indigo-100 text-indigo-800",
  visit_hold: "bg-amber-100 text-amber-800",
  visit_in_progress: "bg-yellow-100 text-yellow-800",
  visit_completed: "bg-teal-100 text-teal-800",
  report_in_progress: "bg-cyan-100 text-cyan-800",
  report_completed: "bg-green-100 text-green-800",
  close: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",

  OPEN: "bg-blue-100 text-blue-800",
  ENGINEER_ASSIGNED: "bg-purple-100 text-purple-800",
  ASSIGNED_TO_ENGINEER: "bg-purple-100 text-purple-800",
  VISIT_SCHEDULED: "bg-indigo-100 text-indigo-800",
  VISIT_IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  VISIT_COMPLETED: "bg-teal-100 text-teal-800",
  REPORT_SUBMITTED: "bg-green-100 text-green-800",
  PENDING: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
};
