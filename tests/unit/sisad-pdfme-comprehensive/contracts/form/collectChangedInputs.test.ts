import { describe, expect, it } from 'vitest';
import { collectChangedInputs } from '@sisad-pdfme/ui/Form';
describe('collectChangedInputs', () => {
  it('empty→empty',()=>expect(collectChangedInputs([],[])).toEqual([]));
  it('equal records',()=>expect(collectChangedInputs([{a:'1'}],[{a:'1'}])).toEqual([]));
  it('changed field',()=>expect(collectChangedInputs([{a:'1'}],[{a:'2'}])).toEqual([{index:0,name:'a',value:'2'}]));
  it('added field',()=>expect(collectChangedInputs([{}],[{a:'1'}])).toEqual([{index:0,name:'a',value:'1'}]));
  it('removed field',()=>expect(collectChangedInputs([{a:'1'}],[{}])).toEqual([{index:0,name:'a',value:undefined}]));
  it('appended unit',()=>expect(collectChangedInputs([],[{a:'1'}])).toEqual([{index:0,name:'a',value:'1'}]));
  it('removed unit',()=>expect(collectChangedInputs([{a:'1'}],[])).toEqual([{index:0,name:'a',value:undefined}]));
  it('multiple changed fields',()=>expect(collectChangedInputs([{a:'1',b:'2'}],[{a:'3',b:'4'}])).toEqual([{index:0,name:'a',value:'3'},{index:0,name:'b',value:'4'}]));
  it('unchanged sibling isolation',()=>expect(collectChangedInputs([{a:'1',b:'2'}],[{a:'1',b:'3'}])).toEqual([{index:0,name:'b',value:'3'}]));
  it('multi-unit isolation',()=>expect(collectChangedInputs([{a:'1'},{a:'2'}],[{a:'3'},{a:'4'}])).toEqual([{index:0,name:'a',value:'3'},{index:1,name:'a',value:'4'}]));
  it('does not mutate previous',()=>{const x=[{a:'1'}];collectChangedInputs(x,[{a:'2'}]);expect(x).toEqual([{a:'1'}]);});
  it('does not mutate next',()=>{const x=[{a:'2'}];collectChangedInputs([{a:'1'}],x);expect(x).toEqual([{a:'2'}]);});
});
