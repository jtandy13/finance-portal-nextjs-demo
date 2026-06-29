"use client";

import { useState } from "react";

import { QuickTransferForm } from "@/components/banking/quick-transfer-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AccountOption = {
  id: string;
  name: string;
  accountNumberLast4: string;
  balance: string;
};

type TransferFundsDialogProps = {
  accounts: AccountOption[];
};

export function TransferFundsDialog({ accounts }: TransferFundsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Transfer Funds</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move money between your accounts instantly.
          </DialogDescription>
        </DialogHeader>
        <QuickTransferForm
          accounts={accounts}
          variant="embedded"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
