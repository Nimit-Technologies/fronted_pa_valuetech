import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// `value` of null/undefined renders as "—" (unknown); pass `loading` to show
// a placeholder while the number is still on its way.
const SuperAdminCard = ({ title, value, loading = false }) => {
  return (
    <Card className="w-full bg-card border border-border h-52 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription className="text-sm font-medium text-muted-foreground capitalize">
          {title}
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-foreground">
          {loading ? (
            <span
              aria-label="Loading"
              className="inline-block h-8 w-16 animate-pulse rounded bg-muted align-middle"
            />
          ) : (
            (value ?? "—")
          )}
        </CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  );
};

export default SuperAdminCard;
