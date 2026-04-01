import { Toaster } from "@/components/ui/sonner";
import { WalletProvider, useWallet } from "./context/WalletContext";
import AddMoneyScreen from "./screens/AddMoneyScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import OTPScreen from "./screens/OTPScreen";
import SecurityScreen from "./screens/SecurityScreen";
import SendMoneyScreen from "./screens/SendMoneyScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SignUpScreen from "./screens/SignUpScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";
import WithdrawScreen from "./screens/WithdrawScreen";

function AppInner() {
  const { screen } = useWallet();

  const SCREENS: Record<typeof screen, React.ReactNode> = {
    login: <LoginScreen />,
    signup: <SignUpScreen />,
    otp: <OTPScreen />,
    "forgot-password": <ForgotPasswordScreen />,
    dashboard: <DashboardScreen />,
    "send-money": <SendMoneyScreen />,
    history: <TransactionHistoryScreen />,
    "add-money": <AddMoneyScreen />,
    withdraw: <WithdrawScreen />,
    notifications: <NotificationsScreen />,
    settings: <SettingsScreen />,
    security: <SecurityScreen />,
  };

  return (
    <div className="min-h-dvh bg-muted/50 flex justify-center">
      <div className="phone-frame w-full relative overflow-x-hidden">
        {SCREENS[screen]}
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppInner />
    </WalletProvider>
  );
}
