import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { useWallet } from "../context/WalletContext";

const OTP_SLOTS = ["s0", "s1", "s2", "s3", "s4", "s5"];

export default function OTPScreen() {
  const { setScreen, pendingOtpEmail, pendingSignupData, setUser } =
    useWallet();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (pendingSignupData) {
      setUser({
        name: pendingSignupData.name ?? "New User",
        email: pendingSignupData.email ?? pendingOtpEmail,
        phone: pendingSignupData.phone ?? "",
        avatar: (pendingSignupData.name ?? "NU").substring(0, 2).toUpperCase(),
      });
    }
    setScreen("dashboard");
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <div className="wallet-gradient px-6 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("signup")}
          className="mb-4 p-1"
          data-ocid="otp.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} />
          <h1 className="text-2xl font-extrabold">Verify OTP</h1>
        </div>
        <p className="text-white/80 text-sm mt-2">
          We sent a code to {pendingOtpEmail || "your email"}
        </p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-6 pt-10 pb-8">
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Enter the 6-digit verification code
        </p>

        <div className="flex gap-3 justify-center mb-8">
          {OTP_SLOTS.map((slotId, i) => (
            <input
              key={slotId}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              data-ocid="otp.input"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl bg-card focus:border-secondary focus:outline-none transition-colors"
            />
          ))}
        </div>

        {error && (
          <p
            data-ocid="otp.error_state"
            className="text-destructive text-sm text-center mb-4"
          >
            {error}
          </p>
        )}

        <Button
          onClick={handleVerify}
          data-ocid="otp.submit_button"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Didn't receive a code?{" "}
          <button
            type="button"
            className="text-secondary font-semibold hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
