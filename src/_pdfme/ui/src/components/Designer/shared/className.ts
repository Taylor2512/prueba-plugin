const tokenize = (value: string) =>
  value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

export const mergeClassNames = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

export const mergeUniqueClassNames = (...classes: Array<string | undefined | null | false>) =>
  Array.from(new Set(classes.filter(Boolean).flatMap((value) => tokenize(String(value))))).join(' ');

export const resolveFirstClassSelector = (className: string | undefined, fallback: string) => {
  const normalized = (className || fallback).trim();
  const firstClass = normalized.split(/\s+/).find(Boolean);
  return firstClass || fallback;
};
