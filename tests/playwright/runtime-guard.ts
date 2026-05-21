import { expect, test as base } from '@playwright/test';

const KNOWN_EXTERNAL_CONSOLE_ERROR_ALLOWLIST: RegExp[] = [
  /favicon\.ico/i,
  /net::ERR_BLOCKED_BY_CLIENT/i,
  /chrome-extension:\/\//i,
  /Extension context invalidated/i,
];

const KNOWN_EXTERNAL_PAGE_ERROR_ALLOWLIST: RegExp[] = [
  /chrome-extension:\/\//i,
  /Extension context invalidated/i,
];

const normalizeRuntimeMessage = (value: string) => value.replace(/\s+/g, ' ').trim();

const isAllowlistedRuntimeNoise = (value: string, allowlist: RegExp[]) => {
  const normalized = normalizeRuntimeMessage(value);
  return allowlist.some((pattern) => pattern.test(normalized));
};

const runtimeFailuresByTestId = new Map<string, Set<string>>();

base.beforeEach(async ({ page }, testInfo) => {
  const failures = new Set<string>();
  runtimeFailuresByTestId.set(testInfo.testId, failures);

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }

    const text = normalizeRuntimeMessage(message.text());
    if (isAllowlistedRuntimeNoise(text, KNOWN_EXTERNAL_CONSOLE_ERROR_ALLOWLIST)) {
      return;
    }

    failures.add(`[console.error] ${text}`);
  });

  page.on('pageerror', (error) => {
    const text = normalizeRuntimeMessage(error?.message ?? String(error));
    if (isAllowlistedRuntimeNoise(text, KNOWN_EXTERNAL_PAGE_ERROR_ALLOWLIST)) {
      return;
    }

    failures.add(`[pageerror] ${text}`);
  });
});

base.afterEach(async ({}, testInfo) => {
  const failures = [...(runtimeFailuresByTestId.get(testInfo.testId) ?? new Set<string>())];
  runtimeFailuresByTestId.delete(testInfo.testId);

  expect(failures, `Unexpected runtime errors detected (${failures.length})\n${failures.join('\n')}`).toEqual([]);
});

export const test = base;
export { expect };
