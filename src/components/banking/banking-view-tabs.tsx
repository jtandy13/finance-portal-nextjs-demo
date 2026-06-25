"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "Everyday Banking", href: "/everyday-banking" },
  { label: "Wealth Management", href: "/wealth-management" },
] as const;

export function BankingViewTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 border-b border-border px-8">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "border-b-2 py-6 text-base font-semibold transition-colors",
              isActive
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
