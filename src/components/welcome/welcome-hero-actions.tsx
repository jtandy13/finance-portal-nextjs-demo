"use client";

import { SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function WelcomeHeroActions() {
  return (
    <div className="flex flex-col gap-4 pt-2 sm:flex-row">
      <SignUpButton mode="modal">
        <Button
          size="lg"
          className="h-auto rounded-lg px-8 py-3 text-base font-semibold"
        >
          Get Started
        </Button>
      </SignUpButton>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-auto rounded-lg border-border px-8 py-3 text-base font-semibold text-heading hover:bg-surface-container-low"
      >
        <a href="#solutions">View Solutions</a>
      </Button>
    </div>
  );
}
