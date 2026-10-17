import { formatDate } from "@/constants/formatDate";

// The shared Comment component speaks the older remark shape. The API sends
// { content, first_name, role_name, department_name, branch_name,
// created_at: "YYYY-MM-DD HH:mm:ss" }, so translate here rather than teaching
// that component two shapes while the engineer screens still pass the old one.
//
// The snapshot columns are used, not the live `role` / `department` / `branch`
// relations beside them: they record who the author was when they wrote the
// remark, which is the thing a reader of an old thread needs, and they survive
// the author moving department or leaving.
//
// Shared by the coordinator's view and update pages, which render the same
// thread off the same payload.
export const toComment = (remark) => {
  const time = String(remark.created_at ?? "").split(" ")[1];

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
    date: formatDate(remark.created_at),
    time: time ? time.slice(0, 5) : "",
  };
};
