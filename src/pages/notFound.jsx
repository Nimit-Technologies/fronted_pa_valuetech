import { Link, useLocation } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSession from "@/features/auth/hooks/useSession";
import { roleBasePath } from "@/features/auth/constants/roles";

/**
 * The catch-all route. Until this existed, an unknown URL — a mistyped path, a
 * stale bookmark, the footer's own Developer Support link — rendered the navbar
 * and footer with nothing between them, which reads as a broken app rather
 * than a wrong address.
 *
 * The way out is role-aware: `roleBasePath` resolves the dashboard this
 * session is allowed to see, and signed-out visitors are offered login. Never
 * derived from the URL, which is by definition the part that is wrong here.
 */
const NotFound = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, role } = useSession();

  const home = (isAuthenticated && roleBasePath(role)) || "/";
  const homeLabel = home === "/" ? "Go to login" : "Go to dashboard";

  return (
    <div className="h-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <FileQuestion className="text-muted-foreground" size={48} />
        </div>

        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          This page doesn't exist
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          We couldn't find{" "}
          <span className="font-mono break-all">{pathname}</span>. It may have
          been moved, or the link may be out of date.
        </p>

        <Button asChild size="lg">
          <Link to={home}>{homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
