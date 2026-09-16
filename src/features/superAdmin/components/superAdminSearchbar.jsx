import React from "react";
import SearchInput from "@/components/shared/searchInput";

// Page-level search box. It reports every keystroke because the table hooks
// (useTableSearch) already debounce on their side.
const SuperAdminSearchbar = ({
  onSearch,
  placeholder = "Search...",
  disabled = false,
}) => {
  return (
    <SearchInput
      className="w-full max-w-md min-w-40"
      placeholder={placeholder}
      disabled={disabled}
      onValueChange={onSearch}
    />
  );
};

export default SuperAdminSearchbar;
