import { cn } from "@/lib/utils";

type MaterialSymbolProps = {
  name: string;
  className?: string;
};

export function MaterialSymbol({ name, className }: MaterialSymbolProps) {
  return (
    <span
      aria-hidden
      className={cn("material-symbols-outlined leading-none", className)}
    >
      {name}
    </span>
  );
}
