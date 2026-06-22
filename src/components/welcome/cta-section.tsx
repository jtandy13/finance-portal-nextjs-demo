import { WelcomeAuthActions } from "@/components/welcome/welcome-auth-actions";

export function CtaSection() {
  return (
    <section className="bg-heading px-4 py-16 text-white md:px-8 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to elevate your financial strategy?
        </h2>
        <p className="text-base text-on-primary-muted md:text-lg">
          Join WealthPort today and experience the clarity of truly integrated
          wealth management.
        </p>
        <WelcomeAuthActions variant="cta" className="mt-2 w-full justify-center" />
      </div>
    </section>
  );
}
