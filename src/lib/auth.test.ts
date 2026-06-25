import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));
vi.mock("@/db", () => ({
  db: {
    query: { users: { findFirst: vi.fn() } },
    insert: vi.fn(),
  },
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { makeAccount } from "@/test/factories";
import { getAuthenticatedUser } from "./auth";

const authMock = vi.mocked(auth);
const currentUserMock = vi.mocked(currentUser);
const findFirstMock = vi.mocked(db.query.users.findFirst);
const insertMock = vi.mocked(db.insert);

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ userId: "clerk-1" } as never);
});

describe("getAuthenticatedUser", () => {
  it("returns null when there is no Clerk session", async () => {
    authMock.mockResolvedValue({ userId: null } as never);

    expect(await getAuthenticatedUser()).toBeNull();
    expect(findFirstMock).not.toHaveBeenCalled();
  });

  it("returns the existing user with accounts", async () => {
    const existingUser = {
      id: "user-1",
      clerkId: "clerk-1",
      email: "demo@wealthport.com",
      accounts: [makeAccount({ id: "acc-1" })],
    };
    findFirstMock.mockResolvedValue(existingUser as never);

    const result = await getAuthenticatedUser();

    expect(result).toBe(existingUser);
    expect(currentUserMock).not.toHaveBeenCalled();
  });

  it("provisions a new user with default accounts on first sign-in", async () => {
    const createdUser = {
      id: "user-2",
      clerkId: "clerk-1",
      email: "new@wealthport.com",
    };
    const provisionedUser = {
      ...createdUser,
      accounts: [
        makeAccount({ id: "acc-c", type: "checking" }),
        makeAccount({ id: "acc-s", type: "savings" }),
      ],
    };

    findFirstMock
      .mockResolvedValueOnce(undefined as never)
      .mockResolvedValueOnce(provisionedUser as never);

    currentUserMock.mockResolvedValue({
      firstName: "New",
      lastName: "User",
      emailAddresses: [{ emailAddress: "new@wealthport.com" }],
    } as never);

    const returningMock = vi.fn().mockResolvedValue([createdUser]);
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
    insertMock.mockReturnValue({ values: valuesMock } as never);

    const result = await getAuthenticatedUser();

    expect(result).toBe(provisionedUser);
    expect(result?.accounts).toHaveLength(2);
    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(findFirstMock).toHaveBeenCalledTimes(2);
  });

  it("returns null when Clerk has no profile for the session", async () => {
    findFirstMock.mockResolvedValue(undefined as never);
    currentUserMock.mockResolvedValue(null as never);

    expect(await getAuthenticatedUser()).toBeNull();
  });

  it("returns null when the Clerk profile has no email", async () => {
    findFirstMock.mockResolvedValue(undefined as never);
    currentUserMock.mockResolvedValue({
      firstName: "No",
      lastName: "Email",
      emailAddresses: [],
    } as never);

    expect(await getAuthenticatedUser()).toBeNull();
  });
});
