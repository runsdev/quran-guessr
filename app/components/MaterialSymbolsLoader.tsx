import Script from 'next/script';

/**
 * Loads the Material Symbols icon font after the page is fully interactive
 * using next/script lazyOnload strategy so it never blocks LCP or FID.
 */
export default function MaterialSymbolsLoader() {
  return (
    <Script
      id="material-symbols-loader"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap';document.head.appendChild(l);})();`,
      }}
    />
  );
}
