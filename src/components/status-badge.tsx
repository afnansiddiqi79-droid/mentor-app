import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusTone } from "@/lib/format";

export function StatusBadge({
  status,
  className,
}: {
  status: string | undefined | null;
  className?: string;
}) {
  const value = status || "unknown";
  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusTone(value), className)}
    >
      {value.replace(/_/g, " ")}
    </Badge>
  );
}
