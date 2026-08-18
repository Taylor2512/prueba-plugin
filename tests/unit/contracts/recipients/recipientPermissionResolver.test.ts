import { describe, expect, it } from 'vitest';
import { createRecipientPermissionResolver } from '@sisad-pdfme/recipients/recipientPermissionResolver';
import type { SisadPdfmeRecipient } from '@sisad-pdfme/recipients/recipientTypes';

const r = (role = 'editor', extra: Partial<SisadPdfmeRecipient> = {}): SisadPdfmeRecipient => ({
  id: 'r1',
  label: 'Recipient 1',
  role,
  ...extra,
});
describe('recipient permissions',()=>{
  it('null recipient allowed by default',()=>expect(createRecipientPermissionResolver().canEditStructure(null)).toBe(true));
  it('editor allowed',()=>expect(createRecipientPermissionResolver().canEditStructure(r())).toBe(true));
  it('viewer denied',()=>expect(createRecipientPermissionResolver().canEditStructure(r('viewer'))).toBe(false));
  it('reviewer denied',()=>expect(createRecipientPermissionResolver().canEditStructure(r('reviewer'))).toBe(false));
  it('commenter denied',()=>expect(createRecipientPermissionResolver().canEditStructure(r('commenter'))).toBe(false));
  it('role normalization',()=>expect(createRecipientPermissionResolver().canEditStructure(r(' Viewer '))).toBe(false));
  it('disabled denied',()=>expect(createRecipientPermissionResolver().canEditStructure(r('editor',{disabled:true}))).toBe(false));
  it('explicit true override',()=>expect(createRecipientPermissionResolver({canEditStructure:true}).canEditStructure(r('viewer'))).toBe(true));
  it('explicit false override',()=>expect(createRecipientPermissionResolver({canEditStructure:false}).canEditStructure(r())).toBe(false));
  it('assign unlocked',()=>expect(createRecipientPermissionResolver().canAssign({},r())).toBe(true));
  it('assign locked denied',()=>expect(createRecipientPermissionResolver().canAssign({locked:true},r())).toBe(false));
  it('assign readonly recipient denied',()=>expect(createRecipientPermissionResolver().canAssign({},r('viewer'))).toBe(false));
  it('unassign default',()=>expect(createRecipientPermissionResolver().canUnassign(r())).toBe(true));
  it('unassign config false',()=>expect(createRecipientPermissionResolver({config:{allowUnassigned:false}}).canUnassign(r())).toBe(false));
  it('share default',()=>expect(createRecipientPermissionResolver().canShare(r())).toBe(true));
  it('share config false',()=>expect(createRecipientPermissionResolver({config:{allowShared:false}}).canShare(r())).toBe(false));
});
