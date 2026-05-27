import React from 'react';

import { getTranslations } from 'next-intl/server';

export default async function QuizPrompt(): Promise<React.JSX.Element> {
  const t = await getTranslations('locateVerse');

  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-semibold text-on-background">{t('whereIsAyah')}</h2>
      <p className="text-sm text-on-surface-variant mt-1">{t('selectPageRow')}</p>
    </div>
  );
}
