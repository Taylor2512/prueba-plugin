import type { SisadPdfmeSignatureProviderAdapter } from '@sisad-pdfme/config/SisadPdfmeConfig';

export type {  SisadPdfmeSignatureProviderAdapter };

export const createSignatureProviderAdapter = <TInput = unknown>(): SisadPdfmeSignatureProviderAdapter<TInput> => ({
  toProvider(input) {
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      return {
        key: String(record.key ?? record.id ?? '').trim() || 'provider',
        label: String(record.label ?? record.name ?? '').trim() || 'Provider',
        description: String(record.description ?? '').trim() || undefined,
        capabilities: record.capabilities && typeof record.capabilities === 'object'
          ? (record.capabilities as Record<string, boolean>)
          : undefined,
        metadata: record,
      };
    }
    const value = String(input ?? '').trim();
    return { key: value || 'provider', label: value || 'Provider' };
  },
  toProviders(input) {
    return Array.isArray(input) ? input.map((entry) => this.toProvider(entry)) : [];
  },
});
