/**
 * 
 * @param values - An array of class names, which can be strings, false, null, or undefined.
 * @returns A string of class names joined by a space, excluding any false, null, or undefined values.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
