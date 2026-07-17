import '@testing-library/jest-dom';
import { vi } from 'vitest';

if (!window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => undefined,
			removeListener: () => undefined,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			dispatchEvent: () => false,
		}),
	});
}

// Mock rc-util for scrollbar calculation
vi.mock('rc-util/lib/getScrollBarSize', () => ({
	default: () => 0,
}));
