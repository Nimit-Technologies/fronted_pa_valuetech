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
import { Link } from "react-router-dom";
import Logout from "./logout";
import { useSelector } from "react-redux";

const UserAvatar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-full bg-muted border-border text-foreground text-sm font-semibold uppercase hover:bg-muted/70 transition-colors duration-300 flex items-center justify-center"
        >
          P
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80 mt-2 rounded-lg shadow-lg border border-border bg-card px-4 py-4">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground capitalize">
            user details
          </PopoverTitle>
          <PopoverDescription className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="capitalize">{user.data.first_name} {user.data.last_name}</p>
            <p>{user.data.phone}</p>
            <p className="capitalize">{user.data.role.name}</p>
            <p className="capitalize">super admin</p>
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex w-full items-center justify-between mt-3 pt-3 border-t border-border">
          <Link
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            to="/super-admin/user-profile"
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
