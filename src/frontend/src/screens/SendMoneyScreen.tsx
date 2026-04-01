import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

type Stage = "form" | "processing" | "success";

export default function SendMoneyScreen() {
  const { setScreen, balance, setBalance, addTransaction } = useWallet();
  const [stage, setStage] = useState<Stage>("form");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amt = Number.parseFloat(amount);
    if (!recipient) {
      setError("Please enter a recipient.");
      return;
    }
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amt > balance) {
      setError("Insufficient balance.");
      return;
    }
    setStage("processing");
    await new Promise((r) => setTimeout(r, 1500));
    const newTxId = `TXN${Date.now().toString().slice(-6)}`;
    setTxId(newTxId);
    setBalance(balance - amt);
    addTransaction({
      id: newTxId,
      type: "sent",
      name: recipient,
      email: recipient.includes("@")
        ? recipient
        : `${recipient.toLowerCase()}@paywallet.com`,
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
      note,
    });
    setStage("success");
  }

  function copyTxId() {
    navigator.clipboard.writeText(txId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => {
            setScreen("dashboard");
            setStage("form");
          }}
          className="mb-4 p-1"
          data-ocid="send.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold">Send Money</h1>
        <p className="text-white/75 text-sm mt-1">
          Balance: $
          {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-8">
        {stage === "form" && (
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="send-recipient">
                PayPal ID / Email / Username
              </Label>
              <Input
                id="send-recipient"
                data-ocid="send.input"
                placeholder="email@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  $
                </span>
                <Input
                  id="send-amount"
                  data-ocid="send.input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-xl pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-note">Note / Message (optional)</Label>
              <Textarea
                id="send-note"
                data-ocid="send.textarea"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            {error && (
              <p
                data-ocid="send.error_state"
                className="text-destructive text-sm"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              data-ocid="send.submit_button"
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              Send Money
            </Button>
          </form>
        )}

        {stage === "processing" && (
          <div
            data-ocid="send.loading_state"
            className="flex flex-col items-center justify-center pt-20 fade-in"
          >
            <div className="w-20 h-20 rounded-full wallet-gradient flex items-center justify-center mb-6">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Processing Payment
            </h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we process your payment...
            </p>
          </div>
        )}

        {stage === "success" && (
          <div
            data-ocid="send.success_state"
            className="flex flex-col items-center text-center pt-10 fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle size={44} className="text-success" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-1">
              Payment Sent!
            </h3>
            <p className="text-muted-foreground text-sm mb-1">
              Successfully sent to
            </p>
            <p className="font-semibold text-foreground mb-6">{recipient}</p>
            <div className="w-full bg-muted rounded-2xl p-5 space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-destructive">
                  -${Number.parseFloat(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-success">Completed</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <button
                  type="button"
                  onClick={copyTxId}
                  data-ocid="send.copy.button"
                  className="flex items-center gap-1 font-mono text-xs text-secondary"
                >
                  {txId} <Copy size={12} />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-success text-right">Copied!</p>
              )}
            </div>
            <Button
              onClick={() => {
                setScreen("dashboard");
                setStage("form");
                setRecipient("");
                setAmount("");
                setNote("");
              }}
              data-ocid="send.done.button"
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              Done
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
