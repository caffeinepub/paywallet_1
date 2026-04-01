import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function SignUpScreen() {
  const { setScreen, setPendingOtpEmail, setPendingSignupData } = useWallet();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setPendingSignupData({ name, email, phone, password });
    setPendingOtpEmail(email);
    setScreen("otp");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="wallet-gradient px-6 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("login")}
          className="mb-4 p-1"
          data-ocid="signup.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-extrabold">Create Account</h1>
        <p className="text-white/80 text-sm mt-1">
          Join millions of users worldwide
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-6 pt-8 pb-8 space-y-5">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              data-ocid="signup.input"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email Address</Label>
            <Input
              id="signup-email"
              data-ocid="signup.input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-phone">Phone Number</Label>
            <Input
              id="signup-phone"
              data-ocid="signup.input"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                data-ocid="signup.input"
                type={showPw ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl pr-10"
                autoComplete="new-password"
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
              data-ocid="signup.error_state"
              className="text-destructive text-sm"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            data-ocid="signup.submit_button"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0 mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setScreen("login")}
            className="text-secondary font-semibold hover:underline"
            data-ocid="signup.login.link"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
