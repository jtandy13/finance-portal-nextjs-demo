import { ArrowDown, ArrowUp, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

type MarketMoverRow = {
  id: string;
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
};

type MarketMoversProps = {
  movers: MarketMoverRow[];
};

function getInitials(symbol: string) {
  return symbol.slice(0, 2).toUpperCase();
}

export function MarketMovers({ movers }: MarketMoversProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-surface-container-low px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Market Movers</h2>
        <Button variant="ghost" size="sm" className="text-brand">
          View All
        </Button>
      </div>

      {movers.length === 0 ? (
        <div className="px-6 py-10 text-sm text-muted-foreground">
          No market data yet. Run the database seed to load demo data.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Security
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Price
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Change
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movers.map((mover) => {
              const changePercent = Number.parseFloat(mover.changePercent);
              const isPositive = changePercent >= 0;
              const isLargeMove = Math.abs(changePercent) >= 2;

              return (
                <TableRow
                  key={mover.id}
                  className="border-border/50 hover:bg-surface-container-low/50"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-xs font-semibold text-brand">
                        {getInitials(mover.symbol)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {mover.symbol}
                        </p>
                        <p className="text-sm text-muted-foreground">{mover.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(mover.price)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
                        isPositive ? "text-emerald-600" : "text-destructive",
                      )}
                    >
                      {isLargeMove ? (
                        <Rocket className="size-4" />
                      ) : isPositive ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      )}
                      {formatPercent(changePercent)}
                    </span>
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
