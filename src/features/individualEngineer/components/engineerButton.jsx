import React from "react";
import { Button } from "@/components/ui/button";

const EngineerButton = ({
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

export default EngineerButton;
