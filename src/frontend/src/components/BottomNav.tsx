import { Bell, Clock, Home, Send, Settings } from "lucide-react";
import { type Screen, useWallet } from "../context/WalletContext";

const NAV_ITEMS: {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  screen: Screen;
}[] = [
  { icon: Home, label: "Home", screen: "dashboard" },
  { icon: Send, label: "Send", screen: "send-money" },
  { icon: Clock, label: "History", screen: "history" },
  { icon: Bell, label: "Alerts", screen: "notifications" },
  { icon: Settings, label: "Settings", screen: "settings" },
];

export default function BottomNav() {
  const { screen, setScreen, unreadCount } = useWallet();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full phone-frame bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = screen === item.screen;
          return (
            <button
              type="button"
              key={item.screen}
              data-ocid={`nav.${item.screen}.link`}
              onClick={() => setScreen(item.screen)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative">
                <Icon
                  size={22}
                  className={active ? "stroke-[2.5]" : "stroke-2"}
                />
                {item.screen === "notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}
              >
                {item.label}
              </span>
              {active && <span className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
