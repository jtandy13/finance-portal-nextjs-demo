import { z } from "zod";

export type TransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
};

export type TransferValidationResult =
  | { success: true; data: TransferInput }
  | { success: false; error: string };

const transferFieldsSchema = z.object({
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amount: z.string(),
});

export function validateTransferInput(
  formData: FormData,
): TransferValidationResult {
  const parsed = transferFieldsSchema.safeParse({
    fromAccountId: formData.get("fromAccountId"),
    toAccountId: formData.get("toAccountId"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid transfer details." };
  }

  const { fromAccountId, toAccountId, amount: amountRaw } = parsed.data;

  if (fromAccountId === toAccountId) {
    return { success: false, error: "Choose two different accounts." };
  }

  const amount = Number.parseFloat(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Enter a valid transfer amount." };
  }

  return { success: true, data: { fromAccountId, toAccountId, amount } };
}
