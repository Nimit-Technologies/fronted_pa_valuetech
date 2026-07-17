import React from "react";

const FormHeader = ({ children }) => {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-2">
      <h2 className="text-base font-semibold text-foreground capitalize">
        {children}
      </h2>
    </div>
  );
};

export default FormHeader;
