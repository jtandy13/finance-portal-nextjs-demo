import Link from "next/link";

import { WelcomeAuthActions } from "@/components/welcome/welcome-auth-actions";

const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Company", href: "#company" },
  { label: "Resources", href: "#resources" },
];

export function WelcomeHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 transition-all md:px-8">
      <Link href="/" className="text-2xl font-semibold text-heading">
        WealthPort
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <WelcomeAuthActions />
    </header>
  );
}
