import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  image,
  className,
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9", className)}>
      {image ? <AvatarImage src={image} alt={name || "User avatar"} /> : null}
      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
