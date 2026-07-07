import React from "react";
import { NavLink } from "react-router-dom";

const DesktopSidebar = ({ menu = [] }) => {
  return (
    <aside className="h-full w-52 lg:w-64 shrink-0 bg-card border-r border-border flex flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menu.map((group, index) => (
          <div key={index}>
            {group.section && (
              <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  end={Boolean(item.exact)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {item.icon && <item.icon size={18} className="shrink-0" />}
                  <span className="capitalize">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default DesktopSidebar;
