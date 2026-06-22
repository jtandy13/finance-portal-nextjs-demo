import { ArrowRight, Landmark, TrendingUp } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Unified Banking",
    description:
      "High-yield checking and savings accounts integrated directly with your investment platform. Enjoy instant transfers and holistic financial visibility without the friction of multiple institutions.",
    href: "/everyday-banking",
    linkLabel: "Explore Banking",
    icon: Landmark,
    className: "md:col-span-5",
  },
  {
    title: "Advanced Investing",
    description:
      "Institutional-grade portfolio tracking, real-time market analysis, and automated rebalancing. Execute complex strategies with confidence using our state-of-the-art trading interface.",
    href: "#investing",
    linkLabel: "View Capabilities",
    icon: TrendingUp,
    className: "md:col-span-7",
    decorative: true,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="solutions"
      className="bg-surface-container-low py-12 md:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-2 text-3xl font-semibold tracking-tight text-heading">
            Comprehensive Wealth Solutions
          </h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
            Seamlessly manage your everyday banking needs alongside advanced
            portfolio strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-background p-8 transition-colors hover:border-brand ${feature.className}`}
            >
              <div className="mb-1 flex size-12 items-center justify-center rounded-lg bg-surface-container text-brand transition-colors group-hover:bg-brand-bright group-hover:text-white">
                <feature.icon className="size-6" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-heading">
                {feature.title}
              </h3>
              <p className="flex-grow text-sm leading-5 text-muted-foreground">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium tracking-wide text-brand uppercase group-hover:underline"
              >
                {feature.linkLabel}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              {feature.decorative ? (
                <div
                  className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-1/3 opacity-10 md:block"
                  aria-hidden
                >
                  <svg
                    className="h-full w-full fill-brand text-brand"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" />
                  </svg>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
