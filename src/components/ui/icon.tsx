import { cn } from "@/lib/utils";

export function Icon({
  name,
  className,
  ...otherProps
}: React.HTMLAttributes<HTMLElement> & { name: "search" | "user" | string }) {
  return (
    <i
      className={cn(`fi fi-rr-${name} translate-y-0.5`, className)}
      {...otherProps}
    />
  );
}
