import { describe, it, expect } from "vitest";

import { validateTransferInput } from "./transfer-schema";

function buildFormData(
  entries: Record<string, string | undefined>,
): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) {
      formData.set(key, value);
    }
  }
  return formData;
}

describe("validateTransferInput", () => {
  it("returns invalid details when a field is missing", () => {
    const result = validateTransferInput(
      buildFormData({ fromAccountId: "a", toAccountId: "b" }),
    );
    expect(result).toEqual({ success: false, error: "Invalid transfer details." });
  });

  it("rejects when both accounts are the same", () => {
    const result = validateTransferInput(
      buildFormData({ fromAccountId: "a", toAccountId: "a", amount: "10" }),
    );
    expect(result).toEqual({
      success: false,
      error: "Choose two different accounts.",
    });
  });

  it("rejects a non-numeric amount", () => {
    const result = validateTransferInput(
      buildFormData({ fromAccountId: "a", toAccountId: "b", amount: "abc" }),
    );
    expect(result).toEqual({
      success: false,
      error: "Enter a valid transfer amount.",
    });
  });

  it("rejects a zero or negative amount", () => {
    expect(
      validateTransferInput(
        buildFormData({ fromAccountId: "a", toAccountId: "b", amount: "0" }),
      ),
    ).toEqual({ success: false, error: "Enter a valid transfer amount." });

    expect(
      validateTransferInput(
        buildFormData({ fromAccountId: "a", toAccountId: "b", amount: "-5" }),
      ),
    ).toEqual({ success: false, error: "Enter a valid transfer amount." });
  });

  it("parses a valid transfer into typed data", () => {
    const result = validateTransferInput(
      buildFormData({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: "125.50",
      }),
    );
    expect(result).toEqual({
      success: true,
      data: { fromAccountId: "acc-1", toAccountId: "acc-2", amount: 125.5 },
    });
  });
});
