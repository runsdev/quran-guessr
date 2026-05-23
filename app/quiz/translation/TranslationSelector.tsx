'use client';

import { TRANSLATION_OPTIONS } from '@/lib/qdc-translations';

export const TRANSLATION_STORAGE_KEY = 'quizTranslationId';

export function loadTranslationId(): number {
  if (typeof window === 'undefined') {
    return TRANSLATION_OPTIONS[0].id;
  }
  try {
    const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (stored) {
      const id = parseInt(stored, 10);
      if (TRANSLATION_OPTIONS.some((t) => t.id === id)) {
        return id;
      }
    }
  } catch {
    // ignore
  }
  return TRANSLATION_OPTIONS[0].id;
}

export function saveTranslationId(id: number): void {
  localStorage.setItem(TRANSLATION_STORAGE_KEY, String(id));
}

interface Props {
  value: number;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export default function TranslationSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
        translate
      </span>
      <select
        value={value}
        onChange={(e) => {
          const newId = parseInt(e.target.value, 10);
          saveTranslationId(newId);
          onChange(newId);
        }}
        disabled={disabled}
        className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface disabled:opacity-50 focus:outline-none focus:border-primary"
      >
        {TRANSLATION_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
