import React from "react";
import { Bell } from "lucide-react";

const Notification = () => {
  return (
    <button className="flex hover:cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors duration-200">
      <Bell size={18} />
    </button>
  );
};

export default Notification;
