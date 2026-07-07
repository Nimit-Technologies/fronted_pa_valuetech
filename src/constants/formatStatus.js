export const formatStatus = (status) =>
  status
    ? status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "-";

export const STATUS_STYLES = {
  OPEN: "bg-blue-100 text-blue-800",
  ENGINEER_ASSIGNED: "bg-purple-100 text-purple-800",
  VISIT_SCHEDULED: "bg-indigo-100 text-indigo-800",
  VISIT_IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  VISIT_COMPLETED: "bg-teal-100 text-teal-800",
  REPORT_SUBMITTED: "bg-green-100 text-green-800",
  PENDING: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
};
