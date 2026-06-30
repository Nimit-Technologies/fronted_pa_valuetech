import { Search } from "lucide-react";
import React from "react";

const SuperAdminSearchbar = ({ onSearch, placeholder = "Search branch..." }) => {
  return (
    <div className="w-full max-w-md min-w-40">
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3 text-muted-foreground pointer-events-none"
        />
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full bg-background placeholder:text-muted-foreground text-foreground text-sm border border-border rounded-md pl-9 pr-3 py-2 transition-colors duration-200 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 hover:border-ring/50 shadow-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SuperAdminSearchbar;
