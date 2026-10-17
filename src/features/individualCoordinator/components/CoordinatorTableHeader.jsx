import React from "react";
import { useNavigate } from "react-router-dom";
import CoordinatorSearchbar from "@/features/individualCoordinator/components/CoordinatorSearchbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// `children` is an optional slot between the search box and the create button,
// for controls that belong to the list itself (e.g. the case list's
// "show finished" toggle).
const CoordinatorTableHeader = ({
  onSearch,
  createRoute,
  createLabel = "Create",
  placeholder,
  disabled = false,
  children,
}) => {
  const navigate = useNavigate();

  const renderCreate = () => (
    <Button
      className="gap-2 whitespace-nowrap"
      disabled={disabled}
      onClick={() => navigate(createRoute)}
    >
      <Plus size={16} />
      {createLabel}
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row bg-card border border-border shadow-sm rounded-md w-full px-4 py-4 gap-3 sm:items-center sm:justify-between">
      <CoordinatorSearchbar
        onSearch={onSearch}
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        {children}
        {renderCreate()}
      </div>
    </div>
  );
};

export default CoordinatorTableHeader;
