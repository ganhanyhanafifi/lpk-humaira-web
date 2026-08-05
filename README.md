# LPK Humaira Institute - Registration Portal

## Description
This project is the main registration portal and website for LPK Humaira Institute. It includes a frontend built with React + Vite, and a backend powered by Firebase Services (Firestore, Storage, and Cloud Functions). It features real-time notifications via a Telegram Bot whenever a new student registers.

## Tech Stack
- **Frontend:** React 18, Vite
- **Backend:** Firebase (Cloud Functions v2, Firestore, Storage, Hosting)
- **Notifications:** Telegram Bot API
- **Language:** JavaScript/Node.js (Backend)

## Prerequisites
- Node.js 18+
- Firebase CLI installed globally (`npm install -g firebase-tools`)
- A Telegram Bot token (from BotFather) and a Chat ID.

## Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "WebHai"
   ```
2. **Install frontend dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Firebase configuration values.
4. **Install backend dependencies:**
   ```bash
   cd functions
   npm install
   ```
5. **Start Development Server:**
   ```bash
   # Go back to project root
   cd ..
   npm run dev
   ```

## Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (`lpk-humaira-institute`).
2. Enable **Firestore**, **Storage**, and **Functions** (requires Blaze plan).
3. Initialize firebase if needed, or simply ensure your `.firebaserc` points to your project.
4. Run `firebase login` to authenticate the CLI.

## Telegram Bot Setup
1. Message **@BotFather** on Telegram.
2. Send `/newbot` and follow the prompts to get your **Bot Token**.
3. Create a group, add your bot, and send a message.
4. Use `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` to find your **Chat ID**.

## Setting Cloud Function Secrets
We use Firebase Secrets Management for sensitive keys instead of hardcoding them.
Run the following commands and paste your values when prompted:
```bash
firebase functions:secrets:set TELEGRAM_BOT_TOKEN
firebase functions:secrets:set TELEGRAM_CHAT_ID
```

## Deploying
To deploy the whole stack to Firebase:
1. **Build Frontend:**
   ```bash
   npm run build
   ```
2. **Deploy Hosting:**
   ```bash
   firebase deploy --only hosting
   ```
3. **Deploy Functions:**
   ```bash
   firebase deploy --only functions
   ```
4. **Deploy Rules:**
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

*(Alternatively, run `firebase deploy` to deploy everything at once).*

## Security Notes
- **Firestore:** Only public creation is allowed for new registrations. Reading, updating, and deleting are blocked.
- **Storage:** Only file uploads (Images/PDFs) under 5MB are permitted in the `/pendaftaran/` path.
- **Secrets:** Do not expose `TELEGRAM_BOT_TOKEN` in frontend code. It is safely secured in Cloud Functions.

## License
MIT License.
