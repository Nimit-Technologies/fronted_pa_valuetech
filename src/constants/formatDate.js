const ISO_LIKE = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/;

export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const normalized =
    typeof dateString === "string"
      ? dateString.replace(ISO_LIKE, "$1T$2")
      : dateString;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
