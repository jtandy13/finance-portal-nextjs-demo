"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WelcomeAuthActionsProps = {
  className?: string;
  variant?: "header" | "cta";
};

export function WelcomeAuthActions({
  className,
  variant = "header",
}: WelcomeAuthActionsProps) {
  if (variant === "cta") {
    return (
      <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="h-auto rounded-lg bg-brand-bright px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-bright/90"
            >
              Create Account
            </Button>
          </SignUpButton>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-auto rounded-lg border-border bg-transparent px-8 py-3 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <a href="mailto:sales@wealthport.com">Contact Sales</a>
          </Button>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="text-xs font-medium tracking-wide text-brand uppercase hover:text-brand-bright"
          >
            Log In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="rounded-lg px-4 py-2 text-xs font-medium tracking-wide uppercase">
            Get Started
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
