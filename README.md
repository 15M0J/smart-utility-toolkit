# Smart Utility Toolkit

Smart Utility Toolkit is an Expo React Native app that bundles everyday mobile utilities into one offline-friendly experience. The app now includes the Stage 1 checklist manager alongside the Stage 0 converter, notes, and calculator features.

## Features

- Unit converter for length, weight, temperature, and demo currency rates
- Task/checklist manager with create, edit, complete, and delete actions
- Notes manager with local persistence
- Calculator for quick arithmetic
- Offline persistence for notes and tasks using AsyncStorage
- Simple hub-and-detail navigation with Expo Router

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- AsyncStorage

## Project Structure

```text
app/
  index.tsx         Home hub
  calculator.tsx
  converter.tsx
  notes.tsx
  tasks.tsx
  _layout.tsx
components/
  app-button.tsx
  form-field.tsx
lib/
  storage.ts
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

3. Run on a target platform:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Offline Persistence

The app stores user-generated content locally with AsyncStorage.

- Notes are saved under `smart_utility_notes`
- Tasks are saved under `smart_utility_tasks`

Saved data is rehydrated on launch, and writes happen only after hydration to avoid overwriting existing local data with an empty initial state.

## Build APK With EAS

This repository already includes an `eas.json` preview profile for Android APK builds.

```bash
eas build --platform android --profile preview
```

After the APK is generated:

1. Download the build artifact from EAS.
2. Upload it to Appetize.
3. Copy the Appetize public preview link for submission.

## Verification

Run these checks before submission:

```bash
npm run lint
npx tsc --noEmit
```

## Submission Notes

For the final HNG submission, include:

- GitHub repository link
- Appetize preview link
- Documentation post on LinkedIn or X describing your process, challenges, purpose of the task, and what you learned
