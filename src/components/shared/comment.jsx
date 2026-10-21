import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import CoordinatorButton from "@/features/individualCoordinator/components/CoordinatorButton";
import { formatDate, formatTime } from "@/constants/formatDate";

// Two ways to add a remark, because the screens are mid-migration:
//
//   onSubmit(content)  the caller persists it (POST /remark/:caseId) and feeds
//                      the saved remark back through `remarks`. The box clears
//                      only once the write succeeds.
//   onAddComment(r)    the older mock path: the remark is kept locally, since
//                      there is nothing to save it to, and stamped with the
//                      `author` the caller passed.
//
// `author` is only consulted on that second path — on the persisted one the
// backend stamps the snapshot and sends it back. It stays a prop rather than a
// store read so this component keeps rendering anywhere, including the screens
// still on mock data that mount outside a Provider.
//
// `remarks` is rendered from props rather than copied into state, so a thread
// that arrives after mount (an async fetch) still shows up.
const Comment = ({
  remarks = [],
  onAddComment,
  onSubmit,
  author,
  disabled = false,
}) => {
  const [comment, setComment] = useState("");
  const [localRemarks, setLocalRemarks] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const comments = useMemo(
    () => [...remarks, ...localRemarks],
    [remarks, localRemarks],
  );

  const handleAddComment = async () => {
    const content = comment.trim();
    if (content === "" || submitting) return;

    if (onSubmit) {
      setSubmitting(true);
      try {
        await onSubmit(content);
        setComment("");
      } catch {
        // The caller has already surfaced the reason; keep the text so a
        // rejected remark is not lost.
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const now = new Date();
    const newRemark = {
      // Each field is rendered only when present (see the thread above), so a
      // caller that passes no author, or a partial one, simply omits those
      // lines instead of inventing them.
      user: {
        first_name: author?.first_name,
        role: { name: author?.role?.name },
        department: { name: author?.department?.name },
        branch: { name: author?.branch?.name },
      },
      comment,
      // Same formatters the persisted path runs through (see toComment), so a
      // locally added remark is not the one row in the thread with a different
      // date style or a 24-hour clock.
      date: formatDate(now),
      time: formatTime(now),
    };

    setLocalRemarks((prev) => [...prev, newRemark]);
    onAddComment?.(newRemark);
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
  };

  const inputDisabled = disabled || submitting;

  return (
    <div className="bg-card px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 border border-border shadow-sm rounded-md">
      <h1 className="capitalize text-sm md:text-base font-semibold text-foreground">
        Remark
      </h1>

      {/* Comment Display Section */}
      <div className="flex flex-col h-44 overflow-y-auto gap-4 mt-4 bg-background p-4 sm:p-6 rounded-md border border-border shadow-xs">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center my-auto">
            No remarks yet.
          </p>
        ) : (
          comments.map((c, idx) => (
            <div
              // The remark's own id where there is one. The screens still on
              // mock data pass remarks without ids, and there the position is
              // all there is to key on.
              key={c.id ?? idx}
              className="flex flex-col md:flex-row md:justify-between md:items-start gap-2"
            >
              <p className="text-sm text-foreground leading-relaxed">
                {c.comment}
              </p>
              {/* Who wrote it, and in what capacity: role, department and
                  branch. Each is rendered only when present — a remark from a
                  screen still on mock data may carry fewer of them. */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="text-foreground capitalize">
                  {c.user?.first_name}
                </p>
                <div className="flex flex-wrap gap-4 capitalize">
                  <p>{c.date}</p>
                  <p>{c.time}</p>
                  {c.user?.role?.name ? <p>{c.user.role.name}</p> : null}
                  {c.user?.department?.name ? (
                    <p>{c.user.department.name}</p>
                  ) : null}
                  {c.user?.branch?.name ? <p>{c.user.branch.name}</p> : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input Section */}
      <div className="flex flex-col gap-4 mt-4 bg-background p-4 sm:p-6 rounded-md border border-border shadow-xs md:flex-row md:items-center ">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddComment();
            }
          }}
          disabled={inputDisabled}
          maxLength={2000}
          placeholder="Add your comment here"
          className="w-full flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex flex-col w-full gap-1.5 sm:flex-row sm:w-auto sm:items-center">
          <CoordinatorButton
            type="button"
            className="w-full sm:w-auto"
            onClick={handleAddComment}
            disabled={inputDisabled}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding
              </span>
            ) : (
              "Add Comment"
            )}
          </CoordinatorButton>
          <CoordinatorButton
            type="button"
            className="w-full sm:w-auto bg-chart-5 text-white hover:bg-chart-5"
            onClick={handleCancel}
            disabled={inputDisabled}
          >
            Cancel
          </CoordinatorButton>
        </div>
      </div>
    </div>
  );
};

export default Comment;
