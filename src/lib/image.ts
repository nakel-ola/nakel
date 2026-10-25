/** Resizes a Sanity CDN image through its URL params. */
export const sized = (url: string | undefined, width: number) =>
  url ? `${url}?w=${width}&auto=format&q=80` : "";

// Project shots are exported as mockups on a pale backdrop; this much of each edge is padding.
const PAD_X = 0.07;
const PAD_Y = 0.135;

/** A project screenshot with the mockup backdrop cropped away, so only the app shows. */
export const shot = (url: string | undefined, width: number) => {
  if (!url) return "";
  // Sanity asset URLs end in "-{width}x{height}.{ext}".
  const dims = url.match(/-(\d+)x(\d+)\.\w+$/);
  if (!dims) return sized(url, width);
  const [w, h] = [Number(dims[1]), Number(dims[2])];
  const rect = [w * PAD_X, h * PAD_Y, w * (1 - PAD_X * 2), h * (1 - PAD_Y * 2)].map(Math.round);
  return `${url}?rect=${rect.join(",")}&w=${width}&auto=format&q=80`;
};

/** Aspect ratio of a cropped `shot`. */
export const SHOT_ASPECT = (4 * (1 - PAD_X * 2)) / (3 * (1 - PAD_Y * 2));
