import React, { useState } from "react";
import CoordinatorButton from "@/features/individualCoordinator/components/coordinatorButton";
import { userProfileData } from "@/data/userProfile";

const Comment = ({ remarks = [], onAddComment }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(remarks);

  const handleAddComment = () => {
    if (comment.trim() === "") return;

    const currentUser = userProfileData.data[0];
    const now = new Date();
    const newRemark = {
      user: {
        first_name: currentUser.first_name,
        role: { name: currentUser.role?.name || "Coordinator" },
        department: { name: currentUser.department?.name || "Operations" },
      },
      comment,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setComments((prev) => [...prev, newRemark]);
    onAddComment?.(newRemark);
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
  };

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
              key={idx}
              className="flex flex-col md:flex-row md:justify-between md:items-start gap-2"
            >
              <p className="text-sm text-foreground leading-relaxed">
                {c.comment}
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="text-foreground">{c.user?.first_name}</p>
                <div className="flex flex-wrap gap-4">
                  <p>{c.date}</p>
                  <p>{c.time}</p>
                  <p>{c.user?.role?.name}</p>
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
          placeholder="Add your comment here"
          className="w-full flex-1 rounded-md border border-border bg-card px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
        />

        <div className="flex flex-col w-full gap-1.5 sm:flex-row sm:w-auto sm:items-center">
          <CoordinatorButton
            type="button"
            className="w-full sm:w-auto"
            onClick={handleAddComment}
          >
            Add Comment
          </CoordinatorButton>
          <CoordinatorButton
            type="button"
            className="w-full sm:w-auto bg-chart-5 text-white hover:bg-chart-5"
            onClick={handleCancel}
          >
            Cancel
          </CoordinatorButton>
        </div>
      </div>
    </div>
  );
};

export default Comment;
