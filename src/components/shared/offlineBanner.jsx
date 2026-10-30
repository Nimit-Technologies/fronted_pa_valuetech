import { WifiOff } from "lucide-react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

/**
 * A strip across the top of the app while the browser is offline.
 *
 * Deliberately a banner and not a dialog or a redirect: an engineer who loses
 * signal mid-report must keep the form, the typing and the scroll position they
 * had. Nothing here blocks input — saving will fail with its own message, and
 * the work is still on screen to retry.
 *
 * `aria-live="assertive"` because losing the connection changes what the next
 * tap will do, which a screen-reader user otherwise discovers only when a save
 * fails.
 */
const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-destructive/10 text-destructive border-b border-destructive/20"
    >
      <WifiOff size={16} aria-hidden="true" />
      <span>
        No internet connection. You can keep working, but nothing will save
        until you're back online.
      </span>
    </div>
  );
};

export default OfflineBanner;
