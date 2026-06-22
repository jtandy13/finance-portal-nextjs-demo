"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Landmark,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems: Array<{
  label: string;
  href: string;
  activePath?: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}> = [
  {
    label: "Overview",
    href: "/everyday-banking",
    activePath: "/everyday-banking",
    icon: LayoutDashboard,
  },
  {
    label: "Accounts",
    href: "/everyday-banking",
    activePath: "/accounts",
    icon: Landmark,
  },
  {
    label: "Investing",
    href: "#",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "Transfers",
    href: "/everyday-banking",
    activePath: "/transfers",
    icon: ArrowLeftRight,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
    disabled: true,
  },
] ;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border bg-heading py-6 text-primary-foreground">
      <div className="mb-6 px-8">
        <Link href="/everyday-banking" className="block">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            WealthPort
          </h1>
          <p className="text-xs text-on-primary-muted">Enterprise Wealth</p>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            const isActive =
              !item.disabled &&
              item.activePath !== undefined &&
              pathname === item.activePath;
            const Icon = item.icon;

            return (
              <li key={item.label}>
                {item.disabled ? (
                  <span
                    className="flex cursor-not-allowed items-center rounded-lg px-4 py-3 text-sm font-semibold text-on-primary-muted/70"
                    aria-disabled="true"
                  >
                    <Icon className="mr-3 size-5 shrink-0" />
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-brand-bright text-white"
                        : "text-on-primary-muted hover:bg-primary/80 hover:text-primary-foreground",
                    )}
                  >
                    <Icon className="mr-3 size-5 shrink-0" />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
