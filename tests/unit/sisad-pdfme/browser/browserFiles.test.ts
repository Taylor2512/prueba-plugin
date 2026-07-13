import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createObjectUrl, revokeObjectUrls } from '@/sisad-pdfme/browser/objectUrls';
import { downloadUrl, downloadJson } from '@/sisad-pdfme/browser/downloads';

type UrlMock = typeof URL & {
  createObjectURL: ReturnType<typeof vi.fn>;
  revokeObjectURL: ReturnType<typeof vi.fn>;
};

const createUrlMock = () => ({
  createObjectURL: vi.fn(() => 'blob:fake'),
  revokeObjectURL: vi.fn(),
});

describe('browser/objectUrls', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', createUrlMock() as unknown as UrlMock);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('createObjectUrl wraps bytes in a Blob', () => {
    expect(createObjectUrl('hi', 'text/plain')).toBe('blob:fake');
    expect(vi.mocked(URL.createObjectURL)).toHaveBeenCalledOnce();
  });

  it('revokeObjectUrls skips falsy entries', () => {
    revokeObjectUrls(['blob:a', null, undefined, '']);
    expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith('blob:a');
  });

  it('createObjectUrl returns empty string when URL API missing', () => {
    vi.stubGlobal('URL', undefined as unknown as typeof URL);
    expect(createObjectUrl('x', 'text/plain')).toBe('');
  });
});

describe('browser/downloads', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', createUrlMock() as unknown as UrlMock);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('downloadUrl clicks a synthetic anchor', () => {
    const click = vi.fn();
    const anchor = { href: '', download: '', click } satisfies Pick<HTMLAnchorElement, 'href' | 'download' | 'click'>;
    const spy = vi.spyOn(document, 'createElement').mockReturnValue(anchor as HTMLAnchorElement);
    downloadUrl('blob:x', 'file.pdf');
    expect(anchor.href).toBe('blob:x');
    expect(anchor.download).toBe('file.pdf');
    expect(click).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it('downloadJson returns the object URL', () => {
    const spy = vi.spyOn(document, 'createElement').mockReturnValue(
      { href: '', download: '', click: vi.fn() } as HTMLAnchorElement,
    );
    expect(downloadJson({ a: 1 }, 'd.json')).toBe('blob:json');
    spy.mockRestore();
  });
});
