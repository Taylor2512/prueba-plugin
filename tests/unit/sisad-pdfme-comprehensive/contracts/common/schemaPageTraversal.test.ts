import { describe, expect, it, vi } from 'vitest';
import { forEachSchemaInPages, findSchemaInPages } from '@sisad-pdfme/common/schemaPageTraversal';
describe('schema page traversal',()=>{
  it('page order',()=>{const x:string[]=[];forEachSchemaInPages([['a','b'],['c']],({schema})=>x.push(schema));expect(x).toEqual(['a','b','c']);});
  it('page index',()=>{const x:number[]=[];forEachSchemaInPages([['a'],['b']],({pageIndex})=>x.push(pageIndex));expect(x).toEqual([0,1]);});
  it('schema index',()=>{const x:number[]=[];forEachSchemaInPages([['a','b']],({schemaIndex})=>x.push(schemaIndex));expect(x).toEqual([0,1]);});
  it('empty page no visit',()=>{const fn=vi.fn();forEachSchemaInPages([[]],fn);expect(fn).not.toHaveBeenCalled();});
  it('find match',()=>expect(findSchemaInPages([['a'],['b']],x=>x==='b')).toBe('b'));
  it('stop after first match',()=>{const fn=vi.fn((x:string)=>x==='b');findSchemaInPages([['a','b','b']],fn);expect(fn).toHaveBeenCalledTimes(2);});
  it('missing→null',()=>expect(findSchemaInPages([['a']],x=>x==='x')).toBeNull());
});
