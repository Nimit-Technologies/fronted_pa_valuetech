import { LifeBuoy } from "lucide-react";
import { getErrorReference } from "@/utils/errorReference";

const DeveloperSupport = () => {
  const reference = getErrorReference();

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LifeBuoy className="text-muted-foreground" size={28} />
          <h1 className="text-2xl font-bold text-foreground">
            Developer support
          </h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Something not working as expected? Send the details below to your
          branch administrator, who will raise it with the development team.
        </p>

        <dl className="space-y-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <dt className="font-medium text-foreground mb-1">
              Session reference
            </dt>
            <dd className="font-mono text-base text-foreground select-all">
              {reference}
            </dd>
            <p className="text-muted-foreground mt-2">
              Quote this when reporting a problem. It identifies this browser
              tab in the server logs and is new on every page load, so report it
              without reloading first.
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <dt className="font-medium text-foreground mb-1">
              What to include
            </dt>
            <dd className="text-muted-foreground">
              The page you were on, what you were trying to do, what happened
              instead, and the session reference above. Never include a
              password, and never send a screenshot that shows a customer's
              Aadhaar number.
            </dd>
          </div>

          <div className="rounded-lg border border-border p-4">
            <dt className="font-medium text-foreground mb-1">Mail us</dt>
            <dd className="text-muted-foreground">
              <a
                href="mailto:info@nimittech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                info@nimittech.com
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DeveloperSupport;
