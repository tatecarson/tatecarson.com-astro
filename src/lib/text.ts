/** Combining diacritical marks — the block Newsreader renders as .notdef boxes. */
const COMBINING = /[̀-ͯ]/;

/**
 * True when a string needs the system-serif fallback rather than Newsreader.
 * Currently only "S̜w͚a̎r̍m̸" (2015) hits this, but it is detected rather than
 * hard-coded so a future title with stacked marks is handled on its own.
 */
export const needsUnicodeFallback = (s: string): boolean => COMBINING.test(s);
