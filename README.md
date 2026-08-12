<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Zustand-20232A?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
</p>

# 📱 Quiz Application

A trivia application built with React Native and Expo. Designed for fluid gameplay, the app features custom native animations, dynamic UI states, and efficient global state management to create an engaging quiz experience.

<img src="./assets/images/QR-code-quizApp.svg" width="30%" alt="Expo Go QR Code">

## ✨ Features

* **Paced Gameplay Flow:** Implements a timed "Ready, Set, Go" phase before each question, allowing users to focus before the active timer begins.
* **Native Animations:** Built with `react-native-reanimated` for seamless layout transitions, cascading list reveals, and physics-based spring effects.
* **Reactive Timer:** A custom progress bar that smoothly transitions colors (Green ➞ Yellow ➞ Red) as the 30-second clock counts down.
* **Locked Viewport Layout:** A fixed-screen UI design that prevents unwanted scrolling, keeping question cards and interactive elements neatly anchored across different device sizes.

## 🛠️ Tech Stack

* **Framework:** React Native / Expo
* **State Management:** Zustand 
* **Animations:** React Native Reanimated
* **Styling:** NativeWind (Tailwind CSS)
* **Backend:** Supabase

## 🚀 Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/Minedflayer/MyQuizApp.git
cd MyQuizApp

```

**2. Install dependencies**
```bash
npm install

```


**3. Start the application**
```bash
npx expo start

```

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** and **Expo Application Services (EAS)** to automate code quality checks, PR previews, and production updates.

### 🔍 Pull Request Checks & Preview (`PR Checks & Preview`)
Triggers automatically whenever a pull request is opened or updated targeting the `main` branch.

* **Linting & Type Checking:** Runs `npm run lint` and `npm run type-check` to enforce code quality and TypeScript rules before code is merged.
* **EAS Preview Builds:** Automatically generates a dynamic Expo update published to an isolated PR branch (`pr-<PR_NUMBER>`).
* **Interactive Feedback:** Uses `expo-github-action/preview` to automatically comment a scanable QR code directly on the Pull Request, allowing reviewers to test updates on live mobile devices using Expo Go.
* **Environment Injection:** Passes dynamic Supabase configuration secrets (`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`) at build time.

---

### 🚀 Production Continuous Deployment (`Production CD`)
Triggers automatically on code pushes or merged PRs directly to the `main` branch *(ignoring non-code changes like `.md` files or documentation)*.

* **Strict Reproducible Environment:** Uses `npm ci` to ensure lockfile integrity and prevent dependency drift.
* **Multi-Platform Release:** Runs `eas update --auto --branch production --platform all` to push Over-The-Air (OTA) updates to both iOS and Android production app instances instantly.

