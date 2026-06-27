import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Statements", icon: "receipt_long" },
  { label: "Open Account", icon: "add_card" },
] as const;

export function AccountsQuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            disabled
            className={cn(
              "group flex flex-col items-center justify-center gap-2 rounded-lg border border-border",
              "bg-surface-container-low p-4 transition-colors",
              "hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            <MaterialSymbol
              name={icon}
              className="text-[24px] text-brand transition-transform group-hover:scale-110 group-disabled:scale-100"
            />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
