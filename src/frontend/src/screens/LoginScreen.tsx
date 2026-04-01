import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function LoginScreen() {
  const { setScreen, setUser } = useWallet();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // Simulate auth
    setUser({
      name: "Alex Johnson",
      email,
      phone: "+1 (555) 234-5678",
      avatar: "AJ",
    });
    setScreen("dashboard");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header gradient */}
      <div className="wallet-gradient px-6 pt-16 pb-12 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-extrabold text-lg">P</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            PayWallet
          </span>
        </div>
        <p className="text-white/80 text-sm mt-3">
          The safer, easier way to pay
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-6 pt-8 pb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Log in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email address</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                id="login-email"
                data-ocid="login.input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-xl"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                id="login-password"
                data-ocid="login.input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              data-ocid="login.error_state"
              className="text-destructive text-sm"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => setScreen("forgot-password")}
            className="text-sm text-secondary hover:underline font-medium"
            data-ocid="login.forgot_password.link"
          >
            Forgot Password?
          </button>

          <Button
            type="submit"
            data-ocid="login.submit_button"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold text-base wallet-gradient text-white border-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm">
            Don't have an account?{" "}
          </span>
          <button
            type="button"
            onClick={() => setScreen("signup")}
            className="text-sm text-secondary font-semibold hover:underline"
            data-ocid="login.signup.link"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
