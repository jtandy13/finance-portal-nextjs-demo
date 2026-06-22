import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function AppHeader() {
  return (
    <header className="fixed top-0 right-0 z-10 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-border bg-background px-8">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search accounts, transactions..."
          className="rounded-full border-border bg-surface-container-low pl-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-muted-foreground transition-colors hover:text-brand"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <UserButton />
      </div>
    </header>
  );
}
