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

    // Load each page font independently so each verse switches to QCF as soon
    // as its own font is ready, rather than waiting for the slowest font.
    pages.forEach(async (page) => {
      const fontName = `p${page}-v2`;
      if (globalLoadedFonts.has(fontName)) {
        setLoadedPages((prev) => {
          if (prev.has(page)) {
            return prev;
          }
          const next = new Set(prev);
          next.add(page);
          return next;
        });
        return;
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
        // Only mark as loaded after a successful load — failed fonts stay out
        // of loadedPages so words fall back to UthmanicHafs rather than
        // inheriting the parent .quran-text Scheherazade New font.
        setLoadedPages((prev) => {
          const next = new Set(prev);
          next.add(page);
          return next;
        });
      } catch {
        // silently fall back to Unicode rendering for this page
      }
    });
  }, [pageKey]);

  return loadedPages;
}
