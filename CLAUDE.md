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
        └── App.tsx  ← AppBar + global Snackbar (toast)
              └── LogsPage        ← orchestrates all state interactions
                    ├── ServiceLogForm       (create mode)
                    ├── EditLogDialog        (wraps ServiceLogForm in edit mode)
                    ├── RemoveAllDraftsDialog
                    └── ServiceLogs (×2: drafts + confirmed)
                          └── ServiceLogsTable
```

### State (Redux Toolkit + redux-persist → localStorage)

- **`logs` slice** (`features/logs-slice.ts`): holds `ServiceLog[]`. Actions: `addLog`, `updateLog`, `deleteLog`, `removeAllDrafts`.
- **`app` slice** (`features/app-slice.ts`): holds `toast` (notification state) and `autoSave` (partial form data). The `toast` field is excluded from persistence; `autoSave` is persisted.

Typed hooks are in `hooks/redux-hooks.ts` (`useAppDispatch`, `useAppSelector`).

### Custom Hooks (hooks/)

Logic is extracted from `LogsPage` into focused hooks:

- `use-get-logs.ts` — selects and returns `{ autoSave, drafts, serviceLogs }` from store
- `use-create-log.ts` — `handleSubmit`, `handleCreateDraft`, `handleAutoSave`, `handleClearAutoSave`
- `use-update-log.ts` — `handleEdit`, `handleSave`, `handleConfirmDraft`, `handleCloseEdit`
- `use-remove-log.ts` — `handleDelete`, `handleRemoveAllDrafts`
- `use-toast.ts` — convenience wrapper: `toast(message, severity?)`

### Key Concepts

- **Draft vs Confirmed logs**: Every log has a `draft: boolean` flag. Drafts are shown in a separate table and can be confirmed later.
- **Auto-save**: `ServiceLogForm` debounces form changes (800 ms) and dispatches to the `autoSave` field in `app` slice — only active in create mode. On mount, the form re-hydrates from `autoSave` state.
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
  startDate: string; // ISO string
  endDate: string;   // ISO string
  type: 'planned' | 'unplanned' | 'emergency';
  serviceDescription: string;
  draft: boolean;
  createdAt: string;
  updatedAt: string;
}

type DraftFormData = Omit<ServiceLog, 'id' | 'createdAt' | 'updatedAt' | 'draft'>
```

## Tech Stack

| Concern     | Library                                   |
| ----------- | ----------------------------------------- |
| UI          | MUI v7 + Emotion                          |
| State       | Redux Toolkit 2 + react-redux 9           |
| Persistence | redux-persist (localStorage)              |
| Forms       | React Hook Form 7 + Yup                   |
| Dates       | dayjs + MUI X Date Pickers 8              |
| Build       | Vite 7 + React Compiler (Babel)           |
| Linting     | ESLint 9 flat config + TypeScript ESLint  |
| Formatting  | Prettier (single quotes, trailing commas) |

## Conventions

- ESLint uses the **flat config** format (`eslint.config.js`) — do not use legacy `.eslintrc` syntax.
- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`).
- IDs are generated with `crypto.randomUUID()`.
- Dates are stored as ISO strings and parsed with `dayjs` at render time.
- React Compiler (babel-plugin-react-compiler) handles memoization automatically — do not add `useMemo`/`useCallback` manually.
