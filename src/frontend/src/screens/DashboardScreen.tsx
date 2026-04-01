import { Badge } from "@/components/ui/badge";
import {
  ArrowDownCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  PlusCircle,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

const QUICK_ACTIONS = [
  {
    icon: ArrowUpRight,
    label: "Send",
    screen: "send-money" as const,
    color: "text-secondary",
  },
  {
    icon: ArrowDownLeft,
    label: "Request",
    screen: "notifications" as const,
    color: "text-success",
  },
  {
    icon: PlusCircle,
    label: "Add Money",
    screen: "add-money" as const,
    color: "text-warning",
  },
  {
    icon: ArrowDownCircle,
    label: "Withdraw",
    screen: "withdraw" as const,
    color: "text-destructive",
  },
];

function formatAmount(amount: number, type: string) {
  const sign = type === "sent" || type === "withdrawal" ? "-" : "+";
  const color =
    type === "sent" || type === "withdrawal"
      ? "text-destructive"
      : "text-success";
  return {
    sign,
    color,
    formatted: `${sign}$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
}

export default function DashboardScreen() {
  const { user, balance, transactions, unreadCount, setScreen } = useWallet();
  const recent = transactions.slice(0, 5);

  return (
    <div className="min-h-dvh bg-background pb-24 fade-in">
      {/* Header */}
      <div className="wallet-gradient px-5 pt-14 pb-16 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Good morning,</p>
            <h1 className="text-xl font-bold">{user?.name ?? "User"}</h1>
          </div>
          <button
            type="button"
            data-ocid="dashboard.notifications.button"
            onClick={() => setScreen("notifications")}
            className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <p className="text-white/70 text-xs uppercase tracking-widest mb-2">
            Total Balance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </span>
            <span className="text-white/70 text-sm">USD</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-white/70">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="-mt-8 px-4 space-y-5">
        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-4 card-shadow grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                type="button"
                key={action.screen}
                data-ocid={`dashboard.${action.label.toLowerCase().replace(" ", "_")}.button`}
                onClick={() => setScreen(action.screen)}
                className="flex flex-col items-center gap-2 py-3 px-1 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center">
                  <Icon size={20} className={action.color} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-2xl p-4 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base text-foreground">
              Recent Transactions
            </h2>
            <button
              type="button"
              data-ocid="dashboard.history.link"
              onClick={() => setScreen("history")}
              className="text-xs text-secondary font-semibold"
            >
              See all
            </button>
          </div>

          <div className="space-y-1" data-ocid="dashboard.transactions.list">
            {recent.map((tx, i) => {
              const { formatted, color } = formatAmount(tx.amount, tx.type);
              const initials = tx.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              return (
                <div
                  key={tx.id}
                  data-ocid={`dashboard.transactions.item.${i + 1}`}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <div className="w-10 h-10 rounded-full wallet-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                      })}
                    </p>
                  </div>
                  <div className="text-right">
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
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
