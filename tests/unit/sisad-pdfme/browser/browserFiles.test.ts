import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createObjectUrl, revokeObjectUrls } from '@/sisad-pdfme/browser/objectUrls';
import { downloadUrl, downloadJson } from '@/sisad-pdfme/browser/downloads';

describe('browser/objectUrls', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:fake'),
      revokeObjectURL: vi.fn(),
    } as any);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('createObjectUrl wraps bytes in a Blob', () => {
    expect(createObjectUrl('hi', 'text/plain')).toBe('blob:fake');
    expect((URL.createObjectURL as any)).toHaveBeenCalledOnce();
  });

  it('revokeObjectUrls skips falsy entries', () => {
    revokeObjectUrls(['blob:a', null, undefined, '']);
    expect((URL.revokeObjectURL as any)).toHaveBeenCalledTimes(1);
    expect((URL.revokeObjectURL as any)).toHaveBeenCalledWith('blob:a');
  });

  it('createObjectUrl returns empty string when URL API missing', () => {
    vi.stubGlobal('URL', undefined as any);
    expect(createObjectUrl('x', 'text/plain')).toBe('');
  });
});

describe('browser/downloads', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:json'),
      revokeObjectURL: vi.fn(),
    } as any);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('downloadUrl clicks a synthetic anchor', () => {
    const click = vi.fn();
    const anchor = { href: '', download: '', click } as any;
    const spy = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    downloadUrl('blob:x', 'file.pdf');
    expect(anchor.href).toBe('blob:x');
    expect(anchor.download).toBe('file.pdf');
    expect(click).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it('downloadJson returns the object URL', () => {
    const spy = vi.spyOn(document, 'createElement').mockReturnValue({ href: '', download: '', click: vi.fn() } as any);
    expect(downloadJson({ a: 1 }, 'd.json')).toBe('blob:json');
    spy.mockRestore();
  });
});
