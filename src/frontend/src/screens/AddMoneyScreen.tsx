import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

const METHODS = [
  {
    id: "debit",
    icon: CreditCard,
    label: "Debit Card",
    detail: "Visa •4521",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "credit",
    icon: CreditCard,
    label: "Credit Card",
    detail: "Mastercard •8834",
    color: "bg-warning/10 text-warning",
  },
  {
    id: "bank",
    icon: Building2,
    label: "Bank Transfer",
    detail: "Chase Bank",
    color: "bg-success/10 text-success",
  },
];

type Stage = "form" | "success";

export default function AddMoneyScreen() {
  const { setScreen, balance, setBalance, addTransaction } = useWallet();
  const [stage, setStage] = useState<Stage>("form");
  const [selectedMethod, setSelectedMethod] = useState("debit");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    const method = METHODS.find((m) => m.id === selectedMethod)!;
    setBalance(balance + amt);
    addTransaction({
      id: `TXN${Date.now().toString().slice(-6)}`,
      type: "deposit",
      name: method.label,
      email: "card",
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
    });
    setStage("success");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("dashboard")}
          className="mb-4 p-1"
          data-ocid="addmoney.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3">
          <Wallet size={24} />
          <h1 className="text-2xl font-extrabold">Add Money</h1>
        </div>
        <p className="text-white/75 text-sm mt-1">
          Current balance: $
          {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-8">
        {stage === "form" ? (
          <form onSubmit={handleAdd} className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Select Payment Method
              </Label>
              <div className="space-y-3">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-ocid={`addmoney.${m.id}.button`}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        selectedMethod === m.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-muted-foreground/40"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${m.color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-foreground">
                          {m.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {m.detail}
                        </p>
                      </div>
                      {selectedMethod === m.id && (
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
              <Label htmlFor="add-amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  $
                </span>
                <Input
                  id="add-amount"
                  data-ocid="addmoney.input"
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
                data-ocid="addmoney.error_state"
                className="text-destructive text-sm"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="addmoney.submit_button"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              {loading ? "Processing..." : "Add Funds"}
            </Button>
          </form>
        ) : (
          <div
            data-ocid="addmoney.success_state"
            className="flex flex-col items-center text-center pt-10 fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle size={44} className="text-success" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-2">
              Funds Added!
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              Successfully added
            </p>
            <p className="text-3xl font-extrabold text-success mb-6">
              ${Number.parseFloat(amount).toFixed(2)}
            </p>
            <div className="w-full bg-muted rounded-2xl p-4 space-y-2 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-semibold">
                  {METHODS.find((m) => m.id === selectedMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Balance</span>
                <span className="font-bold text-foreground">
                  $
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => {
                setScreen("dashboard");
                setStage("form");
                setAmount("");
              }}
              data-ocid="addmoney.done.button"
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
