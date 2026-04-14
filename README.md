# Family Dashboard (Family Link style)

A full-stack family dashboard web app built with **React + Firebase**.
It is mobile-first, installable as a PWA, and deployable as a static frontend on **GitHub Pages**.

## Features

- Home dashboard with today's schedule, family announcements, and quick check-in buttons
- Family members with profile + role (parent/child) + avatar selection
- Task/chores management with assignment and completion tracking
- Points and rewards redemption system
- Shared calendar with upcoming events
- Shared grocery/list manager
- Check-ins: "I'm home", "Need pickup", "Done with homework"
- Family journal posts with optional image upload (Firebase Storage)
- Firebase Auth (email/password + Google)
- Dark mode toggle
- PWA support (manifest + service worker basic offline caching)

## Tech Stack

- React + Vite
- React Router
- Firebase Auth + Firestore + Storage
- Context + Hooks state management

## Project Structure

```
.
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   ├── registerSW.js
│   └── styles.css
├── .env.example
├── package.json
└── vite.config.js
```

## Firebase Setup

1. Create a Firebase project.
2. Enable **Authentication** providers:
   - Email/Password
   - Google
3. Create **Cloud Firestore** (production/test mode as needed).
4. Create **Storage** bucket.
5. Copy `.env.example` to `.env` and fill Firebase values.

### Required Firestore Collections

The app writes/reads these collections:

- `users`
- `families`
- `tasks`
- `rewards`
- `events`
- `lists`
- `checkins`
- `journal`

Each document includes `familyId` to scope family data.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Set `VITE_BASE_PATH` in `.env` to your repo path, e.g. `/family-dashboard/`.
3. Commit and push code.
4. Deploy:

```bash
npm run deploy
```

5. In GitHub repo settings, set Pages source to `gh-pages` branch.

## Notes

- Service worker caches core shell + visited GET assets for basic offline UI support.
- For production, configure Firestore and Storage security rules per your family access model.
- For Firebase Cloud Messaging notifications (bonus), add FCM setup in Firebase console and web push keys.
