import React from "react";
import { NavLink } from "react-router-dom";

const MobileSidebar = ({ menu = [] }) => {
  return (
    <aside className="h-full w-14 shrink-0 bg-card border-r border-border flex flex-col">
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">
        {menu.map((group, index) => (
          <div key={index}>
            <div className="space-y-0.5">
              {group.items.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center rounded-md mx-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {item.icon && <item.icon size={18} className="shrink-0" />}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default MobileSidebar;
