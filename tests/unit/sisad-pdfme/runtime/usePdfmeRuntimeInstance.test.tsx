import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import React, { useRef } from 'react';
import {
  usePdfmeRuntimeInstance,
  getTemplateSignature,
  scheduleDestroyInstance,
} from '@/sisad-pdfme/runtime/usePdfmeRuntimeInstance';

const makeMockInstance = () => ({
  destroy: vi.fn(),
  updateOptions: vi.fn(),
  updateTemplate: vi.fn(),
  setInputs: vi.fn(),
  fitToPage: vi.fn(),
  fitToWidth: vi.fn(),
  onChangeTemplate: vi.fn(),
  onPageChange: vi.fn(),
  onChangeInput: vi.fn(),
});

describe('getTemplateSignature', () => {
  it('is stable for equal templates and differs for changes', () => {
    const a = { basePdf: 'x', schemas: [[{ name: 'a' }]] };
    const b = { basePdf: 'x', schemas: [[{ name: 'a' }]] };
    const c = { basePdf: 'x', schemas: [[{ name: 'b' }]] };
    expect(getTemplateSignature(a)).toBe(getTemplateSignature(b));
    expect(getTemplateSignature(a)).not.toBe(getTemplateSignature(c));
  });
});

describe('scheduleDestroyInstance', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('calls destroy on next tick', () => {
    const inst = makeMockInstance();
    scheduleDestroyInstance(inst);
    expect(inst.destroy).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(inst.destroy).toHaveBeenCalledOnce();
  });
  it('swallows NotFoundError DOMException', () => {
    const inst = { destroy: vi.fn(() => { throw new DOMException('gone', 'NotFoundError'); }) };
    scheduleDestroyInstance(inst);
    expect(() => vi.runAllTimers()).not.toThrow();
  });
});

describe('usePdfmeRuntimeInstance', () => {
  afterEach(() => cleanup());

  const Harness = ({ instances, mode = 'designer' }: { instances: any[]; mode?: any }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    let i = 0;
    const Designer = vi.fn(function () { return instances[i++]; });
    const Form = vi.fn(function () { return instances[i++]; });
    const Viewer = vi.fn(function () { return instances[i++]; });
    usePdfmeRuntimeInstance({
      containerRef,
      mode,
      template: { basePdf: 'x', schemas: [[]] },
      inputs: [{}],
      options: { lang: 'es' },
      plugins: {},
      runtime: { Designer, Form, Viewer },
      onTemplateChange: vi.fn(),
      autoFit: 'none',
    });
    return <div ref={containerRef} data-testid="container" />;
  };

  it('mounts a Designer instance into the container host', () => {
    const inst = makeMockInstance();
    const { getByTestId } = render(<Harness instances={[inst]} mode="designer" />);
    const host = getByTestId('container').querySelector('.sisad-pdfme-lab-runtime-host');
    expect(host).toBeTruthy();
    expect(host?.getAttribute('data-runtime-mode')).toBe('designer');
  });

  it('destroys the instance on unmount', () => {
    vi.useFakeTimers();
    const inst = makeMockInstance();
    const { unmount } = render(<Harness instances={[inst]} mode="designer" />);
    unmount();
    vi.runAllTimers();
    expect(inst.destroy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
