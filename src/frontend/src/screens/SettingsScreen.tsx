import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useWallet } from "../context/WalletContext";

export default function SettingsScreen() {
  const { user, setUser, setScreen, paymentMethods } = useWallet();
  const [section, setSection] = useState<
    "main" | "profile" | "password" | "methods"
  >("main");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [language, setLanguage] = useState("en");

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, email, phone });
      setProfileMsg("Profile updated!");
      setTimeout(() => {
        setProfileMsg("");
        setSection("main");
      }, 1500);
    }
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwMsg("Passwords don't match.");
      return;
    }
    if (newPw.length < 6) {
      setPwMsg("Password must be at least 6 characters.");
      return;
    }
    setPwMsg("Password changed successfully!");
    setTimeout(() => {
      setPwMsg("");
      setSection("main");
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
    }, 1500);
  }

  function handleLogout() {
    setUser(null);
    setScreen("login");
  }

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="text-white/75 text-sm mt-1">Manage your account</p>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-6">
        {/* Profile card at top */}
        {section === "main" && (
          <div className="fade-in space-y-4">
            <div className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full wallet-gradient flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
              <div>
                <p className="font-bold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.phone}</p>
              </div>
            </div>

            {(
              [
                {
                  icon: User,
                  label: "Edit Profile",
                  action: () => setSection("profile"),
                  ocid: "settings.profile.button",
                },
                {
                  icon: Lock,
                  label: "Change Password",
                  action: () => setSection("password"),
                  ocid: "settings.password.button",
                },
                {
                  icon: CreditCard,
                  label: "Payment Methods",
                  action: () => setSection("methods"),
                  ocid: "settings.methods.button",
                },
                {
                  icon: ShieldCheck,
                  label: "Security",
                  action: () => setScreen("security"),
                  ocid: "settings.security.button",
                },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.ocid}
                  data-ocid={item.ocid}
                  onClick={item.action}
                  className="w-full bg-card rounded-2xl p-4 card-shadow flex items-center gap-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-foreground text-left">
                    {item.label}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              );
            })}

            <div className="bg-card rounded-2xl p-4 card-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Globe size={18} className="text-secondary" />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  Language
                </span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    data-ocid="settings.language.select"
                    className="w-32 h-9 rounded-xl text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              type="button"
              data-ocid="settings.logout.button"
              onClick={handleLogout}
              className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-destructive/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <LogOut size={18} className="text-destructive" />
              </div>
              <span className="text-sm font-bold text-destructive">
                Log Out
              </span>
            </button>
          </div>
        )}

        {section === "profile" && (
          <div className="fade-in">
            <button
              type="button"
              onClick={() => setSection("main")}
              className="flex items-center gap-2 text-secondary text-sm font-semibold mb-5"
              data-ocid="settings.profile.back.button"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Edit Profile
            </h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  data-ocid="settings.profile.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  data-ocid="settings.profile.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  data-ocid="settings.profile.input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              {profileMsg && (
                <p
                  data-ocid="settings.profile.success_state"
                  className="text-success text-sm"
                >
                  {profileMsg}
                </p>
              )}
              <Button
                type="submit"
                data-ocid="settings.profile.save_button"
                className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
              >
                Save Changes
              </Button>
            </form>
          </div>
        )}

        {section === "password" && (
          <div className="fade-in">
            <button
              type="button"
              onClick={() => setSection("main")}
              className="flex items-center gap-2 text-secondary text-sm font-semibold mb-5"
              data-ocid="settings.password.back.button"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Change Password
            </h2>
            <form onSubmit={changePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>Old Password</Label>
                <div className="relative">
                  <Input
                    data-ocid="settings.password.input"
                    type={showOld ? "text" : "password"}
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                    className="h-12 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    data-ocid="settings.password.input"
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="h-12 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  data-ocid="settings.password.input"
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              {pwMsg && (
                <p
                  data-ocid={
                    pwMsg.includes("success") || pwMsg.includes("changed")
                      ? "settings.password.success_state"
                      : "settings.password.error_state"
                  }
                  className={
                    pwMsg.includes("success") || pwMsg.includes("changed")
                      ? "text-success text-sm"
                      : "text-destructive text-sm"
                  }
                >
                  {pwMsg}
                </p>
              )}
              <Button
                type="submit"
                data-ocid="settings.password.save_button"
                className="w-full h-12 rounded-xl font-bold wallet-gradient text-white border-0"
              >
                Update Password
              </Button>
            </form>
          </div>
        )}

        {section === "methods" && (
          <div className="fade-in">
            <button
              type="button"
              onClick={() => setSection("main")}
              className="flex items-center gap-2 text-secondary text-sm font-semibold mb-5"
              data-ocid="settings.methods.back.button"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Payment Methods
            </h2>
            <div className="space-y-3" data-ocid="settings.methods.list">
              {paymentMethods.map((m, i) => (
                <div
                  key={m.id}
                  data-ocid={`settings.methods.item.${i + 1}`}
                  className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
                    <CreditCard size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {m.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      •••• {m.last4}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
