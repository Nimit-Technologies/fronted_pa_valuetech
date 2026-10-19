import { formatDate, formatTime } from "@/constants/formatDate";

// The shared Comment component speaks the older remark shape. The API sends
// { content, first_name, role_name, department_name, branch_name, created_at },
// so translate here rather than teaching that component two shapes while the
// engineer screens still pass the old one.
//
// `created_at` arrives in two different formats and both reach this function:
// the case detail reformats it to "YYYY-MM-DD HH:mm:ss" (see the backend's
// case-history.js), while the remark endpoints return the raw Prisma date as
// ISO-8601 with a Z. ViewCasePage prepends the POST's response straight onto
// the detail's array, so one thread holds both. formatDate/formatTime accept
// either — do not go back to slicing the string, which silently produced an
// empty time for the ISO form.
//
// The snapshot columns are used, not the live `role` / `department` / `branch`
// relations beside them: they record who the author was when they wrote the
// remark, which is the thing a reader of an old thread needs, and they survive
// the author moving department or leaving.
//
// Shared by the coordinator's view and update pages, which render the same
// thread off the same payload.
export const toComment = (remark) => {
  return {
    // Carried through so the thread can key its rows on the remark rather than
    // on its position in the array.
    id: remark.id,
    comment: remark.content,
    user: {
      first_name: remark.first_name,
      role: { name: remark.role_name },
      department: { name: remark.department_name },
      branch: { name: remark.branch_name },
    },
    // Both read off the same `created_at`, so the thread shows e.g.
    // "17 Oct 2026" next to "02:30 PM".
    date: formatDate(remark.created_at),
    time: formatTime(remark.created_at),
  };
};
