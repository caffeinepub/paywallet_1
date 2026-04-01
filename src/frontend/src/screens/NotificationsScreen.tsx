import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Building2,
  Shield,
} from "lucide-react";
import { useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { type Notification, useWallet } from "../context/WalletContext";

const ICON_MAP = {
  payment_received: {
    icon: ArrowDownLeft,
    bg: "bg-success/10",
    color: "text-success",
  },
  payment_sent: {
    icon: ArrowUpRight,
    bg: "bg-destructive/10",
    color: "text-destructive",
  },
  security: { icon: Shield, bg: "bg-warning/10", color: "text-warning" },
  withdrawal: {
    icon: Building2,
    bg: "bg-secondary/10",
    color: "text-secondary",
  },
};

function NotifItem({ notif, index }: { notif: Notification; index: number }) {
  const { icon: Icon, bg, color } = ICON_MAP[notif.type];
  const timeStr = new Date(notif.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      data-ocid={`notifications.item.${index}`}
      className={`flex items-start gap-4 p-4 rounded-2xl mb-3 transition-all ${
        notif.read ? "bg-card" : "bg-secondary/5 border border-secondary/20"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${bg}`}
      >
        <Icon size={20} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${notif.read ? "text-foreground" : "text-foreground font-semibold"}`}
        >
          {notif.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{timeStr}</p>
      </div>
      {!notif.read && (
        <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 mt-1" />
      )}
    </div>
  );
}

export default function NotificationsScreen() {
  const { notifications, setScreen, markAllNotificationsRead, unreadCount } =
    useWallet();

  useEffect(() => {
    const timer = setTimeout(() => markAllNotificationsRead(), 2000);
    return () => clearTimeout(timer);
  }, [markAllNotificationsRead]);

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-24 fade-in">
      <div className="wallet-gradient px-5 pt-14 pb-10 text-white">
        <button
          type="button"
          onClick={() => setScreen("dashboard")}
          className="mb-4 p-1"
          data-ocid="notifications.back.button"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={22} />
            <h1 className="text-2xl font-extrabold">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 -mt-6 rounded-t-3xl bg-background px-5 pt-6">
        {notifications.length === 0 ? (
          <div
            data-ocid="notifications.empty_state"
            className="text-center py-16"
          >
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div data-ocid="notifications.list">
            {notifications.map((notif, i) => (
              <NotifItem key={notif.id} notif={notif} index={i + 1} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
