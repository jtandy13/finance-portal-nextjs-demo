import "dotenv/config";

import { createClerkClient, type ClerkClient } from "@clerk/backend";

const DEFAULT_DEMO_EMAIL = "demo@wealthport.com";

/**
 * Resolves the Clerk user ID for the demo user. Prefers an explicit ID
 * (CLI arg or CLERK_USER_ID) and otherwise looks the user up by email so the
 * script keeps working even when the demo user is re-provisioned with a new ID.
 */
async function resolveDemoUserId(
  client: ClerkClient,
  { explicitId, email }: { explicitId?: string; email: string },
): Promise<string> {
  if (explicitId) {
    return explicitId;
  }

  const { data: users } = await client.users.getUserList({
    emailAddress: [email],
  });

  const user = users[0];
  if (!user) {
    throw new Error(`No Clerk user found for email "${email}".`);
  }

  return user.id;
}

export async function disableDemoUserMfa(
  client: ClerkClient,
  options: { explicitId?: string; email?: string } = {},
): Promise<string> {
  const userId = await resolveDemoUserId(client, {
    explicitId: options.explicitId,
    email: options.email ?? DEFAULT_DEMO_EMAIL,
  });

  await client.users.disableUserMFA(userId);

  return userId;
}

async function main() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }

  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const userId = await disableDemoUserMfa(client, {
    explicitId: process.argv[2] ?? process.env.CLERK_USER_ID,
    email: process.env.SEED_USER_EMAIL,
  });

  console.log(`Disabled all MFA methods for Clerk user: ${userId}`);
}

if (process.argv[1]?.includes("disable-mfa")) {
  main().catch((error) => {
    console.error("Failed to disable MFA:", error);
    process.exit(1);
  });
}
