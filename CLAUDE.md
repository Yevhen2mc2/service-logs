# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run format     # Prettier (write)
npm run preview    # Preview production build
```

No test runner is configured.

## Architecture

**MediDrive** is a service maintenance log management SPA built with React 19 + Redux Toolkit + MUI.

### Data Flow

```
main.tsx
  └── Provider (Redux) + PersistGate + LocalizationProvider (dayjs)
        └── App.tsx  ← orchestrates all state interactions
              ├── ServiceLogForm       (create mode)
              ├── EditLogDialog        (wraps ServiceLogForm in edit mode)
              └── ServiceLogs
                    └── ServiceLogsTable
```

### State (Redux Toolkit + redux-persist → localStorage)

- **`logs` slice** (`features/logs-slice.ts`): holds `ServiceLog[]`. Actions: add, update, delete, confirm draft, remove all drafts.
- **`autoSave` slice** (`features/auto-save-slice.ts`): stores partial form data while user is typing in create mode. Cleared on submit or cancel.

Typed hooks are in `hooks/redux-hooks.ts` (`useAppDispatch`, `useAppSelector`).

### Key Concepts

- **Draft vs Confirmed logs**: Every log has a `draft: boolean` flag. Drafts are shown separately in `App.tsx` and can be confirmed later.
- **Auto-save**: `ServiceLogForm` debounces form changes (800 ms) and dispatches to `autoSave` slice — only active in create mode. On mount, the form re-hydrates from `autoSave` state.
- **Validation**: Yup schema in `schemes/service-log.ts`, wired to React Hook Form via `@hookform/resolvers/yup`.
- **Service types**: `'planned' | 'unplanned' | 'emergency'` — defined in `constants/service-types.ts`, used for chip colors and filter toggles.

### Core Type

```typescript
// types/service-log.ts
interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;   // ISO string
  endDate: string;
  type: 'planned' | 'unplanned' | 'emergency';
  serviceDescription: string;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Tech Stack

| Concern | Library |
|---|---|
| UI | MUI v7 + Emotion |
| State | Redux Toolkit 2 + react-redux 9 |
| Persistence | redux-persist (localStorage) |
| Forms | React Hook Form 7 + Yup |
| Dates | dayjs + MUI X Date Pickers 8 |
| Build | Vite 7 + React Compiler (Babel) |
| Linting | ESLint 9 flat config + TypeScript ESLint |
| Formatting | Prettier (single quotes, trailing commas) |

## Conventions

- ESLint uses the **flat config** format (`eslint.config.js`) — do not use legacy `.eslintrc` syntax.
- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`).
- IDs are generated with `crypto.randomUUID()`.
- Dates are stored as ISO strings and parsed with `dayjs` at render time.
