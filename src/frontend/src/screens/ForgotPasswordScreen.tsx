import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function ForgotPasswordScreen() {
  const { setScreen } = useWallet();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="wallet-gradient px-6 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("login")}
          className="mb-4 p-1"
          data-ocid="forgot.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold">Reset Password</h1>
        <p className="text-white/80 text-sm mt-1">
          We'll send you a reset link
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-6 pt-10 pb-8">
        {sent ? (
          <div
            data-ocid="forgot.success_state"
            className="flex flex-col items-center text-center pt-10 fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Reset Link Sent!
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              We've sent a password reset link to <strong>{email}</strong>.
              Check your inbox.
            </p>
            <Button
              onClick={() => setScreen("login")}
              data-ocid="forgot.back_to_login.button"
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <p className="text-muted-foreground text-sm">
              Enter the email address associated with your account.
            </p>
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  id="forgot-email"
                  data-ocid="forgot.input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  autoComplete="email"
                />
              </div>
            </div>
            <Button
              type="submit"
              data-ocid="forgot.submit_button"
              disabled={loading || !email}
              className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
