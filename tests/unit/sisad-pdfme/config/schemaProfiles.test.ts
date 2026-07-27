import { describe, expect, it } from 'vitest';
import {
  createSchemaConfigurationProfile,
  resolveSchemaConfigurationFamily,
} from '@/sisad-pdfme/config/schemaConfigurationProfile';
import { createSchemaCapabilityResolver } from '@/sisad-pdfme/config/schemaCapabilityResolver';

describe('schema configuration profiles', () => {
  it('builds a text-like profile with shared inspector and canvas capabilities', () => {
    const profile = createSchemaConfigurationProfile('text');

    expect(resolveSchemaConfigurationFamily('text')).toBe('text-like');
    expect(profile.family).toBe('text-like');
    expect(profile.semanticFamily).toBe('text');
    expect(profile.catalog.category).toBe('Texto');
    expect(profile.canvas.canInlineEdit).toBe(true);
    expect(profile.canvas.customFallback).toBe(false);
    expect(profile.inspector.visibleSections).toContain('identity');
    expect(profile.runtime.supported).toBe(true);
    expect(profile.capabilities.supportsInlineEdit).toBe(true);
  });

  it('builds an option-based profile with stable option capabilities', () => {
    const profile = createSchemaConfigurationProfile('checkboxgroup');

    expect(profile.family).toBe('option-based');
    expect(profile.catalog.category).toBe('Selecciones');
    expect(profile.canvas.isOptionBased).toBe(true);
    expect(profile.capabilities.supportsOptions).toBe(true);
    expect(profile.inspectorPreset.supportsValidation).toBe(true);
  });

  it('keeps runtime enabled even when the catalog is filtered out explicitly', () => {
    const profile = createSchemaConfigurationProfile('signature');
    const resolver = createSchemaCapabilityResolver(profile);

    const catalog = resolver.resolveCatalog({ catalogEnabledTypes: ['text'] });
    const runtime = resolver.resolveRuntime({ catalogEnabledTypes: ['text'] });

    expect(catalog.visible).toBe(false);
    expect(catalog.executable).toBe(false);
    expect(catalog.reason).toBe('catalog-disabled');
    expect(runtime.visible).toBe(true);
    expect(runtime.executable).toBe(true);
    expect(runtime.reason).toBeUndefined();
  });

  it('falls back to a stable custom profile for unknown schema types', () => {
    const profile = createSchemaConfigurationProfile('myCustomField');

    expect(profile.family).toBe('custom');
    expect(profile.configuration.customFallback).toBe(true);
    expect(profile.catalog.category).toBe('General');
    expect(profile.canvas.customFallback).toBe(true);
    expect(profile.runtime.supported).toBe(true);
  });
});
