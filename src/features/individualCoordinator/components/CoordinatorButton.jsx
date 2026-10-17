import React from "react";
import { Button } from "@/components/ui/button";

const CoordinatorButton = ({
  children = "Submit",
  onClick,
  type = "submit",
  className = "",
  disabled = false,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`capitalize px-6 rounded-md ${className}`}
    >
      {children}
    </Button>
  );
};

export default CoordinatorButton;
