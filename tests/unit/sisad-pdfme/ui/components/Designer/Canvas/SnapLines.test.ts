import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/Canvas/SnapLines';

describe('sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('snaps to the nearest guide without duplicating positions', () => {
    const result = moduleUnderTest.computeSnapResult(
      { x: 9.7, y: 14.9, width: 10, height: 6 },
      { width: 100, height: 100 },
      [{ x: 10, y: 15, width: 10, height: 10 }],
      2,
    );

    expect(result.snapped.x).toBe(10);
    expect(result.snapped.y).toBe(15);
    expect(result.lines.some((line) => line.type === 'vertical' && line.pos === 10)).toBe(true);
    expect(result.lines.some((line) => line.type === 'horizontal' && line.pos === 15)).toBe(true);
  });
});
