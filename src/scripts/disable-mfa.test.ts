import { describe, it, expect, vi } from "vitest";

import { disableDemoUserMfa } from "./disable-mfa";

type MockClient = {
  users: {
    getUserList: ReturnType<typeof vi.fn>;
    disableUserMFA: ReturnType<typeof vi.fn>;
  };
};

function createMockClient(overrides?: Partial<MockClient["users"]>): MockClient {
  return {
    users: {
      getUserList: vi.fn().mockResolvedValue({ data: [] }),
      disableUserMFA: vi.fn().mockResolvedValue({ id: "user_123" }),
      ...overrides,
    },
  };
}

describe("disableDemoUserMfa", () => {
  it("disables MFA using an explicit user ID without looking it up", async () => {
    const client = createMockClient();

    const userId = await disableDemoUserMfa(client as never, {
      explicitId: "user_explicit",
    });

    expect(userId).toBe("user_explicit");
    expect(client.users.getUserList).not.toHaveBeenCalled();
    expect(client.users.disableUserMFA).toHaveBeenCalledWith("user_explicit");
  });

  it("resolves the demo user by email when no ID is provided", async () => {
    const client = createMockClient({
      getUserList: vi.fn().mockResolvedValue({ data: [{ id: "user_byemail" }] }),
    });

    const userId = await disableDemoUserMfa(client as never, {
      email: "demo@wealthport.com",
    });

    expect(client.users.getUserList).toHaveBeenCalledWith({
      emailAddress: ["demo@wealthport.com"],
    });
    expect(userId).toBe("user_byemail");
    expect(client.users.disableUserMFA).toHaveBeenCalledWith("user_byemail");
  });

  it("throws when no user matches the email", async () => {
    const client = createMockClient();

    await expect(
      disableDemoUserMfa(client as never, { email: "missing@wealthport.com" }),
    ).rejects.toThrow('No Clerk user found for email "missing@wealthport.com".');
    expect(client.users.disableUserMFA).not.toHaveBeenCalled();
  });
});
