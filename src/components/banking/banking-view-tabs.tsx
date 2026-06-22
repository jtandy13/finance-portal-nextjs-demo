import Link from "next/link";

import { cn } from "@/lib/utils";

const tabs: Array<{
  label: string;
  href: string;
  active: boolean;
  disabled?: boolean;
}> = [
  { label: "Everyday Banking", href: "/everyday-banking", active: true },
  { label: "Wealth Management", href: "#", active: false, disabled: true },
] ;

export function BankingViewTabs() {
  return (
    <div className="flex gap-6 border-b border-border px-8">
      {tabs.map((tab) =>
        tab.disabled ? (
          <span
            key={tab.label}
            className="cursor-not-allowed py-6 text-base font-semibold text-muted-foreground/60"
            aria-disabled="true"
          >
            {tab.label}
          </span>
        ) : (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "border-b-2 py-6 text-base font-semibold transition-colors",
              tab.active
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ),
      )}
    </div>
  );
}
