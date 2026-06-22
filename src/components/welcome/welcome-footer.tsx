import Link from "next/link";

const footerLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Security", href: "#security" },
];

export function WelcomeFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-dim px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WealthPort. All rights reserved.
        </span>
        <div className="flex gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-heading"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
