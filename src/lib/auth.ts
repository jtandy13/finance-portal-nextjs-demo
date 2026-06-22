import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accounts, users } from "@/db/schema";

async function provisionDefaultAccounts(userId: string) {
  await db.insert(accounts).values([
    {
      userId,
      type: "checking",
      name: "Checking",
      accountNumberLast4: "1234",
      balance: "0.00",
    },
    {
      userId,
      type: "savings",
      name: "Savings",
      accountNumberLast4: "5678",
      balance: "0.00",
    },
  ]);
}

export async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    with: {
      accounts: true,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return null;
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      clerkId: userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  await provisionDefaultAccounts(createdUser.id);

  return createdUser;
}
