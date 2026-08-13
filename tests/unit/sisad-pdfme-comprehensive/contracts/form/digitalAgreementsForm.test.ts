import { describe, expect, it } from 'vitest';
import { EXAMPLE_ROUTE_MAP } from '@/examples/config/examplesManifest.js';
import { EXAMPLE_PRIMARY_ROUTES } from '@/examples/config/examplesManifest.js';

describe('DigitalAgreements form example', () => {
  it('registers a dedicated route', () => {
    expect(EXAMPLE_ROUTE_MAP['runtime-form-digital-agreements']).toBe('/runtime/form/digital-agreements');
  });

  it('loads the snapshot config', () => {
    const config = EXAMPLE_PRIMARY_ROUTES.find((page) => page.id === 'runtime-form-digital-agreements');
    expect(config?.formSnapshot?.source).toBe('DigitalAgreements');
    expect(Array.isArray(config?.formSnapshot?.templateFields)).toBe(true);
    expect(config?.formSnapshot?.templateFields?.length).toBeGreaterThan(0);
  });
});
