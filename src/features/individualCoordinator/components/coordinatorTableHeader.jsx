import React from "react";
import { useNavigate } from "react-router-dom";
import CoordinatorSearchbar from "@/features/individualCoordinator/components/coordinatorSearchbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CoordinatorTableHeader = ({ onSearch, createRoute, createLabel = "Create" }) => {
  const navigate = useNavigate();

  const renderCreate = () => (
    <Button className="gap-2 whitespace-nowrap" onClick={() => navigate(createRoute)}>
      <Plus size={16} />
      {createLabel}
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row bg-card border border-border shadow-sm rounded-md w-full px-4 py-4 gap-3 sm:items-center sm:justify-between">
      <CoordinatorSearchbar onSearch={onSearch} />
      {renderCreate()}
    </div>
  );
};

export default CoordinatorTableHeader;
