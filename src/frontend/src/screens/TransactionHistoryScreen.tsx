import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { type Transaction, useWallet } from "../context/WalletContext";

function TxItem({ tx, index }: { tx: Transaction; index: number }) {
  const isOut = tx.type === "sent" || tx.type === "withdrawal";
  const sign = isOut ? "-" : "+";
  const color = isOut ? "text-destructive" : "text-success";
  const formatted = `${sign}$${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const initials = tx.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      data-ocid={`history.transactions.item.${index}`}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
    >
      <div className="w-11 h-11 rounded-full wallet-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {tx.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(tx.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {tx.note ? ` · ${tx.note}` : ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${color}`}>{formatted}</p>
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 ${
            tx.status === "Completed"
              ? "border-success/40 text-success"
              : tx.status === "Pending"
                ? "border-warning/40 text-warning"
                : "border-destructive/40 text-destructive"
          }`}
        >
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}

export default function TransactionHistoryScreen() {
  const { transactions, setScreen } = useWallet();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  const filtered = transactions.filter((tx) => {
    if (filter === "sent")
      return tx.type === "sent" || tx.type === "withdrawal";
    if (filter === "received")
      return tx.type === "received" || tx.type === "deposit";
    return true;
  });

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("dashboard")}
          className="mb-4 p-1"
          data-ocid="history.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold">Transaction History</h1>
        <p className="text-white/75 text-sm mt-1">
          {transactions.length} total transactions
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-6">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <TabsList
            className="w-full mb-5 bg-muted rounded-xl h-11"
            data-ocid="history.filter.tab"
          >
            <TabsTrigger
              value="all"
              className="flex-1 rounded-lg text-sm font-semibold"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex-1 rounded-lg text-sm font-semibold"
            >
              Sent
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="flex-1 rounded-lg text-sm font-semibold"
            >
              Received
            </TabsTrigger>
          </TabsList>

          {(["all", "sent", "received"] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              {filtered.length === 0 ? (
                <div
                  data-ocid="history.empty_state"
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground">
                    No transactions found.
                  </p>
                </div>
              ) : (
                <div
                  className="bg-card rounded-2xl px-4 card-shadow"
                  data-ocid="history.transactions.list"
                >
                  {filtered.map((tx, i) => (
                    <TxItem key={tx.id} tx={tx} index={i + 1} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
