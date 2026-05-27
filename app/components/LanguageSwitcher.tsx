'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { setLocale } from '@/app/actions/locale';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center rounded-full border border-outline overflow-hidden">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          disabled={isPending || locale === code}
          className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
            locale === code
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
