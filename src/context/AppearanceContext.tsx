import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeValue = 'light' | 'dark' | 'system';
export type AccentValue = 'green' | 'blue' | 'purple' | 'red' | 'orange';
export type SidebarLayoutValue = 'default' | 'compact' | 'minimal';

export interface AppearanceState {
  theme: ThemeValue;
  accentColor: AccentValue;
  sidebarLayout: SidebarLayoutValue;
}

interface AppearanceContextType {
  appearance: AppearanceState;
  draft: AppearanceState;
  setDraft: React.Dispatch<React.SetStateAction<AppearanceState>>;
  saveAppearance: (next: AppearanceState) => void;
  resetDraft: () => void;
  isDirty: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: AppearanceState = {
  theme: 'light',
  accentColor: 'green',
  sidebarLayout: 'default',
};

const STORAGE_KEY = 'mypharma_appearance';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage(): AppearanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...DEFAULTS };
}

/** Resolve 'system' to actual light/dark based on OS preference */
function resolveTheme(theme: ThemeValue): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

/** Apply appearance tokens to the <html> element */
function applyToDOM(state: AppearanceState) {
  const root = document.documentElement;
  root.setAttribute('data-theme', resolveTheme(state.theme));
  root.setAttribute('data-accent', state.accentColor);
  root.setAttribute('data-sidebar', state.sidebarLayout);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearance] = useState<AppearanceState>(loadFromStorage);
  const [draft, setDraft] = useState<AppearanceState>(() => loadFromStorage());

  // Apply saved appearance on mount and whenever appearance changes
  useEffect(() => {
    applyToDOM(appearance);
  }, [appearance]);

  // Live-preview: apply draft to DOM whenever draft changes
  useEffect(() => {
    applyToDOM(draft);
  }, [draft]);

  // Listen for OS color-scheme changes when theme is 'system'
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (appearance.theme === 'system') {
        applyToDOM(appearance);
      }
      if (draft.theme === 'system') {
        applyToDOM(draft);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [appearance, draft]);

  const saveAppearance = (next: AppearanceState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setAppearance(next);
    setDraft(next);
    applyToDOM(next);
  };

  const resetDraft = () => {
    setDraft({ ...appearance });
    applyToDOM(appearance);
  };

  const isDirty =
    draft.theme !== appearance.theme ||
    draft.accentColor !== appearance.accentColor ||
    draft.sidebarLayout !== appearance.sidebarLayout;

  return (
    <AppearanceContext.Provider
      value={{ appearance, draft, setDraft, saveAppearance, resetDraft, isDirty }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppearance(): AppearanceContextType {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error('useAppearance must be used inside <AppearanceProvider>');
  }
  return ctx;
}
