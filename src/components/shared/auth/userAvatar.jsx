import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { userProfileData } from "@/data/userProfile";
import Logout from "@/components/shared/auth/logout";

const UserAvatar = () => {
  const { pathname } = useLocation();
  const user = userProfileData.data[0];
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const basePath = pathname.startsWith("/coordinator")
    ? "/coordinator"
    : "/super-admin";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-full bg-muted border-border text-foreground text-sm font-semibold uppercase hover:bg-muted/70 transition-colors duration-300 flex items-center justify-center"
        >
          {user?.first_name?.charAt(0) || "?"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80 mt-2 rounded-lg shadow-lg border border-border bg-card px-4 py-4">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground capitalize">
            user details
          </PopoverTitle>
          <PopoverDescription className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="capitalize">{fullName || "-"}</p>
            <p>{user?.phone || "-"}</p>
            <p className="capitalize">{user?.department?.name || "-"}</p>
            <p className="capitalize">{user?.role?.name || "-"}</p>
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex w-full items-center justify-between mt-3 pt-3 border-t border-border">
          <Link
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            to={`${basePath}/user-profile`}
          >
            view profile
          </Link>
          <Logout />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
