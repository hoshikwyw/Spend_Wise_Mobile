# SpendWise

A mobile-first personal expense tracker built with Expo and React Native. SpendWise helps users capture day-to-day spending, set monthly budgets, and understand where their money goes — all synced to a Supabase backend with a clean, theme-aware UI.

## Features

- **Expense logging** — Quick-add flow with category picker, amount, note, and date.
- **Monthly budgets** — Set a target per month and track progress in real time.
- **Categories** — Default categories out of the box, plus user-defined ones with emoji and color.
- **Authentication** — Email/password and OAuth via Supabase Auth, with persistent sessions.
- **Theme system** — Light, dark, and system-follow modes with per-user accent color.
- **Offline-friendly session** — Sessions persist via `AsyncStorage` and refresh automatically.
- **Tab navigation** — Home, Expenses, Add, Budget, and Settings, powered by Expo Router.

## Tech Stack

| Layer          | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | [Expo](https://expo.dev) `~54` + React Native `0.81`|
| Language       | TypeScript `~5.9`                                   |
| Routing        | [expo-router](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend        | [Supabase](https://supabase.com) (Postgres + Auth)  |
| State / Data   | React Context + custom hooks (`useExpenses`, `useBudget`) |
| Storage        | `@react-native-async-storage/async-storage`         |
| Animations     | `react-native-reanimated` v4                        |
| Icons          | `lucide-react-native`                               |
| Build / Deploy | EAS Build (`eas.json`)                              |

New Architecture (Fabric + TurboModules) is enabled via `newArchEnabled: true`.

## Project Structure

```
SpendWiseMobile/
├── app/                    # expo-router routes (file-based navigation)
│   ├── _layout.tsx         # Root layout + providers
│   ├── index.tsx           # Entry / auth gate
│   ├── login.tsx           # Auth screen
│   └── (tabs)/             # Authenticated tab group
│       ├── _layout.tsx
│       ├── index.tsx       # Dashboard
│       ├── expenses.tsx
│       ├── add.tsx
│       ├── budget.tsx
│       └── settings.tsx
├── components/             # Reusable UI components
│   ├── AddExpenseSheet.tsx
│   ├── BudgetProgress.tsx
│   ├── CategoryPicker.tsx
│   ├── ExpenseCard.tsx
│   └── ThemeToggle.tsx
├── contexts/               # App-wide providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/                  # Data hooks
│   ├── useExpenses.ts
│   └── useBudget.ts
├── lib/                    # Core utilities
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # Domain types
│   ├── constants.ts
│   └── utils.ts
├── assets/                 # Icons, splash, images
├── scripts/                # Asset generation helpers
├── app.json                # Expo config
└── eas.json                # EAS Build profiles
```

## Data Model

The app is backed by Supabase with the following core tables (mirrored in [lib/types.ts](lib/types.ts)):

- **`profiles`** — user profile (display name, avatar).
- **`categories`** — default + user-defined spending categories.
- **`expenses`** — individual expense records, linked to a category.
- **`budgets`** — monthly budget amounts per user.
- **`user_preferences`** — theme, accent color, currency.

Row-Level Security should be enabled on all user-scoped tables so each user only reads and writes their own rows.

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm / yarn — examples use npm)
- Expo CLI (bundled via `npx`)
- iOS Simulator (macOS) or Android emulator, or the **Expo Go** app on a physical device
- A Supabase project (free tier is enough)

### Install

```bash
git clone <repo-url>
cd SpendWiseMobile
npm install
```

### Configure Supabase

The Supabase client currently reads URL and anon key from [lib/supabase.ts](lib/supabase.ts). For any non-trivial deployment you should move these into environment variables via `app.config.ts` / `expo-constants`:

```ts
// lib/supabase.ts
import Constants from "expo-constants";

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig!.extra as {
  supabaseUrl: string;
  supabaseAnonKey: string;
};
```

Then provide the values via `.env` + `app.config.ts` or EAS secrets. **Do not commit service-role keys.** The anon key is safe to ship, but access control still depends on RLS policies being set up correctly in Supabase.

### Run

```bash
npm start          # start Metro / Expo dev server
npm run android    # launch on Android
npm run ios        # launch on iOS (macOS only)
npm run web        # run in the browser
```

## Building for Release

Builds are managed via [EAS Build](https://docs.expo.dev/build/introduction/). Profiles are defined in [eas.json](eas.json):

- **`preview`** — internal APK for quick QA.
- **`production`** — Android App Bundle for Play Store.

```bash
# one-time
npm install -g eas-cli
eas login

# build
eas build --platform android --profile preview
eas build --platform android --profile production
eas build --platform ios     --profile production
```

The EAS project ID is pinned in [app.json](app.json) under `extra.eas.projectId`.

## Conventions

- **TypeScript everywhere.** Domain types live in [lib/types.ts](lib/types.ts) and should stay in sync with Supabase schema changes.
- **File-based routing.** Add new screens by dropping a file in [app/](app/); grouped routes live under `(tabs)/`.
- **Data access via hooks.** Keep Supabase queries inside [hooks/](hooks/) so screens stay declarative.
- **Theming via context.** Read colors/spacing from `ThemeContext` — avoid hard-coded hex values in components.
- **Path conventions.** Assets go in [assets/](assets/); generation scripts in [scripts/](scripts/).

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `npm start`         | Start the Expo dev server              |
| `npm run android`   | Build and run on an Android device     |
| `npm run ios`       | Build and run on an iOS simulator      |
| `npm run web`       | Run the web target                     |

## Roadmap

- [ ] Recurring expenses
- [ ] Multi-currency support with FX conversion
- [ ] CSV / JSON export
- [ ] Charts and trend analysis
- [ ] Push notifications for budget thresholds
- [ ] Shared household budgets

## License

Private project — all rights reserved unless a license file is added.
