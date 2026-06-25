import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const usePathnameMock = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

import { AppSidebar } from "./app-sidebar";

describe("AppSidebar", () => {
  it("highlights the active nav item based on the current path", () => {
    usePathnameMock.mockReturnValue("/wealth-management");
    render(<AppSidebar />);

    const investing = screen.getByRole("link", { name: /investing/i });
    expect(investing).toHaveClass("bg-brand-bright");
  });

  it("does not highlight inactive nav items", () => {
    usePathnameMock.mockReturnValue("/everyday-banking");
    render(<AppSidebar />);

    const investing = screen.getByRole("link", { name: /investing/i });
    expect(investing).not.toHaveClass("bg-brand-bright");
  });

  it("renders disabled items as non-interactive", () => {
    usePathnameMock.mockReturnValue("/everyday-banking");
    render(<AppSidebar />);

    const settings = screen.getByText("Settings");
    expect(settings.closest('[aria-disabled="true"]')).not.toBeNull();
  });
});
