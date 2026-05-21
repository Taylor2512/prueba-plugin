export function makeKeyboardEvent(overrides: Partial<KeyboardEvent & { isComposing: boolean }> = {}): KeyboardEvent {
  return {
    key: '',
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    isComposing: false,
    target: null,
    ...overrides,
  } as unknown as KeyboardEvent;
}

export function mockNavigator(platform: string, userAgent = ''): void {
  Object.defineProperty(globalThis, 'navigator', {
    value: { platform, userAgent },
    configurable: true,
    writable: true,
  });
}
