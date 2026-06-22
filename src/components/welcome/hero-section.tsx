import Image from "next/image";

import { WelcomeHeroActions } from "@/components/welcome/welcome-hero-actions";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1xvwrZg5TCBHgEC_8eMzE-mbKlRMWDFnWOeKlxIta6YUa4Yh1yND_vVegCaBnT-O-URJ9USQA4-0ANIt0bbFupLO_GRpZOdpjtP52YltXKFo-s5LgD5juPW_U0CN0npKtm58UuP9HJHTfCnA-bYRfZt_eNs2rhcM2dlDfVvTVO-dv5U2E4zJR2Xsl-R3cIpmqOcEgYvIs21yuvGJg-57t9jVNUY7HQvH2Cm5QqcwpAiTSZMITxUlwH_m1oRzRks2wJHC7UNPXHmLP";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-4 py-12 md:flex-row md:px-8 md:py-16 lg:py-24">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-heading md:text-[36px] md:leading-[44px]">
          The Future of Wealth,
          <br />
          Managed for Today.
        </h1>
        <p className="max-w-2xl text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
          Experience enterprise-grade banking and sophisticated investment
          solutions in one unified platform. Designed for high-net-worth
          individuals who demand clarity, security, and performance.
        </p>
        <WelcomeHeroActions />
      </div>

      <div className="relative h-[400px] w-full flex-1 overflow-hidden rounded-xl border border-border shadow-sm md:h-[500px]">
        <Image
          src={HERO_IMAGE}
          alt="Modern financial dashboard displayed on a sleek monitor in a minimalist executive office"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/20 to-transparent" />
      </div>
    </section>
  );
}
