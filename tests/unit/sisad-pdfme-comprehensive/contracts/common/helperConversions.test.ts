import { describe, expect, it } from 'vitest';
import { mm2pt, pt2mm, pt2px, px2mm, isHexValid } from '@sisad-pdfme/common/helper';
describe('unit/color helpers',()=>{
  it('mm2pt zero',()=>expect(mm2pt(0)).toBe(0));
  it('pt2mm zero',()=>expect(pt2mm(0)).toBe(0));
  it('pt2px zero',()=>expect(pt2px(0)).toBe(0));
  it('px2mm zero',()=>expect(px2mm(0)).toBe(0));
  it('mm↔pt roundtrip',()=>expect(pt2mm(mm2pt(25))).toBeCloseTo(25,2));
  it('96px≈25.4mm',()=>expect(px2mm(96)).toBeCloseTo(25.4,4));
  it('hex3',()=>expect(isHexValid('#fff')).toBe(true));
  it('hex4',()=>expect(isHexValid('#ffff')).toBe(true));
  it('hex6',()=>expect(isHexValid('#112233')).toBe(true));
  it('hex8',()=>expect(isHexValid('#11223344')).toBe(true));
  it('missing # rejected',()=>expect(isHexValid('112233')).toBe(false));
  it('invalid digits rejected',()=>expect(isHexValid('#xyz')).toBe(false));
  it('hex5 rejected',()=>expect(isHexValid('#12345')).toBe(false));
});
