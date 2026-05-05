'use client';

import { useState, useEffect } from 'react';

const CDN_BASE = 'https://verses.quran.foundation';

// Module-level cache persists across renders and component instances
const globalLoadedFonts = new Set<string>();

export function useQcfFontLoader(pageNumbers: number[]): Set<number> {
  const pageKey = [...new Set(pageNumbers)].sort((a, b) => a - b).join(',');

  const [loadedPages, setLoadedPages] = useState<Set<number>>(
    () => new Set(pageNumbers.filter((p) => globalLoadedFonts.has(`p${p}-v2`))),
  );

  useEffect(() => {
    if (!pageKey) {
      return;
    }
    const pages = pageKey.split(',').map(Number);

    Promise.all(
      pages.map(async (page) => {
        const fontName = `p${page}-v2`;
        if (globalLoadedFonts.has(fontName)) {
          return page;
        }
        try {
          const fontFace = new FontFace(
            fontName,
            `url('${CDN_BASE}/fonts/quran/hafs/v2/woff2/p${page}.woff2')`,
          );
          fontFace.display = 'block';
          await fontFace.load();
          document.fonts.add(fontFace);
          globalLoadedFonts.add(fontName);
        } catch {
          // silently fall back to Unicode rendering
        }
        return page;
      }),
    ).then((loaded) => {
      setLoadedPages((prev) => {
        const next = new Set(prev);
        loaded.forEach((p) => next.add(p));
        return next;
      });
    });
  }, [pageKey]);

  return loadedPages;
}
