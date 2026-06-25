"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accounts, transfers } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { validateTransferInput } from "@/lib/banking/transfer-schema";

export type TransferActionState = {
  error?: string;
  success?: string;
};

export async function createTransfer(
  _prevState: TransferActionState,
  formData: FormData,
): Promise<TransferActionState> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { error: "You must be signed in to transfer funds." };
  }

  const validation = validateTransferInput(formData);
  if (!validation.success) {
    return { error: validation.error };
  }

  const { fromAccountId, toAccountId, amount } = validation.data;

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, user.id),
  });

  const fromAccount = userAccounts.find((account) => account.id === fromAccountId);
  const toAccount = userAccounts.find((account) => account.id === toAccountId);

  if (!fromAccount || !toAccount) {
    return { error: "One or both accounts could not be found." };
  }

  const fromBalance = Number.parseFloat(fromAccount.balance);
  if (amount > fromBalance) {
    return { error: "Insufficient funds in the source account." };
  }

  const toBalance = Number.parseFloat(toAccount.balance);
  const formattedAmount = amount.toFixed(2);

  await db.insert(transfers).values({
    userId: user.id,
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    amount: formattedAmount,
    status: "completed",
  });

  await db
    .update(accounts)
    .set({ balance: (fromBalance - amount).toFixed(2) })
    .where(eq(accounts.id, fromAccount.id));

  await db
    .update(accounts)
    .set({ balance: (toBalance + amount).toFixed(2) })
    .where(eq(accounts.id, toAccount.id));

  revalidatePath("/everyday-banking");

  return { success: "Transfer completed successfully." };
}
