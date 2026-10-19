const ISO_LIKE = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/;

// Accepts a Date or any string the API sends, including the
// "YYYY-MM-DD HH:mm:ss" that the backend's formatDateTime produces — which is
// not valid ISO, so the space is turned into a "T" before parsing. Returns null
// rather than an Invalid Date so each formatter decides its own placeholder.
const toDate = (value) => {
  if (!value) return null;

  const normalized =
    typeof value === "string" ? value.replace(ISO_LIKE, "$1T$2") : value;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (dateString) => {
  const date = toDate(dateString);
  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// 12-hour clock with an AM/PM marker, e.g. "02:30 PM".
//
// The locale is pinned, as it is in formatDate: the browser's own locale would
// render this 24-hour for most of the world, and the marker is the point.
//
// The marker is uppercased and the spacing collapsed because neither is stable
// — newer ICU emits a narrow no-break space (U+202F) and some locales a
// lowercase "pm" — and the remark thread renders this inside a `capitalize`
// class, which would turn "pm" into "Pm".
export const formatTime = (dateValue) => {
  const date = toDate(dateValue);
  if (!date) return "-";

  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, " ")
    .toUpperCase();
};
