# PayWallet

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Login/signup screens with email/phone, password, OTP verification, forgot password
- Dashboard with balance display, quick action buttons (Send, Request, Add Money, Withdraw)
- Send Money flow: recipient input, amount, note, processing animation, success screen
- Transaction history with filters (All, Sent, Received) and status indicators
- Add Money flow: card/bank options, amount entry, success screen
- Withdraw flow: select bank/card, enter amount, confirm, pending→completed status
- Notifications panel with real-time alerts
- Security settings: PIN setup simulation, 2FA toggle, suspicious activity alert
- Settings page: profile edit, change password, payment methods, language, logout
- Profile avatar management

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: user accounts, wallet balance, transactions (send/receive/deposit/withdraw), notifications
2. Frontend: auth screens, dashboard, send/receive flows, history, settings — mobile-responsive design
3. Authorization component for login/signup
