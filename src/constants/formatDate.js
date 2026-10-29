// Every date in this product is Indian Standard Time. Both halves of that are
// deliberate and have to stay in step:
//
//  1. Parsing. The backend's formatDateTime sends "YYYY-MM-DD HH:mm:ss" with no
//     timezone marker, and it is always IST (see the backend's
//     src/utils/format-date-time.js). `new Date("2026-01-15T10:30:00")` reads a
//     bare timestamp as the *viewer's* local time, so the offset is appended
//     here to say what the string actually means. Without it the value silently
//     shifts by whatever the viewer's clock happens to be set to.
//
//  2. Rendering. toLocale* formats in the viewer's timezone unless told
//     otherwise, so every formatter below pins Asia/Kolkata. A branch manager
//     opening a report from abroad, or a laptop with a wrong timezone, then
//     still sees the same time as everyone else rather than a shifted one.
//
// Proper ISO timestamps from Prisma (…Z) are unambiguous and parse correctly on
// their own; they still need the rendering half.

export const IST_TIME_ZONE = "Asia/Kolkata";

const IST_UTC_OFFSET = "+05:30";

const BARE_TIMESTAMP = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/;

// Accepts a Date or any string the API sends. Returns null rather than an
// Invalid Date so each formatter decides its own placeholder.
const toDate = (value) => {
  if (!value) return null;

  const normalized =
    typeof value === "string"
      ? value.replace(BARE_TIMESTAMP, `$1T$2${IST_UTC_OFFSET}`)
      : value;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (dateString) => {
  const date = toDate(dateString);
  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    timeZone: IST_TIME_ZONE,
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
      timeZone: IST_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, " ")
    .toUpperCase();
};

// Date and time together, for the places that showed a bare
// `new Date(x).toLocaleString()` — which pinned neither locale nor timezone.
export const formatDateTime = (dateValue) => {
  const date = toDate(dateValue);
  if (!date) return "-";

  return `${formatDate(date)}, ${formatTime(date)}`;
};
