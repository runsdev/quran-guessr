'use client';

import { useEffect } from 'react';

export default function MaterialSymbolsLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap';
    document.head.appendChild(link);
  }, []);

  return null;
}
