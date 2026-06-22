import { BarChart3, BadgeCheck, Shield } from "lucide-react";

const trustItems = [
  { label: "Bank-Level Security", icon: Shield },
  { label: "FDIC Insured", icon: BadgeCheck },
  { label: "Professional Grade", icon: BarChart3 },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 text-center md:px-8 md:py-16 lg:py-24">
      <h2 className="mb-8 text-xl font-semibold text-heading">
        Trusted by Institutions. Built for You.
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 md:gap-16">
        {trustItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <item.icon className="size-8" aria-hidden />
            <span className="text-base font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
