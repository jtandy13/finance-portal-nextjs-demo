import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CtaSection } from "@/components/welcome/cta-section";
import { FeaturesSection } from "@/components/welcome/features-section";
import { HeroSection } from "@/components/welcome/hero-section";
import { TrustSection } from "@/components/welcome/trust-section";
import { WelcomeFooter } from "@/components/welcome/welcome-footer";
import { WelcomeHeader } from "@/components/welcome/welcome-header";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/everyday-banking");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WelcomeHeader />
      <main className="flex-grow pt-16 md:pt-20">
        <HeroSection />
        <FeaturesSection />
        <TrustSection />
        <CtaSection />
      </main>
      <WelcomeFooter />
    </div>
  );
}
