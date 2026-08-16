import { describe, expect, it } from 'vitest';
import {
  lockSchema,
  unlockSchema,
  filterSchemasByCollaborationScope,
  buildCollaborationPresenceState,
} from '@sisad-pdfme/collaboration';

describe('collaboration state public capability', () => {
  it('exposes schema ownership, filtering and presence operations', () => {
    expect(typeof lockSchema).toBe('function');
    expect(typeof unlockSchema).toBe('function');
    expect(typeof filterSchemasByCollaborationScope).toBe('function');
    expect(typeof buildCollaborationPresenceState).toBe('function');
  });
});
