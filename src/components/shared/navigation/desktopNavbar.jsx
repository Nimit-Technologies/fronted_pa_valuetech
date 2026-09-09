import React from "react";
import Logo from "/pa_valuetech_logo.png";
import Notification from "@/components/shared/notification";
import UserAvatar from "@/components/shared/auth/userAvatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/hooks/useSession";

const DesktopNavbar = ({ title }) => {
  const { isAuthenticated, loading } = useSession();

  return (
    <div className="flex items-center justify-between w-full px-6 py-3 bg-card border-b border-border shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={Logo}
          alt="PA Valuetech"
          className="h-9 w-auto object-contain"
        />
      </Link>

      <p className="text-sm font-semibold text-foreground capitalize tracking-wide">
        {title}
      </p>

      <div className="flex items-center gap-2">
        <Notification />

        {!loading && isAuthenticated ? (
          <UserAvatar />
        ) : (
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <Link to="/">Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
