import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EngineerCard = ({ title, value }) => {
  return (
    <Card className="w-full bg-card border border-border h-52 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription className="text-sm font-medium text-muted-foreground capitalize">
          {title}
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-foreground">
          {value ?? "—"}
        </CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  );
};

export default EngineerCard;
