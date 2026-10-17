import React from "react";
import { Button } from "@/components/ui/button";

const BranchAdminButton = ({
  children = "Submit",
  onClick,
  type = "submit",
  className = "",
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}

      className={`capitalize px-6 rounded-md ${className}`}
    >
      {children}
    </Button>
  );
};

export default BranchAdminButton;
