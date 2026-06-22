import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate, formatSignedCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type TransactionRow = {
  id: string;
  postedAt: string;
  description: string;
  amount: string;
  category: {
    name: string;
  };
};

type RecentTransactionsProps = {
  transactions: TransactionRow[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-surface-container-low px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="px-6 py-10 text-sm text-muted-foreground">
          No transactions yet. Run the database seed to load demo data.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Description
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Category
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const amount = Number.parseFloat(transaction.amount);

              return (
                <TableRow
                  key={transaction.id}
                  className="border-border/50 hover:bg-surface-container-low/50"
                >
                  <TableCell className="px-6 py-4 text-sm">
                    {formatShortDate(transaction.postedAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {transaction.category.name}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "px-6 py-4 text-right text-sm font-medium tabular-nums",
                      amount > 0 ? "text-emerald-600" : "text-foreground",
                    )}
                  >
                    {formatSignedCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
