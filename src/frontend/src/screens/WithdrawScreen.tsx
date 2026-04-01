import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

const DESTINATIONS = [
  {
    id: "bank",
    icon: Building2,
    label: "Bank Account",
    detail: "Chase Bank •9012",
  },
  {
    id: "card",
    icon: CreditCard,
    label: "Linked Card",
    detail: "Visa Debit •4521",
  },
];

type Stage = "form" | "pending" | "completed";

export default function WithdrawScreen() {
  const { setScreen, balance, setBalance, addTransaction } = useWallet();
  const [stage, setStage] = useState<Stage>("form");
  const [destination, setDestination] = useState("bank");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amt > balance) {
      setError("Insufficient balance.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const dest = DESTINATIONS.find((d) => d.id === destination)!;
    setBalance(balance - amt);
    addTransaction({
      id: `TXN${Date.now().toString().slice(-6)}`,
      type: "withdrawal",
      name: dest.label,
      email: "bank",
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
    setStage("pending");
    // After 2s -> completed
    setTimeout(() => setStage("completed"), 2000);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("dashboard")}
          className="mb-4 p-1"
          data-ocid="withdraw.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold">Withdraw Money</h1>
        <p className="text-white/75 text-sm mt-1">
          Available: $
          {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-8">
        {stage === "form" && (
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Withdraw To
              </Label>
              <div className="space-y-3">
                {DESTINATIONS.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      data-ocid={`withdraw.${d.id}.button`}
                      onClick={() => setDestination(d.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        destination === d.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-muted-foreground/40"
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-foreground">
                          {d.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.detail}
                        </p>
                      </div>
                      {destination === d.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  $
                </span>
                <Input
                  id="withdraw-amount"
                  data-ocid="withdraw.input"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-xl pl-7"
                />
              </div>
            </div>

            {error && (
              <p
                data-ocid="withdraw.error_state"
                className="text-destructive text-sm"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="withdraw.submit_button"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              {loading ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </form>
        )}

        {stage === "pending" && (
          <div
            data-ocid="withdraw.loading_state"
            className="flex flex-col items-center text-center pt-16 fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mb-6">
              <Clock size={44} className="text-warning" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-2">
              Pending
            </h3>
            <p className="text-muted-foreground text-sm">
              Your withdrawal is being processed...
            </p>
          </div>
        )}

        {stage === "completed" && (
          <div
            data-ocid="withdraw.success_state"
            className="flex flex-col items-center text-center pt-10 fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle size={44} className="text-success" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-2">
              Completed!
            </h3>
            <p className="text-muted-foreground text-sm mb-2">Withdrawal of</p>
            <p className="text-3xl font-extrabold text-destructive mb-2">
              -${Number.parseFloat(amount || "0").toFixed(2)}
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              to {DESTINATIONS.find((d) => d.id === destination)?.label}
            </p>
            <Button
              onClick={() => {
                setScreen("dashboard");
                setStage("form");
                setAmount("");
              }}
              data-ocid="withdraw.done.button"
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
