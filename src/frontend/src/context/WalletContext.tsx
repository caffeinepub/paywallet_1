import { type ReactNode, createContext, useContext, useState } from "react";

export type TransactionType = "sent" | "received" | "deposit" | "withdrawal";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  note?: string;
}

export interface Notification {
  id: string;
  type: "payment_received" | "payment_sent" | "security" | "withdrawal";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "debit" | "credit" | "bank";
  label: string;
  last4: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN001",
    type: "received",
    name: "Sarah Williams",
    email: "sarah@example.com",
    amount: 500,
    date: "2026-03-31",
    status: "Completed",
    note: "Rent split",
  },
  {
    id: "TXN002",
    type: "sent",
    name: "Mike Chen",
    email: "mike@example.com",
    amount: 120.5,
    date: "2026-03-30",
    status: "Completed",
    note: "Dinner",
  },
  {
    id: "TXN003",
    type: "deposit",
    name: "Bank Transfer",
    email: "bank",
    amount: 2000,
    date: "2026-03-29",
    status: "Completed",
  },
  {
    id: "TXN004",
    type: "sent",
    name: "Emma Davis",
    email: "emma@example.com",
    amount: 75,
    date: "2026-03-28",
    status: "Completed",
    note: "Birthday gift",
  },
  {
    id: "TXN005",
    type: "received",
    name: "James Wilson",
    email: "james@example.com",
    amount: 250,
    date: "2026-03-27",
    status: "Completed",
  },
  {
    id: "TXN006",
    type: "withdrawal",
    name: "Chase Bank",
    email: "bank",
    amount: 500,
    date: "2026-03-26",
    status: "Completed",
  },
  {
    id: "TXN007",
    type: "sent",
    name: "Olivia Brown",
    email: "olivia@example.com",
    amount: 45.99,
    date: "2026-03-25",
    status: "Pending",
    note: "Netflix split",
  },
  {
    id: "TXN008",
    type: "received",
    name: "Liam Johnson",
    email: "liam@example.com",
    amount: 1200,
    date: "2026-03-24",
    status: "Completed",
    note: "Freelance payment",
  },
  {
    id: "TXN009",
    type: "sent",
    name: "Ava Martinez",
    email: "ava@example.com",
    amount: 300,
    date: "2026-03-23",
    status: "Failed",
    note: "Trip funds",
  },
  {
    id: "TXN010",
    type: "deposit",
    name: "Visa Debit •4521",
    email: "card",
    amount: 5000,
    date: "2026-03-22",
    status: "Completed",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "N001",
    type: "payment_received",
    message: "You received $500.00 from Sarah Williams",
    timestamp: "2026-03-31T10:30:00",
    read: false,
  },
  {
    id: "N002",
    type: "payment_sent",
    message: "Payment of $120.50 sent to Mike Chen",
    timestamp: "2026-03-30T19:45:00",
    read: false,
  },
  {
    id: "N003",
    type: "security",
    message: "New login detected from Chrome on MacOS",
    timestamp: "2026-03-30T08:12:00",
    read: true,
  },
  {
    id: "N004",
    type: "withdrawal",
    message: "Withdrawal of $500.00 to Chase Bank completed",
    timestamp: "2026-03-26T14:20:00",
    read: true,
  },
  {
    id: "N005",
    type: "payment_received",
    message: "You received $1,200.00 from Liam Johnson",
    timestamp: "2026-03-24T11:55:00",
    read: true,
  },
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "PM001", type: "debit", label: "Visa Debit", last4: "4521" },
  { id: "PM002", type: "credit", label: "Mastercard Credit", last4: "8834" },
  { id: "PM003", type: "bank", label: "Chase Bank", last4: "9012" },
];

export type Screen =
  | "login"
  | "signup"
  | "otp"
  | "forgot-password"
  | "dashboard"
  | "send-money"
  | "history"
  | "add-money"
  | "withdraw"
  | "notifications"
  | "settings"
  | "security";

interface WalletContextValue {
  screen: Screen;
  setScreen: (s: Screen) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  balance: number;
  setBalance: (b: number) => void;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  notifications: Notification[];
  markAllNotificationsRead: () => void;
  unreadCount: number;
  paymentMethods: PaymentMethod[];
  twoFAEnabled: boolean;
  setTwoFAEnabled: (v: boolean) => void;
  pin: string;
  setPin: (p: string) => void;
  pendingOtpEmail: string;
  setPendingOtpEmail: (e: string) => void;
  pendingSignupData: (Partial<User> & { password?: string }) | null;
  setPendingSignupData: (
    d: (Partial<User> & { password?: string }) | null,
  ) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(20098.563);
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [pin, setPin] = useState("");
  const [pendingOtpEmail, setPendingOtpEmail] = useState("");
  const [pendingSignupData, setPendingSignupData] = useState<
    (Partial<User> & { password?: string }) | null
  >(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function addTransaction(t: Transaction) {
    setTransactions((prev) => [t, ...prev]);
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <WalletContext.Provider
      value={{
        screen,
        setScreen,
        user,
        setUser,
        balance,
        setBalance,
        transactions,
        addTransaction,
        notifications,
        markAllNotificationsRead,
        unreadCount,
        paymentMethods: MOCK_PAYMENT_METHODS,
        twoFAEnabled,
        setTwoFAEnabled,
        pin,
        setPin,
        pendingOtpEmail,
        setPendingOtpEmail,
        pendingSignupData,
        setPendingSignupData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
