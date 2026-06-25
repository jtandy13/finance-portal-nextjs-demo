import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({ getAuthenticatedUser: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/db", () => ({
  db: {
    query: { accounts: { findMany: vi.fn() } },
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

import { db } from "@/db";
import { getAuthenticatedUser } from "@/lib/auth";
import { makeAccount } from "@/test/factories";
import { revalidatePath } from "next/cache";
import { createTransfer } from "./actions";

const getAuthenticatedUserMock = vi.mocked(getAuthenticatedUser);
const revalidatePathMock = vi.mocked(revalidatePath);
const findManyMock = vi.mocked(db.query.accounts.findMany);
const insertMock = vi.mocked(db.insert);
const updateMock = vi.mocked(db.update);

function buildFormData(entries: Record<string, string | undefined>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) {
      formData.set(key, value);
    }
  }
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  getAuthenticatedUserMock.mockResolvedValue({ id: "user-1" } as never);
});

describe("createTransfer", () => {
  it("blocks unauthenticated users", async () => {
    getAuthenticatedUserMock.mockResolvedValue(null as never);

    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "a", toAccountId: "b", amount: "10" }),
    );

    expect(result).toEqual({
      error: "You must be signed in to transfer funds.",
    });
  });

  it("rejects invalid input", async () => {
    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "a", toAccountId: "b" }),
    );
    expect(result).toEqual({ error: "Invalid transfer details." });
  });

  it("rejects transfers to the same account", async () => {
    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "a", toAccountId: "a", amount: "10" }),
    );
    expect(result).toEqual({ error: "Choose two different accounts." });
  });

  it("rejects an invalid amount", async () => {
    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "a", toAccountId: "b", amount: "0" }),
    );
    expect(result).toEqual({ error: "Enter a valid transfer amount." });
  });

  it("rejects accounts the user does not own", async () => {
    findManyMock.mockResolvedValue([] as never);

    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "acc-1", toAccountId: "acc-2", amount: "10" }),
    );

    expect(result).toEqual({
      error: "One or both accounts could not be found.",
    });
  });

  it("rejects transfers exceeding the source balance", async () => {
    findManyMock.mockResolvedValue([
      makeAccount({ id: "acc-1", balance: "20.00" }),
      makeAccount({ id: "acc-2", balance: "0.00" }),
    ] as never);

    const result = await createTransfer(
      {},
      buildFormData({ fromAccountId: "acc-1", toAccountId: "acc-2", amount: "50" }),
    );

    expect(result).toEqual({
      error: "Insufficient funds in the source account.",
    });
  });

  it("completes a valid transfer and updates balances", async () => {
    findManyMock.mockResolvedValue([
      makeAccount({ id: "acc-1", balance: "100.00" }),
      makeAccount({ id: "acc-2", balance: "50.00" }),
    ] as never);

    const valuesMock = vi.fn().mockResolvedValue(undefined);
    insertMock.mockReturnValue({ values: valuesMock } as never);

    const whereMock = vi.fn().mockResolvedValue(undefined);
    const setMock = vi.fn().mockReturnValue({ where: whereMock });
    updateMock.mockReturnValue({ set: setMock } as never);

    const result = await createTransfer(
      {},
      buildFormData({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: "25",
      }),
    );

    expect(result).toEqual({ success: "Transfer completed successfully." });

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        amount: "25.00",
        status: "completed",
      }),
    );

    expect(setMock).toHaveBeenCalledWith({ balance: "75.00" });
    expect(setMock).toHaveBeenCalledTimes(2);
    expect(revalidatePathMock).toHaveBeenCalledWith("/everyday-banking");
  });
});
