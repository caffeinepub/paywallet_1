import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowLeft,
  Fingerprint,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

const PIN_KEYS = [
  { id: "k1", value: "1" },
  { id: "k2", value: "2" },
  { id: "k3", value: "3" },
  { id: "k4", value: "4" },
  { id: "k5", value: "5" },
  { id: "k6", value: "6" },
  { id: "k7", value: "7" },
  { id: "k8", value: "8" },
  { id: "k9", value: "9" },
  { id: "kempty", value: "" },
  { id: "k0", value: "0" },
  { id: "kdel", value: "⌫" },
];

const PIN_SLOTS = ["slot0", "slot1", "slot2", "slot3"];

export default function SecurityScreen() {
  const {
    setScreen,
    twoFAEnabled,
    setTwoFAEnabled,
    pin,
    setPin,
    transactions,
  } = useWallet();
  const [pinInput, setPinInput] = useState("");
  const [pinSaved, setPinSaved] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);

  const suspiciousTx = transactions.find(
    (tx) =>
      tx.amount > 5000 && (tx.type === "sent" || tx.type === "withdrawal"),
  );

  function handleSavePin() {
    if (pinInput.length === 4) {
      setPin(pinInput);
      setPinSaved(true);
      setShowPinForm(false);
      setPinInput("");
      setTimeout(() => setPinSaved(false), 2000);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("settings")}
          className="mb-4 p-1"
          data-ocid="security.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} />
          <h1 className="text-2xl font-extrabold">Security</h1>
        </div>
        <p className="text-white/75 text-sm mt-1">Protect your account</p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-6 space-y-4">
        {suspiciousTx && (
          <div
            data-ocid="security.suspicious.card"
            className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/30"
          >
            <AlertTriangle
              size={20}
              className="text-destructive shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-bold text-destructive">
                Suspicious Activity Detected
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                Large transaction of ${suspiciousTx.amount.toLocaleString()}{" "}
                detected. Please review your account.
              </p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl p-5 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Two-Factor Auth
                </p>
                <p className="text-xs text-muted-foreground">
                  Extra security for login
                </p>
              </div>
            </div>
            <Switch
              data-ocid="security.2fa.switch"
              checked={twoFAEnabled}
              onCheckedChange={setTwoFAEnabled}
            />
          </div>

          <div className="border-t border-border" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">PIN Lock</p>
                  <p className="text-xs text-muted-foreground">
                    {pin ? "PIN is set" : "No PIN set"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-ocid="security.pin.button"
                onClick={() => setShowPinForm(!showPinForm)}
                className="rounded-xl text-xs"
              >
                {pin ? "Change" : "Set PIN"}
              </Button>
            </div>

            {showPinForm && (
              <div className="mt-4 space-y-3 fade-in">
                <div className="flex gap-2 justify-center">
                  {PIN_SLOTS.map((slotId, idx) => (
                    <input
                      key={slotId}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={pinInput[idx] ?? ""}
                      readOnly
                      className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl bg-muted focus:outline-none"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PIN_KEYS.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      disabled={!k.value}
                      onClick={() => {
                        if (k.value === "⌫") setPinInput((p) => p.slice(0, -1));
                        else if (pinInput.length < 4)
                          setPinInput((p) => p + k.value);
                      }}
                      className={`h-12 rounded-xl text-base font-bold transition-colors ${
                        k.value
                          ? "bg-card border border-border hover:bg-muted active:bg-muted"
                          : "invisible"
                      }`}
                    >
                      {k.value}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleSavePin}
                  data-ocid="security.pin.save_button"
                  disabled={pinInput.length !== 4}
                  className="w-full h-11 rounded-xl font-bold wallet-gradient text-white border-0"
                >
                  Save PIN
                </Button>
              </div>
            )}

            {pinSaved && (
              <p
                data-ocid="security.pin.success_state"
                className="text-success text-sm mt-2 text-center"
              >
                PIN saved successfully!
              </p>
            )}
          </div>

          <div className="border-t border-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Fingerprint size={18} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Biometric Login
                </p>
                <p className="text-xs text-muted-foreground">
                  Use fingerprint/face ID
                </p>
              </div>
            </div>
            <Switch
              data-ocid="security.biometric.switch"
              defaultChecked={false}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 card-shadow">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Encryption
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <ShieldCheck size={16} className="text-success" />
            </div>
            <p className="text-sm text-foreground">
              256-bit AES encryption enabled
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
