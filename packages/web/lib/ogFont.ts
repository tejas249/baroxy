// satori (used by next/og's ImageResponse) needs raw ttf/otf bytes, not woff2. Google Fonts only
// serves ttf to user agents old enough to predate woff2 support, so we spoof one to get a usable
// URL out of the CSS response, then fetch the actual font file.
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36";

const cache = new Map<string, Promise<ArrayBuffer | null>>();

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": LEGACY_UA } }).then((r) => r.text());
  // Google's CSS lists several subsets (vietnamese, latin-ext, latin, ...) — grabbing the first
  // @font-face regardless of subset risks picking one that doesn't cover basic Latin glyphs.
  const match = css.match(
    /\/\* latin \*\/\s*@font-face\s*{[^}]*src: url\(([^)]+)\) format\('(?:truetype|opentype|woff)'\)/
  );
  if (!match) return null;

  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) return null;
  return fontRes.arrayBuffer();
}

/** Resolves to null (never throws) so a font-fetch failure degrades to satori's fallback instead of a broken image. */
export function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetchGoogleFont(family, weight).catch(() => null)
    );
  }
  return cache.get(key)!;
}
